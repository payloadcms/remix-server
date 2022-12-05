import { CollectionConfig } from 'payload/types';
import formatSlug from '../utilities/formatSlug';
import { Image } from '../blocks/Image';
import { CallToAction } from '../blocks/CallToAction';
import { Content } from '../blocks/Content';
import { mediaSlug } from './Media';
import { authenticatedAndAdmin, pageIsPublic } from '../access/index';

export const pagesSlug = 'pages';
export const Pages: CollectionConfig = {
    slug: pagesSlug,
    admin: {
        useAsTitle: 'title',
    },
    access: {
        read: ({ req }) => {
            if (authenticatedAndAdmin({ req })) return true;
            return pageIsPublic();
        },
        create: authenticatedAndAdmin,
        update: authenticatedAndAdmin,
        delete: authenticatedAndAdmin,
    },
    fields: [
        {
            name: 'title',
            label: 'Page Title',
            type: 'text',
            required: true,
        },
        {
            name: 'image',
            label: 'Featured Image',
            type: 'upload',
            relationTo: mediaSlug,
        },
        {
            name: 'public',
            label: 'Public',
            type: 'checkbox',
            defaultValue: false,
        },
        {
            name: 'layout',
            label: 'Page Layout',
            type: 'blocks',
            minRows: 1,
            blocks: [CallToAction, Content, Image],
        },
        {
            name: 'meta',
            label: 'Page Meta',
            type: 'group',
            fields: [
                {
                    name: 'title',
                    label: 'Title',
                    type: 'text',
                },
                {
                    name: 'description',
                    label: 'Description',
                    type: 'textarea',
                },
                {
                    name: 'keywords',
                    label: 'Keywords',
                    type: 'text',
                },
            ],
        },
        {
            name: 'slug',
            label: 'Page Slug',
            type: 'text',
            admin: {
                position: 'sidebar',
            },
            hooks: {
                beforeValidate: [formatSlug('title')],
            },
        },
    ],
};

export default Pages;
