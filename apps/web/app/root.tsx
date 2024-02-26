import type { Page, User } from '@org/cms';
import type {
    LinksFunction,
    LoaderFunction,
    V2_MetaFunction,
    TypedResponse,
} from '@remix-run/node';
import { redirect } from '@remix-run/node';
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useRouteError,
    isRouteErrorResponse,
} from '@remix-run/react';

import uiStyles from '@org/ui/styles.css';
import styles from './styles/global.css';

export const meta: V2_MetaFunction = () => {
    return [
        { charSet: 'utf-8' },
        { title: 'Payload CMS & Remix Monorepo' },
        { name: 'viewport', content: 'width=device-width,initial-scale=1' }
    ];
};

export const links: LinksFunction = () => [
    {
        rel: 'stylesheet',
        href: uiStyles,
    },
    {
        rel: 'stylesheet',
        href: styles,
    },
];

export type RootLoaderData = {
    pages: Page[];
    user?: {
        user?: User;
        token?: string;
        exp?: number;
    };
};
export const loader: LoaderFunction = async ({
    context: { payload, user },
    request,
}): Promise<RootLoaderData | TypedResponse<never>> => {
   const { pathname } = new URL(request.url);
    if (pathname === '/') {
        return redirect('/home');
    }

    const { docs: pages } = await payload.find({
        collection: 'pages',
        user,
        overrideAccess: false,
    });

    return { pages, user };
};

export default function App() {
    return (
        <html lang="en">
            <head>
                <Meta />
                <Links />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin=""
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <div>
                <h1>Oops</h1>
                <p>Status: {error.status}</p>
                <p>{error.data.message}</p>
            </div>
        );
    }

    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
        errorMessage = error.message;
    }

    return (
        <div>
            <h1>Uh oh ...</h1>
            <p>Something went wrong.</p>
            <pre>{errorMessage}</pre>
        </div>
    );
}
