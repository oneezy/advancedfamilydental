// Run with a Playwright-compatible page, after setting and verifying its viewport.
// No browser dependency is installed by this file. The connected in-app browser
// can run these same checks through its page.playwright interface.
function check(condition, message) {
  if (!condition) throw new Error(message);
}

const bookingLabel = "BOOK ONLINE (opens in a new tab)";
const expectedLinks = [
  "home",
  "about",
  "services",
  "testimonials",
  "contact",
  "FAQ",
  "Plans",
  "BOOK ONLINE",
];

export async function checkMobileHeader(page) {
  // A previous section link may still be smooth-scrolling. Measure a settled
  // page, so navigation animation is not mistaken for menu-induced movement.
  let previous;
  let stable = 0;
  for (let attempt = 0; attempt < 40 && stable < 3; attempt++) {
    const current = await page.evaluate(() => scrollY);
    stable = current === previous ? stable + 1 : 0;
    previous = current;
    if (stable < 3) await page.waitForTimeout(50);
  }
  check(stable >= 3, "Section scrolling must settle before measuring layout");
  const trigger = page.getByRole("button", { name: "Open menu", exact: true });
  const close = page.getByRole("button", { name: "Close menu", exact: true });
  const nav = page.getByRole("navigation", {
    name: "Mobile navigation",
    exact: true,
  });
  const before = await page.evaluate(() => {
    const logo = document
      .querySelector(".site-header .mobile-logo")
      .getBoundingClientRect();
    const header = document
      .querySelector(".site-header")
      .getBoundingClientRect();
    return {
      width: innerWidth,
      centered:
        Math.abs(logo.left + logo.width / 2 - header.left - header.width / 2) <
        1,
      mainTop: document.querySelector("main").getBoundingClientRect().top,
    };
  });
  check(
    before.width >= 320 && before.width < 1024,
    "Must use a real mobile viewport",
  );
  check(
    before.centered,
    "Mobile logo must be centered independently of side controls",
  );
  check(
    (await trigger.getAttribute("aria-expanded")) === "false",
    "Menu starts collapsed",
  );
  await trigger.click();
  check(
    (await trigger.getAttribute("aria-expanded")) === "true",
    "Trigger announces expanded menu",
  );
  check(await nav.isVisible(), "Mobile navigation opens");
  check(
    JSON.stringify(
      (await nav.getByRole("link").allTextContents()).map((s) => s.trim()),
    ) === JSON.stringify(expectedLinks),
    "All navigation links remain, with booking last",
  );
  const after = await page.evaluate(() => ({
    top: document.querySelector("main").getBoundingClientRect().top,
    focus: document.activeElement.getAttribute("aria-label"),
    modal: document.querySelector("dialog").matches(":modal"),
  }));
  check(
    Math.abs(after.top - before.mainTop) < 1,
    "Opening menu must not shift page content",
  );
  check(
    after.modal && after.focus === "Close menu",
    "Dialog opens with focus on Close menu",
  );
  await close.press("Shift+Tab");
  check(
    (await page.evaluate(() =>
      document.activeElement.getAttribute("aria-label"),
    )) === bookingLabel,
    "Reverse Tab wraps to booking",
  );
  await nav.getByRole("link", { name: bookingLabel, exact: true }).press("Tab");
  check(
    (await page.evaluate(() =>
      document.activeElement.getAttribute("aria-label"),
    )) === "Close menu",
    "Tab wraps to Close menu",
  );
  await close.press("Escape");
  // Native Escape queues the dialog close event after the key dispatch.
  for (let attempt = 0; attempt < 20; attempt++) {
    if ((await trigger.getAttribute("aria-expanded")) === "false") break;
    await page.waitForTimeout(50);
  }
  check(
    (await trigger.getAttribute("aria-expanded")) === "false",
    "Escape collapses menu",
  );
  check(
    (await page.evaluate(() =>
      document.activeElement.getAttribute("aria-label"),
    )) === "Open menu",
    "Escape restores trigger focus",
  );
  check(
    (await page.evaluate(() => document.body.style.position)) !== "fixed",
    "Closing unlocks page scrolling",
  );
  await trigger.click();
  await close.click();
  check(
    (await trigger.getAttribute("aria-expanded")) === "false",
    "X closes menu",
  );
  await trigger.click();
  await nav.getByRole("link", { name: "about", exact: true }).click();
  check(
    (await trigger.getAttribute("aria-expanded")) === "false",
    "Selecting a section closes menu",
  );
  return { viewport: before.width, mobile: "PASS" };
}

export async function checkDesktopHeader(page) {
  const width = await page.evaluate(() => innerWidth);
  check(width >= 1024, "Must use a real desktop viewport");
  const nav = page.getByRole("navigation", {
    name: "Main navigation",
    exact: true,
  });
  check(await nav.isVisible(), "Desktop navigation is visible");
  check(
    !(await page
      .getByRole("button", { name: "Open menu", exact: true })
      .isVisible()),
    "Desktop has no hamburger",
  );
  check(
    JSON.stringify(
      (await nav.getByRole("link").allTextContents()).map((s) => s.trim()),
    ) === JSON.stringify(expectedLinks),
    "Desktop ends with Plans followed by booking",
  );
  const fit = await page.evaluate(() => {
    const header = document
      .querySelector(".desktop-bar")
      .getBoundingClientRect();
    const links = [...document.querySelectorAll(".desktop-bar a")];
    return (
      links.every((a) => {
        const rect = a.getBoundingClientRect();
        return (
          rect.left >= header.left &&
          rect.right <= header.right &&
          rect.height >= 1
        );
      }) &&
      document.documentElement.scrollWidth <=
        document.documentElement.clientWidth
    );
  });
  check(fit, "Desktop controls fit without horizontal overflow");
  return { viewport: width, desktop: "PASS" };
}

// clickPoint sends a real browser pointer click at CSS viewport coordinates.
// Start with the mobile header revealed and the menu closed.
export async function checkOutsideDismissal(page, clickPoint) {
  const trigger = page.getByRole("button", { name: "Open menu", exact: true });
  const before = await page.evaluate(() => ({
    scroll: scrollY,
    hash: location.hash,
  }));
  await trigger.click();
  const points = await page.evaluate(() => {
    const rect = document.querySelector("dialog").getBoundingClientRect();
    return {
      inside: { x: rect.left + rect.width / 2, y: rect.bottom - 6 },
      outside: { x: Math.max(1, rect.left / 2), y: rect.top + rect.height / 2 },
    };
  });
  await clickPoint(points.inside);
  check(
    await page.getByRole("dialog", { name: "Navigation menu" }).isVisible(),
    "Inside padding must not dismiss the menu",
  );
  await clickPoint(points.outside);
  check(
    !(await page.getByRole("dialog", { name: "Navigation menu" }).isVisible()),
    "Clicking the backdrop must close the menu",
  );
  const after = await page.evaluate(() => ({
    scroll: scrollY,
    hash: location.hash,
    focus: document.activeElement.getAttribute("aria-label"),
    locked: document.body.style.position === "fixed",
  }));
  check(
    !after.locked && Math.abs(after.scroll - before.scroll) < 1,
    "Backdrop dismissal restores scroll without a jump",
  );
  check(
    after.focus === "Open menu",
    "Backdrop dismissal restores trigger focus",
  );
  check(
    after.hash === before.hash,
    "Backdrop clicks must not activate page links underneath",
  );
  return { outsideDismissal: "PASS" };
}
