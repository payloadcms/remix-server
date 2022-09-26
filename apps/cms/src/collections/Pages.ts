import { CollectionConfig } from 'payload/types';
import formatSlug from '../utilities/formatSlug';
import { Image, Type as ImageType } from '../blocks/Image';
import { CallToAction, Type as CallToActionType } from '../blocks/CallToAction';
import { Content, Type as ContentType } from '../blocks/Content';
import { mediaSlug, MediaType } from './Media';
import { authenticatedAndAdmin, pageIsPublic } from '../access/index';

export type Layout = CallToActionType | ContentType | ImageType;

export type Type = {
    title: string;
    slug: string;
    image?: MediaType;
    layout: Layout[];
    meta: {
        title?: string;
        description?: string;
        keywords?: string;
    };
};
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
