import path from 'path';
import { buildConfig } from 'payload/config';
import Users from './collections/Users';
import { Payload } from 'payload';
import { seedPages, seedUsers } from './seed/index';
import Media from './collections/Media';
import Pages from './collections/Pages';

const config = buildConfig({
    admin: {
        user: Users.slug,
    },
    collections: [Users, Media, Pages],
    typescript: {
        outputFile: path.resolve(__dirname, 'types.ts'),
    },
    graphQL: {
        schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
    },
    onInit: async (payload: Payload) => {
        if (process.env.NODE_ENV === 'development') {
            await seedUsers(payload);
            await seedPages(payload);
        }
    },
});

export default config;
