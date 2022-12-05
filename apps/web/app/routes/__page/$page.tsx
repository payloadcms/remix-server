import type { MetaFunction } from '@remix-run/node';
import { useMatches, useParams } from '@remix-run/react';
import { RenderBlocks } from '~/components/Blocks';
import type { RootLoaderData } from '~/root';
import { findPageBySlug } from '~/utils';

export const meta: MetaFunction = ({ parentsData, params }) => {
    const { page: pageSlug } = params;
    const {
        root: { pages },
    } = parentsData;

    const page = findPageBySlug(pageSlug ?? 'home', pages);
    return {
        title: page?.meta.title,
        description: page?.meta.description,
        keywords: page?.meta.keywords,
    };
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
