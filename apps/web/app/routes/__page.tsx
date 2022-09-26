import { NavLink, Outlet, useMatches } from '@remix-run/react';
import { Button } from '@org/ui';
import { Logo } from '~/components/Logo';
import type { RootLoaderData } from '~/root';

export default function Index() {
    const matches = useMatches();

    const [{ data }] = matches;
    const { pages, user } = (data as RootLoaderData) || {};

    return !pages ? (
        <div></div>
    ) : (
        <div className="page">
            <nav>
                <ul className="container">
                    <li>
                        <Logo />
                    </li>
                    <div className="nav-pages">
                        {pages?.map((page) => (
                            <li key={page.slug}>
                                <NavLink to={page.slug ?? '/'}>
                                    {page.title}
                                </NavLink>
                            </li>
                        ))}
                    </div>
                    <li>
                        {user ? (
                            <form action="/logout" method="POST">
                                <Button
                                    as="input"
                                    value="Log out"
                                    size="small"
                                    color="dark"
                                    type="submit"
                                />
                            </form>
                        ) : (
                            <Button
                                as={NavLink}
                                to="/login"
                                size="small"
                                color="dark"
                            >
                                Log in
                            </Button>
                        )}
                    </li>
                </ul>
            </nav>
            <Outlet />
        </div>
    );
}
