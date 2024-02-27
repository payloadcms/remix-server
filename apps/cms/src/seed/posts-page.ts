export default {
    layout: [
        {
            blockType: 'content' as const,
            blockName: 'Page Content',
            content: {
                root: {
                    type: 'root',
                    children: [
                        {
                            children: [
                                {
                                    text: 'This is a sample page which is only visible to authenticated users.',
                                    type: 'text',
                                },
                            ],
                            type: 'heading',
                            tag: 'h3',
                        },
                        {
                            children: [
                                {
                                    children: [
                                        {
                                            text: 'Go back home',
                                            type: 'text',
                                        },
                                    ],
                                    type: 'link',
                                    fields: {
                                        linkType: 'custom',
                                        newTab: false,
                                        url: '/',
                                    },
                                },
                            ],
                            type: 'paragraph',
                        },
                    ],
                },
            },
        },
    ],
    title: 'Posts',
    public: false,
    slug: 'posts' as const,
    meta: {},
};
