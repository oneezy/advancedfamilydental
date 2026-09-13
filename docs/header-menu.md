# Header and menu change

Justin approved this follow-up on September 12, 2026 for the existing feature
branch and PR #6. Review the header-only change against commit f67fd5e.

## Requirements

- Mobile: hamburger on the left, logo centered independently of the controls,
  and phone on the right. Remove the separate membership icon, retaining Plans.
- Open a fixed mobile-only menu with a slide-down entrance, without moving the
  underlying page. Include every existing navigation link, with BOOK ONLINE last.
- Provide an X close control, Escape handling, expanded-state announcement,
  initial focus and contained keyboard traversal, and focus restoration.
- Close on link selection and on entering the desktop breakpoint. Restore
  scrolling and keep the close control accessible on short screens.
- Honor reduced motion. Keep the logo centered when the menu itself scrolls.
- Desktop: preserve normal navigation and phone access. Place BOOK ONLINE at the
  far right immediately after Plans. Keep DentalHQ membership under Plans.
- Preserve hero/final booking, directions, phone, Sheet links, content and photos.
  Review-card sizing is unchanged and is not part of this request.
- Test and review, push the existing branch, verify a fresh hosted preview, and
  return its phone-accessible URL. Do not merge or publish production.

## Browser regression checks

## September 12 regression follow-up

Justin reported oversized desktop hero branding, lost scroll reveal, and missing
red active-link indicators. This follow-up supersedes mobile visibility above.
Compare the full branch to main, and the repair alone to dc07d7a.

- Below 1024px, hide the header at the page top. Slide it down after 80px of
  scrolling, matching the former header threshold. Hide it again on return to top.
- Apply scroll-triggered reveal only on mobile. Desktop navigation stays visible.
- Match the live desktop hero logo size, measured as 784 CSS pixels at a 1440px
  viewport with a 16px root font. The preview had expanded it to 1120px.
- Restore a red active-section bar for Home, About, Services, Testimonials,
  Contact, and FAQ. Update on link navigation and ordinary scrolling in either
  direction. External Plans and booking links must not become current sections.
- Keep the approved modal controls, focus handling, resize behavior, reduced
  motion, phone and booking destinations. Do not change content or dependencies.

`scripts/header-regression-checks.mjs` checks reveal visibility, desktop logo size,
and exactly one current section with a rendered red bar. Run the mobile reveal
check at the top, after scrolling, and after returning to top. Open the menu only
after revealing the header when running `checkMobileHeader` below. Check every
desktop section via links, then scroll up and down without changing the hash.

## Existing menu regression checks

`scripts/header-browser-checks.mjs` exports `checkMobileHeader(page)` and
`checkDesktopHeader(page)`. Pass a Playwright-compatible page that implements
`evaluate`, `getByRole`, and `waitForTimeout`. With the connected in-app browser, use its
`page.playwright` interface. These browser checks are separate from `pnpm test`.
They do not book appointments or submit patient information.

Set the viewport before each run and verify actual `innerWidth`. Use mobile
widths 320, 390, and 768, and desktop widths 1024, 1280, and 1440. If browser zoom
changes the effective width, correct the comparison before accepting a result.

Also verify:

- Open on mobile, resize to desktop, confirm the dialog closes, scroll unlocks,
  and focus lands on the visible desktop home link. Resize back and reopen.
- At 844 by 390, scroll the menu to BOOK ONLINE. The X remains visible and the
  open/closed logo centers match. The document behind the menu does not scroll.
- Emulate `prefers-reduced-motion: reduce`, confirm the dialog animation is none,
  then restore the preference override.
- Activate mobile and desktop booking links. Verify new-tab requests use the
  shared public Jarvis destination with safe link attributes. Do not submit.
- Verify ordinary section navigation and Plans still target their existing URLs.
- Inspect desktop and mobile screenshots and website console errors.

Local testing found and fixed a scroll-lock jump and added explicit Tab wrapping
so focus stays inside the menu rather than traversing browser chrome. The menu
trigger is disabled until hydration installs its event handler.

Hosted results and the exact deployment are recorded in PR #6 after verification.
Temporary authenticated review URLs are delivered privately, not committed here.
