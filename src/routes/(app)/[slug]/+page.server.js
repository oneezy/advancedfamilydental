import { error } from '@sveltejs/kit';

// Dynamic route with no known entries; stays server-rendered so unknown
// paths get a real 404 from +error.svelte.
export const prerender = false;

// The site is a single page: every section lives on "/". Any other path is a
// 404 (previously this served template content from a scaffold Sheet).
export async function load() {
	throw error(404, 'Page not found');
}
