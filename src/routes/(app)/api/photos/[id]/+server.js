import { error } from '@sveltejs/kit';

const cache = new Map();
const CACHE_TTL = 30 * 1000; // Cache for 30 seconds

function setCache(key, value, ttl = CACHE_TTL) {
	const expiry = Date.now() + ttl;
	cache.set(key, { value, expiry });
}

function getCache(key) {
	const cached = cache.get(key);
	if (!cached) return null;

	if (Date.now() > cached.expiry) {
		cache.delete(key);
		return null;
	}

	return cached.value;
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	const fileId = params.id;
	const url = `https://drive.google.com/uc?export=view&id=${fileId}`;
	const cacheKey = `photo_${fileId}`;

	// Check cache
	const cachedResponse = getCache(cacheKey);
	if (cachedResponse) {
		console.log('Serving from cache:', cacheKey);
		return new Response(cachedResponse.buffer, {
			headers: {
				'Content-Type': cachedResponse.contentType,
				'Cache-Control': 's-maxage=30', // Cache for 30 seconds
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
			}
		});
	}

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const contentType = response.headers.get('Content-Type');
		const buffer = await response.arrayBuffer();

		// Cache the response
		setCache(
			cacheKey,
			{
				buffer,
				contentType
			},
			CACHE_TTL
		);

		return new Response(buffer, {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 's-maxage=30', // Cache for 30 seconds
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
			}
		});
	} catch (err) {
		console.error('Error fetching file:', err);
		throw error(500, 'Failed to fetch the file');
	}
}
