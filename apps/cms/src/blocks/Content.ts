import type { Block } from 'payload/types';

export type Type = {
    blockType: 'content';
    blockName?: string;
    content: unknown;
};

export const Content: Block = {
    slug: 'content',
    labels: {
        singular: 'Content',
        plural: 'Content Blocks',
    },
    fields: [
        {
            name: 'content',
            type: 'richText',
        },
    ],
};

export default Content;
