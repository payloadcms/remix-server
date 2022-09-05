import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import type { User } from '@org/cms';

type LoaderData = {
    users: User[];
    authenticatedUser?: {
        user?: User;
        token?: string;
        exp?: number;
    };
};
export const loader: LoaderFunction = async ({
    context: { payload, user },
}): Promise<LoaderData> => {
    if (!user) {
        return { users: [], authenticatedUser: undefined };
    }
    const { docs: users } = await payload.find({
        collection: 'users',
    });

    return { users, authenticatedUser: user };
};

export const action: ActionFunction = async ({ context: { res } }) => {
    const cookieOptions = {
        path: '/',
        httpOnly: true,
        sameSite: 'lax' as 'lax', // Litteral types out of wack, typescript?
    };
    res.clearCookie('payload-token', cookieOptions);
    return null;
};

export default function Index() {
    const { users, authenticatedUser } = useLoaderData<LoaderData>();

    const logout = useFetcher();
    return (
        <div className="card column">
            <div>
                <h1>Welcome to your Remix app!</h1>
                <pre>
                    <i>powered by a PayloadCMS backend</i>
                </pre>
            </div>
            <div>
                {users && users.length ? (
                    <>
                        <h2>All PayloadCMS users:</h2>
                        <ul>
                            {users.map((user) => (
                                <li key={user.id}>
                                    {user.name} - <i>{user.email}</i>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <h2>Log in to list users here</h2>
                )}
            </div>
            {authenticatedUser ? (
                <a
                    href="#"
                    onClick={() => logout.submit({}, { method: 'post' })}
                >
                    Log out
                </a>
            ) : (
                <Link to="/login">Log in</Link>
            )}
        </div>
    );
}
