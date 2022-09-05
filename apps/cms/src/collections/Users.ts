import { Payload } from 'payload';
import { CollectionConfig } from 'payload/types.js';

const usersSlug = 'users';
const Users: CollectionConfig = {
    slug: usersSlug,
    auth: true,
    admin: {
        useAsTitle: 'name',
    },
    access: {
        read: ({ req: { user } }) => Boolean(user),
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'role',
            type: 'select',
            required: true,
            options: [
                {
                    label: 'Admin',
                    value: 'admin',
                },
                {
                    label: 'User',
                    value: 'user',
                },
            ],
        },
    ],
};

export const seedUsers = async (payload: Payload) => {
    const { totalDocs } = await payload.find({
        collection: usersSlug,
    });
    if (!totalDocs) {
        payload.create({
            collection: usersSlug,
            data: {
                email: 'dev@payloadcms.com',
                password: 'qwerty',
                name: 'Dev User',
                role: 'admin',
            },
        });
        payload.create({
            collection: usersSlug,
            data: {
                email: 'user@payloadcms.com',
                password: 'qwerty',
                name: 'Frontend User',
                role: 'user',
            },
        });
        payload.logger.info(`Successfully seeded users into database`);
    }
};

export default Users;
