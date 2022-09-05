import type {
    ErrorBoundaryComponent,
    LinksFunction,
    MetaFunction,
} from '@remix-run/node';
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from '@remix-run/react';

import styles from './styles/global.css';

export const meta: MetaFunction = () => ({
    charset: 'utf-8',
    title: 'Payload CMS & Remix Monorepo',
    viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => [
    {
        rel: 'stylesheet',
        href: styles,
    },
];

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

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
    return (
        <html lang="en">
            <head>
                <Meta />
                <Links />
            </head>
            <body>
                <div>ERROR: {error.message}</div>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
};
