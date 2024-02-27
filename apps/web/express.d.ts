import type { PayloadRequest } from '@org/cms/types';
import type { ServerBuild } from "@remix-run/node";

export type GetLoadContextFunction = (req: PayloadRequest, res: Express.Response) => RemixRequestContext;
export type RequestHandler = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => Promise<void>;

declare module '@remix-run/express' {
    export declare function createRequestHandler({ build, getLoadContext, mode, }: {
        build: ServerBuild;
        getLoadContext?: GetLoadContextFunction;
        mode?: string;
    }): RequestHandler;
}

export { createRequestHandler } from '@remix-run/express';
export { broadcastDevReady, installGlobals } from '@remix-run/node';
export type { ServerBuild } from '@remix-run/node';
