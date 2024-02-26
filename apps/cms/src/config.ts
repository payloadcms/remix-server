import path from 'path';

import { Payload } from 'payload';
import { buildConfig } from 'payload/config';

import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { viteBundler } from '@payloadcms/bundler-vite';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

import { seedPages, seedUsers } from './seed/index';

import Media from './collections/Media';
import Pages from './collections/Pages';
import Users from './collections/Users';

const config = buildConfig({
    admin: {
        user: Users.slug,
        bundler: viteBundler(),
    },
    db: mongooseAdapter({
        url: process.env.MONGODB_URL ?? 'mongodb://localhost/remix-server',
    }),
    editor: lexicalEditor(),
    collections: [Users, Media, Pages],
    typescript: {
        outputFile: path.resolve(__dirname, 'payload-types.ts'),
    },
    graphQL: {
        schemaOutputFile: path.resolve(__dirname, 'payload-schema.graphql'),
    },
    onInit: async (payload: Payload) => {
        if (process.env.NODE_ENV === 'development') {
            await seedUsers(payload);
            await seedPages(payload);
        }
    },
});

export default config;
