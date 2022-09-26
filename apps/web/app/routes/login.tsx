import type { ActionFunction } from '@remix-run/node';
import { Response } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { Logo } from '~/components/Logo';

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
        <div className="container viewport-size place-content-center">
            <div className="row gap-2 justify-center mb-8">
                <Logo className="logo-large" />
                <h1>Login</h1>
            </div>
            <form
                action="/login"
                method="POST"
                className="form-column login-form"
            >
                <div>
                    <label htmlFor="email">Email Address</label>
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
