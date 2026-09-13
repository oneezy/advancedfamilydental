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

// Run at the top of a freshly loaded page, before any keyboard navigation.
export async function checkHiddenHeaderKeyboard(page) {
  await checkHeaderReveal(page, false);
  await page.locator("body").press("Tab");
  const state = await page.evaluate(() => ({
    inHeader: !!document.activeElement.closest(".site-header"),
    label: document.activeElement.getAttribute("aria-label"),
  }));
  if (state.inHeader || state.label !== "BOOK ONLINE (opens in a new tab)")
    throw new Error(`Hidden header keyboard: ${JSON.stringify(state)}`);
  return state;
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

// Run with the desktop header revealed. These are main's existing glass values.
export async function checkDesktopGlass(page) {
  const state = await page.evaluate(() => {
    const style = getComputedStyle(document.querySelector(".desktop-bar"));
    return {
      background: style.backgroundColor,
      blur: style.backdropFilter,
      border: style.borderBottomWidth,
      borderColor: style.borderBottomColor,
      shadow: style.boxShadow,
    };
  });
  // Dev color-mix and optimized production CSS serialize the same white
  // differently. Accept both without accepting a different color or opacity.
  const white = (alpha) => [
    `color(srgb 1 1 1 / ${alpha})`,
    `oklab(0.999994 0.0000455678 0.0000200868 / ${alpha})`,
    `rgba(255, 255, 255, ${alpha})`,
  ];
  if (
    !white(0.5).includes(state.background) ||
    state.blur !== "blur(40px)" ||
    state.border !== "2px" ||
    !white(0.25).includes(state.borderColor) ||
    !state.shadow.includes("0px 0px 0px 1px") ||
    !state.shadow.includes("0px 10px 15px -3px") ||
    !state.shadow.includes("0px 4px 6px -4px")
  )
    throw new Error(`Desktop glass: ${JSON.stringify(state)}`);
  return state;
}

export async function checkIndicatorAlignment(page) {
  const state = await page.evaluate(() => {
    const header = document.querySelector(".desktop-bar");
    const link = header.querySelector('a[aria-current="location"]');
    const bar = getComputedStyle(link, "::after");
    return {
      headerBottom: header.getBoundingClientRect().bottom,
      indicatorBottom:
        link.getBoundingClientRect().bottom - +bar.bottom.replace("px", ""),
    };
  });
  if (Math.abs(state.headerBottom - state.indicatorBottom) > 1)
    throw new Error(`Indicator alignment: ${JSON.stringify(state)}`);
  return state;
}

// movePointer sends a real mouse movement at CSS viewport coordinates.
export async function checkHeaderHover(page, movePointer) {
  await movePointer({ x: 0, y: 0 });
  const links = await page.evaluate(() =>
    [...document.querySelectorAll(".desktop-bar a")].map((a) => {
      const rect = a.getBoundingClientRect();
      return {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
        background: getComputedStyle(a).backgroundColor,
        label: a.getAttribute("aria-label") || a.textContent.trim(),
      };
    }),
  );
  for (let i = 0; i < links.length; i++) {
    await movePointer(links[i]);
    const hovered = await page.evaluate((i) => {
      const a = document.querySelectorAll(".desktop-bar a")[i];
      return {
        hovered: a.matches(":hover"),
        background: getComputedStyle(a).backgroundColor,
      };
    }, i);
    if (!hovered.hovered || hovered.background !== links[i].background)
      throw new Error(
        `Header hover ${links[i].label}: ${JSON.stringify(hovered)}, before=${links[i].background}`,
      );
  }
  await movePointer({ x: 0, y: 0 });
  return { unchangedHeaderBackgrounds: links.length };
}

export async function checkAppointmentStack(page) {
  const state = await page.evaluate(() => {
    const booking = [...document.querySelectorAll("main a")]
      .filter((a) => a.textContent.trim() === "BOOK ONLINE")
      .at(-1);
    const wrapper = booking.parentElement;
    const parent = wrapper.parentElement.getBoundingClientRect();
    const rect = wrapper.getBoundingClientRect();
    const buttons = [...wrapper.querySelectorAll("a")].map((a) => {
      const r = a.getBoundingClientRect();
      return {
        label: a.textContent.trim(),
        x: r.x,
        top: r.top,
        bottom: r.bottom,
        width: r.width,
      };
    });
    return {
      width: rect.width,
      center: rect.x + rect.width / 2,
      parentCenter: parent.x + parent.width / 2,
      buttons,
    };
  });
  const [booking, phone, directions] = state.buttons;
  if (
    state.buttons.length !== 3 ||
    !phone.label.startsWith("Call ") ||
    directions.label !== "Get Directions" ||
    state.width > 385 ||
    Math.abs(state.center - state.parentCenter) > 1 ||
    state.buttons.some((b) => Math.abs(b.width - state.width) > 1) ||
    Math.abs(phone.top - booking.bottom - 16) > 1 ||
    Math.abs(directions.top - phone.bottom - 16) > 1
  )
    throw new Error(`Appointment stack: ${JSON.stringify(state)}`);
  return state;
}
