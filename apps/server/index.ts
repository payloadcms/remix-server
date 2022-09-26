import path = require('path');
import fs = require('fs');

import express = require('express');
import cms = require('@org/cms');
import shared = require('@org/shared');
import webExpressAdapter = require('@org/web/express');

const { payload } = cms;
const { dotenv } = shared;
const { createRequestHandler } = webExpressAdapter;

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

const MONGODB_URL = process.env.MONGODB_URL;
const PAYLOADCMS_SECRET = process.env.PAYLOADCMS_SECRET;
const ENVIRONMENT = process.env.NODE_ENV;

// During development this is fine. Conditionalize this for production as needed.
const WEB_BUILD_DIR = path.join(process.cwd(), '../web/build');
const WEB_PUBLIC_DIR = path.join(process.cwd(), '../web/public/web');
const WEB_PUBLIC_BUILD_DIR = path.join(
    process.cwd(),
    '../web/public/web/build'
);

const app = express();
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

payload.init({
    express: app,
    mongoURL: MONGODB_URL,
    secret: PAYLOADCMS_SECRET,
    onInit: () => {
        payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
});

app.use(payload.authenticate);

app.all(
    '*',
    ENVIRONMENT === 'development'
        ? (req, res, next) => {
              purgeRequireCache();

              return createRequestHandler({
                  build: require(WEB_BUILD_DIR),
                  mode: ENVIRONMENT,
                  getLoadContext(req, res) {
                      return {
                          payload: req.payload,
                          user: req?.user,
                          res,
                      };
                  },
              })(req, res, next);
          }
        : createRequestHandler({
              build: require(WEB_BUILD_DIR),
              mode: ENVIRONMENT,
              getLoadContext(req, res) {
                  return {
                      payload: req.payload,
                      user: req?.user,
                      res,
                  };
              },
          })
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});

function purgeRequireCache() {
    // purge require cache on requests for "server side HMR" this won't let
    // you have in-memory objects between requests in development,
    // alternatively you can set up nodemon/pm2-dev to restart the server on
    // file changes, but then you'll have to reconnect to databases/etc on each
    // change. We prefer the DX of this, so we've included it for you by default

    for (const key in require.cache) {
        if (key.startsWith(WEB_BUILD_DIR)) {
            delete require.cache[key];
        }
    }
}
