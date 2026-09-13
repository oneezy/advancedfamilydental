// Browser checks, separate from pnpm test. Run through a Playwright-compatible
// page, including the connected in-app browser's tab.playwright interface.
export async function checkHeaderReveal(page, visible) {
  let state;
  // Wait for the real 350ms reveal transition, including delayed visibility.
  for (let attempt = 0; attempt < 20; attempt++) {
    state = await page.evaluate(() => {
      const header = document.querySelector(".site-header");
      const style = getComputedStyle(header);
      return {
        width: innerWidth,
        scroll: scrollY,
        hidden: style.visibility === "hidden",
        visible:
          style.visibility === "visible" &&
          style.opacity === "1" &&
          header.getBoundingClientRect().top >= 0,
      };
    });
    if (visible ? state.visible : state.hidden) return state;
    await page.waitForTimeout(50);
  }
  throw new Error(
    `Header reveal: ${JSON.stringify(state)}, expected visible=${visible}`,
  );
}

export async function checkHeroLogo(page) {
  const width = await page.evaluate(
    () =>
      document
        .querySelector('#home img[src="/logo.svg"]')
        .getBoundingClientRect().width,
  );
  // Production measured at 1024+ desktop widths, with a 16px root font.
  if (Math.abs(width - 784) > 1)
    throw new Error(`Desktop hero logo: expected 784px, received ${width}px`);
  return { heroLogoWidth: width };
}

export async function checkActiveSection(page, section, mobile = false) {
  const state = await page.evaluate(
    ({ section, mobile }) => {
      const nav = document.querySelector(
        mobile ? ".menu-panel nav" : ".desktop-bar nav",
      );
      const active = [...nav.querySelectorAll('a[aria-current="location"]')];
      const link = active[0];
      const bar = link && getComputedStyle(link, "::after");
      return {
        count: active.length,
        href: link?.getAttribute("href"),
        expected: `#${section}`,
        barVisible:
          !!bar &&
          bar.content !== "none" &&
          +bar.height.replace("px", "") >= 3 &&
          bar.backgroundColor === "rgb(239, 22, 33)",
      };
    },
    { section, mobile },
  );
  if (state.count !== 1 || state.href !== state.expected || !state.barVisible)
    throw new Error(`Active section: ${JSON.stringify(state)}`);
  return state;
}
