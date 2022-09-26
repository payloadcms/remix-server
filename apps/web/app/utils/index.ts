import type { Page } from '@org/cms';

export const findPageBySlug = (slug: string, pages: Page[]) => {
    return pages?.find((page) => page.slug === slug);
};
