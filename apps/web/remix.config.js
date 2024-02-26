/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
    ignoredRouteFiles: ['**/.*'],
    assetsBuildDirectory: 'public/web/build',
    publicPath: '/web/build/',
    serverDependenciesToBundle: ['@org/ui'],
    // appDirectory: "app",
    // serverBuildPath: "build/index.js",
    watchPaths: ['../../packages/ui', '../../packages/shared'],
    future: {
        v2_errorBoundary: true,
        v2_normalizeFormMethod: true,
        v2_meta: true,
        v2_routeConvention: true
    }
};
