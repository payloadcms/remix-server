import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';

import {
    createRequestHandler,
    broadcastDevReady,
    installGlobals,
    GetLoadContextFunction,
} from '@org/web/express';
import type { RequestHandler, ServerBuild } from '@org/web/express';
import { dotenv } from '@org/shared';
import { payload } from '@org/cms';

import compression from 'compression';
import express from 'express';
import morgan from 'morgan';
import sourceMapSupport from 'source-map-support';

// Loading environment variables, .env > .env.local
const config = dotenv.config();

if (config.error) {
    throw config.error;
}

const localEnvFilePath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(localEnvFilePath)) {
    const localConfig = dotenv.config({
        path: localEnvFilePath,
        override: true,
    });
    if (localConfig.error) {
        throw localConfig.error;
    }
}

const PAYLOADCMS_SECRET = process.env.PAYLOADCMS_SECRET ?? '';
const ENVIRONMENT = process.env.NODE_ENV;

// During development this is fine. Conditionalize this for production as needed.
const WEB_BUILD_DIR = path.join(process.cwd(), '../web/build');
const WEB_PUBLIC_DIR = path.join(process.cwd(), '../web/public/web');
const WEB_PUBLIC_BUILD_DIR = path.join(
    process.cwd(),
    '../web/public/web/build'
);
const WEB_BUILD_PATH = path.join(WEB_BUILD_DIR, 'index.js');
const WEB_VERSION_PATH = path.join(WEB_BUILD_DIR, 'version.js');

sourceMapSupport.install({
    retrieveSourceMap: function (source) {
        const match = source.startsWith('file://');
        if (match) {
            const filePath = url.fileURLToPath(source);
            const sourceMapPath = `${filePath}.map`;
            if (fs.existsSync(sourceMapPath)) {
                return {
                    url: source,
                    map: fs.readFileSync(sourceMapPath, 'utf8'),
                };
            }
        }
        return null;
    },
});
installGlobals();

const initialBuild = await reimportServer();

const getLoadContext: GetLoadContextFunction = (req, res) => {
    return {
        payload: req.payload,
        user: req?.user,
        res,
    };
};

const remixHandler =
    ENVIRONMENT === 'development'
        ? await createDevRequestHandler(initialBuild)
        : createRequestHandler({
              build: initialBuild,
              mode: ENVIRONMENT,
              getLoadContext,
          });

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// Serving the web static files with different caching strategies
app.use(
    '/web/build',
    express.static(WEB_PUBLIC_BUILD_DIR, {
        immutable: true,
        maxAge: '1y',
        redirect: false,
    })
);
app.use(
    '/web',
    express.static(WEB_PUBLIC_DIR, { maxAge: '1h', redirect: false })
);

app.use(morgan('tiny'));

await payload.init({
    express: app,
    secret: PAYLOADCMS_SECRET,
    onInit: () => {
        payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
});

app.use(payload.authenticate);

app.all('*', remixHandler);

const port = process.env.PORT || 3000;
app.listen(port, async () => {
    console.log(`Express server listening at http://localhost:${port}`);

    if (ENVIRONMENT === 'development') {
        broadcastDevReady(initialBuild);
    }
});

async function reimportServer(): Promise<ServerBuild> {
    const stat = fs.statSync(WEB_BUILD_PATH);

    // convert build path to URL for Windows compatibility with dynamic `import`
    const BUILD_URL = url.pathToFileURL(WEB_BUILD_PATH).href;

    // use a timestamp query parameter to bust the import cache
    return import(BUILD_URL + '?t=' + stat.mtimeMs);
}

async function createDevRequestHandler(
    initialBuild: ServerBuild
): Promise<RequestHandler> {
    let build = initialBuild;
    async function handleServerUpdate() {
        // 1. re-import the server build
        build = await reimportServer();
        // 2. tell Remix that this app server is now up-to-date and ready
        broadcastDevReady(build);
    }
    const chokidar = await import('chokidar');
    chokidar
        .watch(WEB_VERSION_PATH, { ignoreInitial: true })
        .on('add', handleServerUpdate)
        .on('change', handleServerUpdate);

    // wrap request handler to make sure its recreated with the latest build for every request
    return async (req, res, next) => {
        try {
            return createRequestHandler({
                build,
                mode: ENVIRONMENT,
                getLoadContext,
            })(req, res, next);
        } catch (error) {
            next(error);
        }
    };
}

