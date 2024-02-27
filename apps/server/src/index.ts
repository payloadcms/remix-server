import fs from 'node:fs';
import path from 'node:path';

import { createRequestHandler, installGlobals } from '@org/web/express';

import compression from 'compression';
import express from 'express';
import morgan from 'morgan';

import { dotenv } from '@org/shared';
import { payload } from '@org/cms';

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
const WEB_DIR = path.join(process.cwd(), '../web');
const WEB_BUILD_CLIENT = path.join(WEB_DIR, 'build/client');
const WEB_BUILD_CLIENT_ASSETS = path.join(WEB_BUILD_CLIENT, 'assets');

installGlobals();

const viteDevServer =
    process.env.NODE_ENV === 'production'
        ? undefined
        : await import('vite').then((vite) =>
              vite.createServer({
                  root: WEB_DIR,
                  server: { middlewareMode: true },
              }),
          );

const remixHandler = createRequestHandler({
    build: viteDevServer
        ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
        : await import(path.join(WEB_DIR, 'build/server/index.js')),
    mode: ENVIRONMENT,
    getLoadContext(req, res) {
        return {
            payload: req.payload,
            user: req?.user,
            res,
        };
    },
});

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

await payload.init({
    express: app,
    secret: PAYLOADCMS_SECRET,
    onInit: () => {
        payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
});

app.use(payload.authenticate);

// handle asset requests
if (viteDevServer) {
    app.use(viteDevServer.middlewares);
} else {
    // Vite fingerprints its assets so we can cache forever.
    app.use(
        '/assets',
        express.static(WEB_BUILD_CLIENT_ASSETS, {
            immutable: true,
            maxAge: '1y',
        }),
    );
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static(WEB_BUILD_CLIENT, { maxAge: '1h' }));

app.use(morgan('tiny'));

// handle SSR requests
app.all('*', remixHandler);

const port = process.env.PORT || 3000;
app.listen(port, () =>
    console.log(`Express server listening at http://localhost:${port}`),
);
