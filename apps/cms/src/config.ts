import path from 'path';
import { buildConfig } from 'payload/config';
import Users, { seedUsers } from './collections/Users';
import { Payload } from 'payload';

const config = buildConfig({
    admin: {
        user: Users.slug,
    },
    collections: [Users],
    typescript: {
        outputFile: path.resolve(__dirname, 'types.ts'),
    },
    graphQL: {
        schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
    },
    onInit: async (payload: Payload) => {
        seedUsers(payload);
    },
});

export default config;
