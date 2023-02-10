import type { PayloadRequest, Where } from 'payload/types';

export const authenticatedAndAdmin = ({ req: { user } }: {req: PayloadRequest}) =>
    !!user && user?.role === 'admin';

export const pageIsPublic = (): Where => ({
    public: {
        equals: true,
    },
});
