# Website search discoverability research

Research date: 2026-09-17. Workspace: `V:\dev\advancedfamilydental`.

## Scope and evidence boundaries

Investigate why the public Advanced Family Dental Care website is hard to find in Google, distinguish SvelteKit rendering from indexing/ranking issues, and propose narrowly scoped improvements. This is research, not authorization to change production, Google Business Profile, Search Console, DNS, the Google Sheet, Drive assets, or the refresh workflow. Application code is not changed by this report.

Evidence was collected on September 17 in America/Chicago (September 18 UTC). The local `seo` branch was at `2d9bec4`; `main` was at `f5683a8` with the same tracked-file tree before this research note. Production responses below were directly observed by the main investigation, not inferred from branch names. No Search Console indexed report was available during this research.

## Findings and priority

The site is not an empty client-rendered Svelte shell. The strongest confirmed technical problem is `/robots.txt` returning HTTP 500. A second clear defect is a placeholder sitemap that lists another domain rather than this website. These warrant repair, but neither a search-result snapshot nor ordinary HTTP requests establish Google's historical crawl/indexing decisions.

| Observation | Evidence | Interpretation |
| --- | --- | --- |
| The business is visible, but its organic website result was not obvious | In the observed Google brand search, personalized to Beaumont, Google displayed the actual business profile with a website link to the production domain; the first organic results included Facebook/Yelp and other listings | This supports the user's concern about the organic website result while distinguishing it from Business Profile visibility. It is one search snapshot, not universal ranking data |
| Domain-restricted Google search returned no documents | The observed `site:advancedfamilydental.care` Google search returned no matching documents | Consistent with an indexing/discovery concern, but not authoritative proof that the domain is unindexed |
| Production homepage responds and includes server-rendered content | `https://www.advancedfamilydental.care/` returned 200 with approximately 212,044 characters. Removing every script element still left approximately 187,591 characters containing a company H1, street address, phone, and service content | The bottom script is not withholding the whole site from crawlers; there is no evidence for a framework rewrite |
| Robots endpoint is broken | Three requests to `https://www.advancedfamilydental.care/robots.txt` returned 500 and HTML error content | High-priority crawl-reliability defect; historical Googlebot effect remains unverified |
| The failure extends to unknown routes | `/seo-diagnostic-nonexistent-20260917` returned the same 500 page-data failure; a Googlebot-like user-agent request to robots also returned 500 | Consistent with the generic slug error handler. A spoofed user agent is not verification of actual Googlebot access |
| Sitemap is a template, not this site's sitemap | `https://www.advancedfamilydental.care/sitemap.xml` returned 200 XML listing `https://yourdomain.com` tutorial/category URLs, an undefined last-modified value, and an incorrect namespace | It provides no useful discovery list for the production site |
| No explicit homepage exclusion was observed | The checked homepage had no robots meta or `X-Robots-Tag` | No observed homepage `noindex` blocker; this does not rule out historical responses or Googlebot-specific problems |
| Canonical and business schema are absent | No canonical link or JSON-LD in the checked homepage HTML | Improvement opportunities, not proof of an indexing block |
| Homepage title misses the brand | The title targets dentist/dental-office/cosmetic-dentist terms in Beaumont but does not include Advanced Family Dental Care; description contains a spelling error | Improve identification and snippet quality, while preserving the approved content source |
| Root-domain redirects already work | HTTP apex redirects with 308 to HTTPS apex, then with 308 to HTTPS www. The old `https://ronaldcitranodds.com/` ultimately redirects to the current homepage and returns 200 | Do not propose rebuilding already-working root redirects. Deeper legacy paths have not been audited |

### Why the robots 500 matters, without overstating it

Google documents a staged response to robots-file server errors: initially it pauses crawling for up to 12 hours while retrying; for the following 30 days it uses the last good version, or assumes no restrictions if it has none cached. After persistent errors, behavior depends on the site's general availability. A normal 404 instead means no robots file/restrictions. Therefore this is a concrete defect worth fixing first, not evidence that Google permanently refuses the site. [Google robots.txt status handling](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)

Source inspection found no explicit robots route or static robots file. The generic slug loader in `src/routes/(app)/[slug]/+page.server.js` fetches page data, throws a 404 for an unknown slug at line 14 inside `try`, then catches it at line 20 and throws a 500 at line 22. This is a strongly supported route-level explanation for the observed robots and nonexistent-path failures; production logs would distinguish a missing slug from an upstream fetch/parse failure. Either way, an independent robots response should not depend on that page-data lookup. No local route execution was attempted because dependencies were not installed.

The broken sitemap is directly explained by `src/routes/(app)/sitemap.xml/+server.js`: the `site` constant remains `https://yourdomain.com`, `pages` contains example strings, and `page.lastMod` is read from those strings. Its namespace uses HTTPS instead of the protocol's literal `http://www.sitemaps.org/schemas/sitemap/0.9`. Correct XML must use the specified namespace, real absolute URLs, and optional valid modification dates; omitting unknown dates is preferable to inventing them. [Sitemap protocol](https://www.sitemaps.org/protocol.html)

### Recommended next work, not yet implemented

1. Serve a dedicated, reliable `robots.txt` with HTTP 200 and plain-text content, permitting the public site and referencing its corrected production sitemap. Preserve appropriate preview protection separately.
2. Replace the template sitemap with actual canonical production page URLs. Do not list `#section` anchors as separate pages, sample routes, Vercel previews, or unrelated domains; omit unknown modification dates.
3. Repair the generic slug loader so genuine unknown pages remain 404, while actual upstream failures remain distinguishable server errors. Regression-test the robots path and a deliberately nonexistent URL.
4. Add a production canonical and improve the branded homepage title/description through the existing content ownership mechanism. Do not silently hardcode over the Google Sheet or change its schema; confirm how the relevant current metadata fields are maintained first.
5. In verified Search Console access, inspect the production homepage and crawl/robots reports, capture the precise exclusion reason if any, then submit the corrected sitemap and request indexing after fixes pass. This step is needed to close the causal diagnosis.
6. Add truthful local-business schema and verify the existing Business Profile website/details as a separate enhancement. Do not create a duplicate profile just because the organic result is weak.

Acceptance checks: public homepage still contains primary text before JavaScript; robots returns stable 200/plain text; sitemap parses with the correct namespace and only real production URLs; listed URLs resolve successfully; unknown pages return 404; homepage has intended title, canonical, and no accidental exclusion; menu/booking behavior and Sheet/Drive loading remain unchanged. Record both Search Console indexed-state and live-test evidence after deployment. No ranking or timeline guarantee is possible.

Suggested first code-only change set: recommendations 1-3 plus regression tests, leaving visual UI and content unchanged. Treat recommendation 4's content copy as a separate approved change through the existing source of truth. Search Console checklist: verify the production property, inspect homepage indexed status and selected canonical, inspect Crawl Stats/robots failures, run a live test and review rendered output, check Manual Actions/Security Issues/removals, then submit the repaired sitemap and request indexing only after validation.

### Reproducing the public endpoint checks

These read-only PowerShell commands use `curl.exe`, discard response bodies for status checks, and do not modify files. Expected statuses describe the research-time deployment, not desired behavior or a promise of future state.

```powershell
Set-Location 'V:\dev\advancedfamilydental'
curl.exe -sS -L -o NUL -w '%{http_code} %{url_effective}\n' 'https://www.advancedfamilydental.care/'
curl.exe -sS -L -o NUL -w '%{http_code} %{url_effective}\n' 'https://www.advancedfamilydental.care/robots.txt'
curl.exe -sS -L -o NUL -w '%{http_code} %{url_effective}\n' 'https://www.advancedfamilydental.care/seo-diagnostic-nonexistent-20260917'
curl.exe -sS 'https://www.advancedfamilydental.care/sitemap.xml'
curl.exe -sS -L -o NUL -w '%{http_code} %{url_effective}\n' 'http://advancedfamilydental.care/'
curl.exe -sS -L -o NUL -w '%{http_code} %{url_effective}\n' 'https://ronaldcitranodds.com/'
```

Observed expectations: homepage 200; robots 500; nonexistent path 500; sitemap contains `yourdomain.com`, tutorial/category placeholders, and `<lastmod>undefined</lastmod>`; the final two checks end at the current HTTPS www homepage with 200. To inspect complete redirect/status headers, add `-D -` to a body-discarding command. Repeat the two Google queries manually in the browser and record date/location: `Advanced Family Dental Care` and `site:advancedfamilydental.care`. Search Console is still required to resolve indexing status.

## What the official documentation establishes

### A script at the bottom does not establish a rendering problem

SvelteKit normally renders HTML on the server and then hydrates that HTML in the browser to attach interactive behavior. `ssr = false` changes this to an initially empty shell; seeing a bootstrap script alone does not demonstrate that setting. Disabling client-side rendering would also remove the JavaScript needed for interactive UI, so it is not an appropriate general SEO fix. [SvelteKit page options](https://svelte.dev/docs/kit/page-options)

During SSR, SvelteKit can embed fetched response data into the HTML and reuse it during hydration. A large serialized-data script can therefore coexist with fully rendered page content. The meaningful test is whether the initial HTTP response already contains the visible headings, business details, and service text outside scripts. [SvelteKit data loading](https://svelte.dev/docs/kit/load)

Google can render JavaScript, but an app-shell page depends on that extra processing to expose its content. Google recommends server rendering or prerendering for speed and crawler compatibility. This supports keeping important content in the initial HTML; it does not imply that all JavaScript sites are unindexable. [Google JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)

### Being live, being indexed, and ranking for a brand are different

Google's pipeline discovers/crawls URLs, processes them for indexing, and then selects results for a particular query. A successful website visit only demonstrates availability to that visitor. It does not establish inclusion in Google's index or prominence for a search term. [How Google Search works](https://developers.google.com/search/docs/fundamentals/how-search-works)

A missing result in a `site:` query is not conclusive proof of exclusion. Google explicitly recommends URL Inspection to establish indexability and investigate a missing URL. [Google's site operator documentation](https://developers.google.com/search/docs/monitor-debug/search-operators/all-search-site)

### Technical checks that can distinguish causes

- Inspect the production response status, redirects, raw HTML, and `X-Robots-Tag`; check HTML robots/googlebot meta tags. A `noindex` directive in a tag or HTTP header blocks indexing when Google can access and read it. [Google noindex documentation](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- Check `robots.txt` independently. Crawl restrictions and index restrictions are not equivalent; a blocked URL can still appear without its page content if discovered elsewhere. Do not use `robots.txt` as a canonicalization mechanism. [Google robots.txt introduction](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- Normalize production host/scheme and use a consistent canonical URL. Redirects and canonical link annotations are signals to consolidate duplicate URLs, not guarantees that Google chooses the preferred URL. [Canonicalization guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- A sitemap helps discover URLs, particularly on new or weakly linked sites; it does not guarantee crawling or indexing. A small, well-linked site can be indexed without one, so a missing sitemap alone does not explain invisibility. [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)

### Search Console is the decisive next diagnostic

For the production homepage, inspect the indexed report's status/reason, last crawl, fetch result, crawl/indexing permission, and Google-selected canonical. Then run a live test and inspect rendered HTML, screenshot, and resource failures. The live test checks current accessibility, not actual inclusion in the index; it cannot establish Google's chosen canonical or guarantee indexing. Also check Manual Actions, Security Issues, and temporary removals. [URL Inspection documentation](https://support.google.com/webmasters/answer/9012289)

After verified fixes, an owner or full Search Console user can request indexing. A request is neither an immediate publication action nor a guarantee that the URL will be indexed. Do not repeatedly request indexing as a substitute for diagnosis. [Requesting a recrawl](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)

### Low-risk discoverability improvements, if missing

- Give each real page a useful title and description with `<svelte:head>`, retain SSR, and measure image/performance problems before optimizing. SvelteKit supports sitemap endpoints directly; changing frameworks is unnecessary. [SvelteKit SEO guidance](https://svelte.dev/docs/kit/seo)
- Keep the business identity, location, and service information as readable text, not only a logo/image. This lets crawlers understand the page content. [Google developer SEO guide](https://developers.google.com/search/docs/fundamentals/get-started-developers)
- Add accurate local-business structured data using the most specific applicable type and facts matching the visible site. Validate it, but do not treat schema as an indexing switch or promise rich results. Do not invent ratings or add self-serving review-star markup. [Google LocalBusiness guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- Separately verify Google Business Profile ownership and accuracy: real business name, address, phone, hours, category, and production website URL. Local visibility depends on relevance, distance, and prominence; a generic brand query can be ambiguous between businesses. Google says there is no way to request or pay for a better local ranking. [Google Business Profile local-ranking guidance](https://support.google.com/business/answer/7091)

## Remaining uncertainties

Google's current indexed status, selected canonical, historical robots-fetch results, prior exclusions, and search-performance trend remain unknown without Search Console evidence. Business Profile ownership/verification was not assessed. The observed search was location-personalized; results may differ elsewhere. No application fixes, content-source edits, commits, pushes, or indexing submissions were performed as part of this research report.
