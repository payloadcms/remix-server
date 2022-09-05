import type { ActionFunction } from '@remix-run/node';
import { Response } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Link } from '@remix-run/react';

export const action: ActionFunction = async ({
    context: { payload, user, res },
    request,
}) => {
    if (user) {
        return redirect('/');
    }

    const form = await request.formData();
    const email = form.get('email');
    const password = form.get('password');
    if (typeof email !== 'string' || typeof password !== 'string') {
        return new Response('You must provide both a email and a password', {
            status: 401,
        });
    }

    await payload.login({
        collection: 'users',
        data: { email, password },
        res,
    });

    return redirect('/');
};

export default function Login() {
    return (
        <div className="card">
            <h1 className="mb-2">Login</h1>
            <form action="/login" method="POST" className="column">
                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="text" />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" />
                </div>
                <button type="submit">Login</button>
            </form>
            <Link to="/">Back to home</Link>
        </div>
    );
}
