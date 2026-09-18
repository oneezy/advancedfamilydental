# Advanced Family Dental Care website

The public marketing site for a single dental practice in Beaumont, TX. One page, all content sourced live from a Google Sheet.

## Language

**Sheet**:
The live Google Sheet that is the source of truth for all site content and business facts. Edited by the content owner, never hardcoded over in code.
_Avoid_: CMS, database, config

**Section**:
One anchored block of the single page (`#home`, `#about`, `#services`, …). Sections are what the nav links to; they are not pages.
_Avoid_: Page, route, subpage

**Canonical host**:
The one origin search engines should attribute the site to: `https://www.advancedfamilydental.care`. Infrastructure, not content, so it does not live in the Sheet.
_Avoid_: Domain, site URL, company website

**Content owner**:
Whoever maintains the Sheet. Copy fixes (titles, typos, descriptions) are theirs, not the code's.
