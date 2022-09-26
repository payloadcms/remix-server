import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';

export const action: ActionFunction = async ({ context: { res } }) => {
    const cookieOptions = {
        path: '/',
        httpOnly: true,
        sameSite: 'lax' as 'lax', // Litteral types out of wack, typescript?
    };
    res.clearCookie('payload-token', cookieOptions);
    return redirect('/');
};

export default () => {
    <div className='container place-content-center'>
        <h2>You have been successfully logged out</h2>
    </div>
}
