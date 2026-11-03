# Advanced Family Dental Care standalone handoffs

Both ZIPs contain a complete static website: `index.html`, CSS, JavaScript, images, icons, and frozen content. No Google Sheet, Drive image endpoint, Cloudflare worker, Oneezy service, Node server, package installation, or build step is required on the receiving host.

| Package | Source code | Content |
| --- | --- | --- |
| `packages/advanced-family-dental-current.zip` | `01401dbc9b01ba8b803f0f8a0f83264a49736fea` (dev, September 18, 2026) | Current Sheet captured November 3, 2026; eight team members, 14 services, online booking |
| `packages/advanced-family-dental-previous.zip` | `9e534197e26c595286d56d94b4ab967c423dd86e` (November 19, 2025) | Live Sheet revision 203, November 6, 2025 (last listed revision before the 2026 changes); nine team members, 14 services, earlier photos, no new online booking |

## Historical baseline

The previous package combines the November 19, 2025 code with revision 203 of the actual live Sheet, modified November 6, 2025. This is the last listed Sheet revision before the September 2026 changes. Its historical photo references have been downloaded separately. Both versions preserve the business contact address `hi@advancedfamilydental.care`.

Review the historical roster before deploying it as a current business website. This is a static reconstruction from recorded sources, with the standalone adjustments below.

The earlier membership Plans link is preserved in both packages. Previous team photos are separate from the current photos. Both versions use the pinned current build toolchain and `@oneezy/ui` 2.0.62, so the previous build is not a bit-for-bit restoration of its historical dependencies or appearance.

## Upload to GoDaddy Web Hosting / cPanel

1. Back up the files already in the destination website directory.
2. Choose **one** ZIP. Upload it to the domain's document root, normally `public_html`, using File Manager.
3. Extract the ZIP there. `index.html`, `_app`, `assets`, and the other directories must be directly inside that document root, not inside an extra enclosing folder. Include all files, including `__data.json`.
4. Visit the domain over HTTPS. Check the home page, navigation, FAQ, photos, telephone and email links, Plans, and (current version only) online booking.

These packages target a domain root on file-based hosting. They are not a GoDaddy Website Builder import, and they are not intended to run by double-clicking `index.html` with a `file://` URL. Domain/DNS, hosting, HTTPS setup, mailbox delivery, and third-party account availability are outside the ZIP. No hosting or production settings were changed in preparing these packages.

## Standalone adjustments

- Sheet content is frozen into local prerendered HTML and JSON. Editing the Sheet will not update either ZIP.
- All referenced website photos were downloaded and included locally. Images are preserved in their downloaded formats.
- The automatic Google Maps embed is replaced with a local office-photo background. The existing directions links still open Google Maps.
- Remote placeholder images and component demo-image fallbacks are replaced with local assets.
- The image proxy and server-only dynamic routes are omitted. The sitemap and robots file are static.
- Online booking, membership enrollment, Facebook, reviews, directions, email, and telephone remain ordinary outbound actions. The destination services are not included in the ZIP.
- Unrelated historical files and developer material are excluded from the ZIPs.

The packages contain the websites only. Changes made inside an external business profile or another third-party service are not website files.

## Rebuild and verify

Requires Node 24, pnpm, Python 3.12+, and the repository history for the pinned source commits.

```sh
pnpm install --frozen-lockfile
python scripts/build-handoffs.py
python scripts/verify-handoffs.py
```

The build runs in ignored `.handoff-build/` directories and leaves normal source files untouched. Extracted sites are placed in ignored `handoff/sites/`; deliverable ZIPs are in `handoff/packages/`. Source snapshots and downloaded assets are included for reproducibility.

`verification.json` records ZIP SHA-256 hashes and successful checks of ZIP integrity, root structure, all rendered local assets, JS module imports, CSS references, navigation anchors, manifest icons, frozen content, absence of remote rendering dependencies, membership preservation, and separation of current/previous photos and booking functionality.

Both production builds and the existing unit test passed. Browser visual and interactive checks could not be completed because the browser could not reach the local preview server. Neither package has been deployed to or tested in the receiving GoDaddy account. Review both versions on a staging host before replacing a live website.

## Source provenance

- Current Sheet: `1vDOEXosCyxLCToLHmpUIuKTjr0yuTS3cwPAa8sQ00aQ`
- Previous content: revision `203` of the same live Sheet, modified `2025-11-06T07:56:58.496Z`. The older 2024 template was superseded by this verified historical revision.
- `snapshots/` contains the normalized public website content captured from the general and pages tabs.
- `asset-sources.json` maps included downloaded assets to their source Drive file IDs. It contains no download tokens.
- This handoff branch is independent of main and dev. No merge or production rollback is part of this handoff.
