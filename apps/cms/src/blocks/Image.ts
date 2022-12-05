import type { Block } from 'payload/types';

export const Image: Block = {
    slug: 'image',
    labels: {
        singular: 'Image',
        plural: 'Images',
    },
    fields: [
        {
            name: 'image',
            label: 'Image',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'type',
            label: 'Type',
            type: 'radio',
            defaultValue: 'normal',
            options: [
                {
                    label: 'Card',
                    value: 'card',
                },
                {
                    label: 'Feature',
                    value: 'feature',
                },
            ],
            required: true,
            admin: {
                layout: 'horizontal',
            },
        },
        {
            name: 'caption',
            label: 'Caption',
            type: 'richText',
            admin: {
                elements: ['link'],
            },
        },
    ],
};
