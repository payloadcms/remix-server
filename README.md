# [Payload CMS](https://payloadcms.com/) and [Remix](https://remix.run/) monorepo

This is an example repository of how to set up Payload CMS for content management together with Remix, in such a manner that each application is divided into its own package (including the express server app).

The Payload instance is injected into Remix loaders and actions through request context. This way we are free to use the Payload Local API for data, user and authentication management, while avoiding payload having to be bundled together with the remix server build. With this setup you can even use the Payload Authentication middleware in your remix application.

## What's inside?

This monorepo is using `pnpm` for package management. While it is an easy task to switch to `yarn` instead, setting this up with `npm` workspaces can be trickier. For monorepos we do recommend `pnpm` due to its ability to handle hoisting in a better way, which avoids dependency related issues.

### Apps and Packages

-   `/apps/cms`: a [Payload CMS](https://payloadcms.com/) application, which will act as our backend and admin interface
-   `/apps/web`: a [Remix](https://remix.run/) application, which will act as our frontend
-   `/apps/server`: a [ExpressJS](https://expressjs.com/) application that ties all our middleware, static file serving and routing needs together
-   `/packages/ui`: a stub React component library shared by both `web` and `cms` applications
-   `/packages/shared`: a package that all out apps use that contains shared dependencies, in order to reduce bundle sizes
-   `/packages/eslint-config-custom`: `eslint` configurations

### Utilities

-   [TypeScript](https://www.typescriptlang.org/) for static type checking
-   [ESLint](https://eslint.org/) for code linting
-   [Prettier](https://prettier.io) for code formatting
-   [Turborepo](https://turborepo.org/) for running monorepo builds and script in a DX friendly and parallel manner
-   [Nodemon](https://www.npmjs.com/package/nodemon) for running the express server while listening to file changes in the Payload CMS package

## Setup

Get started by running `pnpm install` from the root of the monorepo. Create a `/apps/server/.env.local` file based on `/apps/server/.env` and add your connection string to MongoDB as well as a secret for PayloadCMS to use in order to keep your data secure. `.env` will be loaded first, and then `.env.local`. That way you can keep your non-secret variables in the `.env` files which also is commited to git, and secret variables in `.env.local` that isn't commited to git.

### Develop

To develop all apps and packages, run `pnpm run dev` from the root of the monorepo. This will start the express server that serves both the Remix and PayloadCMS applications.
When saving file changes in the `apps/cms` package, the running express server will restart in order for the Payload CMS configuration changes to take effect.
Remix is reloaded without restarting the express server by purging the node `require()` cache of previously imported Remix files.

### Build

To build all apps and packages, run `pnpm run build` from the root of the monorepo. Turborepo will take care of running the build scripts in order so that packages depending on other monorepo packages is built last.

If you want, serve your production build with `pnpm run serve` from the root of the monorepo.
