import type { V2_MetaFunction } from '@remix-run/node';
import { useMatches, useParams } from '@remix-run/react';
import { RenderBlocks } from '~/components/Blocks';
import type { RootLoaderData } from '~/root';
import { findPageBySlug } from '~/utils';

import type { loader as rootLoader } from '../../root';

export const meta: V2_MetaFunction<any, { root: typeof rootLoader }> = ({
    matches,
    params,
}) => {
    const pages = matches.find((match) => match.id === 'root')?.data.pages;
    const { page: pageSlug } = params;

    const page = findPageBySlug(pageSlug ?? 'home', pages);

    return [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width,initial-scale=1' },
        { title: page?.title || page?.meta.title },
        { name: 'description', content: page?.meta.description },
        { name: 'keywords', content: page?.meta.keywords },
    ];
};

export default function Page() {
    const { page: pageSlug } = useParams();

    const [{ data }] = useMatches();
    const { pages } = data as RootLoaderData;
    const page = findPageBySlug(pageSlug ?? 'home', pages);

    return (
        <main className="page-content container">
            {page?.layout ? (
                <RenderBlocks layout={page.layout} />
            ) : (
                'This page seem to be empty'
            )}
        </main>
    );
}
