import { CANONICAL_HOST } from "$lib/canonical-host.js";

export const prerender = true;

// The site is a single page; every nav link is a #section on "/".
const body = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${CANONICAL_HOST}/</loc>
  </url>
</urlset>
`;

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  const response = new Response(body);
  response.headers.set("Cache-Control", "max-age=0, s-maxage=3600");
  response.headers.set("Content-Type", "application/xml");
  return response;
}
