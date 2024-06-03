import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
    const url = 'https://opensheet.justinoneill2007.workers.dev/1LqoSYsuf6WD3S9-ceLWZ8e4ut_0aOD8WkhK2W9XmdhA/pages';

    try {
        const response = await fetch(url);
        const pages = await response.json();

				const page = pages.find((page) => page.slug === params.slug);

        if (!page) {
            throw error(404, 'Page not found');
        }

        return {
            page
        };

    } catch (err) {
        console.error('Failed to fetch page:', err);
        throw error(500, 'Failed to load the page data');
    }
}
