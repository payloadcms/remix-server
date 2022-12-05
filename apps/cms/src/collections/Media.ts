import { CollectionConfig } from 'payload/types';

export const mediaSlug = 'media';
const Media: CollectionConfig = {
    slug: mediaSlug,
    access: {
        read: (): boolean => true, // Everyone can read Media
    },
    upload: {
        adminThumbnail: 'card',
        imageSizes: [
            {
                name: 'card',
                width: 640,
                height: 480,
            },
            {
                name: 'feature',
                width: 1024,
                height: 576,
            },
        ],
    },
    fields: [
        {
            name: 'alt',
            label: 'Alt Text',
            type: 'text',
            required: true,
        },
    ],
};

export default Media;
