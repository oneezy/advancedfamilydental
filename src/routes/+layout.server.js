/** @type {import('./$types').LayoutServerLoad} */
export async function load({ fetch }) {
	// URL to your external JSON data
	const url =
		'https://opensheet.justinoneill2007.workers.dev/1LqoSYsuf6WD3S9-ceLWZ8e4ut_0aOD8WkhK2W9XmdhA/pages'

	try {
		// Fetch the data from the external JSON URL
		const response = await fetch(url)
		const pages = await response.json()

		// Map the fetched data to match the expected structure
		return {
			pageData: pages.map((page) => ({
				slug: page.slug,
				href: page.href,
				label: page.label,
				title: page.title,
				tagline: page.tagline,
				content: page.content,
			})),
		}
	} catch (error) {
		console.error('Failed to fetch pages:', error)
		return {
			pageData: [],
		}
	}
}
