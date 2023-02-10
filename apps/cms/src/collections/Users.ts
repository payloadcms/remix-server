import type { CollectionConfig } from 'payload/types';
import { authenticatedAndAdmin } from '../access/index';
import { Select } from '../components/Select';

export const usersSlug = 'users';
const Users: CollectionConfig = {
    slug: usersSlug,
    auth: true,
    admin: {
        useAsTitle: 'name',
    },
    access: {
        read: authenticatedAndAdmin,
        admin: authenticatedAndAdmin,
        create: authenticatedAndAdmin,
        delete: authenticatedAndAdmin,
        update: authenticatedAndAdmin,
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
            admin: {
                components: {
                    Field: Select
                }
            },
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

export default Users;
