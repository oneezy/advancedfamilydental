# Website update reconciliation

Reconciled September 12, 2026 against all 32 checklist items on
[the canonical Trello card](https://trello.com/c/Lb3xx4vX), GitHub issues #2-5,
the current checkout, production in the browser, and the task
"Draft Hailey website update email".

## Ready coding work

- #4: Put the direct Jarvis BOOK ONLINE link in the hero and the final appointment
  action group. Open in a new tab with safe link attributes. Preserve Plans,
  phone/directions links, and the Sheet-driven quick links.
- Verify the existing optional-image URL guard and its regression test, already
  present in baseline commit f780a03. Do not count its presence as test evidence.
- Pin Node to 24.x, matching the current Linux runtime and the existing successful
  Vercel baseline. Keep the locked pnpm version and verify a frozen install.
- Run tests, Svelte checks, and build. Verify desktop/mobile booking behavior,
  review the diff, and publish a branch preview with a pull request.

## Content and external work still open

- #2: Roster removals, changed roles, new staff, biographies, and headshots are
  backed by the LIVE Google Sheet/Drive. Allyson's inclusion, surname convention,
  and Kaitlyn's bio still need decisions. Image preparation and upload belong to
  Justin. Kayla and Tesha are present in production at inspection, but final roster
  acceptance remains open until the approved content update is complete.
- #3: Group-photo selection, composition, crop, and installation remain open.
- #5: Review refresh depends on client scope approval and a source decision.
- Google Business Profile booking/contact updates require access and separate
  authorization. No Google content or image editing is part of this code branch.
- Client communication, the consolidated booking-plus-roster/photo preview,
  production publishing, and post-publish verification remain open.

The card's two already-completed items are the earlier ETA message and historical
Vercel failure diagnosis. They are historical records, not current deployment QA.
The earlier email task contains proposed follow-up questions, not client answers.

## Branch and release sequence

PR #1 is still open and origin/main is 9e53419. This feature branch starts at
f780a03 on codex/repo-baseline-modernization. Its PR targets that baseline branch
so its diff isolates the booking and runtime changes. Justin must merge PR #1
first, then retarget the feature PR to main and review the final diff before the
manual production merge. A branch preview can be reviewed before either merge.

The code preview is for Justin's review. It is not evidence that the full client
update, LIVE content updates, or the consolidated client preview is complete.

Node version selection follows
[Vercel's supported Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

## Responsive regression found during verification

At a 390px viewport, the template's implicit grid minimum expanded main to 424px.
Allowing main and footer to shrink with min-width: 0 removed the overflow.
At 320px, the final appointment heading still overflowed; a smaller mobile heading
removed the remaining 23px overflow. Desktop typography remains unchanged.
The browser regression check compares documentElement.scrollWidth with
documentElement.clientWidth at 320px, 390px, 768px, and 1280px.
