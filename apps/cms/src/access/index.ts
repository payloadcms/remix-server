import type { Where } from 'payload/types';

export const authenticatedAndAdmin = ({ req: { user } }) =>
    user && user?.role === 'admin';

export const pageIsPublic = (): Where => ({
    public: {
        equals: true,
    },
});
