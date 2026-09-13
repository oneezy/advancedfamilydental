<script>
  import { onMount } from "svelte";
  import { formatPhoneNumber } from "@oneezy/ui/utils/utils.js";
  import { BOOKING_URL } from "$lib/booking.js";

  let { links, phone, company } = $props();
  let menu;
  let trigger;
  let desktopHome;
  let open = $state(false);
  let ready = $state(false);
  let restoreScroll;

  function openMenu() {
    if (menu.open) return;
    // Keep the page and fixed header in place when the scrollbar is locked.
    const root = document.documentElement;
    const body = document.body;
    const scrollTop = window.scrollY;
    const scrollLeft = window.scrollX;
    const position = body.style.position;
    const top = body.style.top;
    const width = body.style.width;
    const pageWidth = body.getBoundingClientRect().width;
    const overflow = root.style.overflow;
    const gutter = root.style.scrollbarGutter;
    root.style.scrollbarGutter = "stable";
    root.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollTop}px`;
    body.style.width = `${pageWidth}px`;
    restoreScroll = () => {
      body.style.position = position;
      body.style.top = top;
      body.style.width = width;
      root.style.overflow = overflow;
      root.style.scrollbarGutter = gutter;
      window.scrollTo({
        top: scrollTop,
        left: scrollLeft,
        behavior: "instant",
      });
    };
    menu.showModal();
    open = true;
  }

  function closeMenu() {
    // Restore before an anchor's default navigation, not after it.
    restoreScroll?.();
    restoreScroll = undefined;
    menu.close();
  }

  function menuClosed() {
    open = false;
    restoreScroll?.();
    restoreScroll = undefined;
    const destination = window.matchMedia("(min-width: 1024px)").matches
      ? desktopHome
      : trigger;
    destination?.focus({ preventScroll: true });
  }

  function cycleMenuFocus(event) {
    if (event.key !== "Tab") return;
    const controls = menu.querySelectorAll("button, a[href]");
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  onMount(() => {
    ready = true;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onViewportChange = () => {
      if (desktop.matches && menu.open) closeMenu();
    };
    desktop.addEventListener("change", onViewportChange);
    return () => {
      desktop.removeEventListener("change", onViewportChange);
      restoreScroll?.();
    };
  });
</script>

{#snippet phoneIcon()}
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
  >
    <path
      d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"
    />
  </svg>
{/snippet}

{#snippet mobileLogo()}
  <a
    class="mobile-logo"
    href="#home"
    aria-label="{company} home"
    onclick={() => {
      if (open) closeMenu();
    }}
  >
    <img src="/icon.svg" alt="" width="48" height="48" />
  </a>
{/snippet}

{#snippet mobilePhone()}
  <a
    class="icon-action phone"
    href="tel:{phone}"
    aria-label="Call {formatPhoneNumber(phone)}"
    onclick={() => {
      if (open) closeMenu();
    }}
  >
    {@render phoneIcon()}
  </a>
{/snippet}

{#snippet navLink(link, mobile = false)}
  <a
    href={link.href}
    target={link.href.startsWith("https:") ? "_blank" : undefined}
    rel={link.href.startsWith("https:") ? "noopener noreferrer" : undefined}
    onclick={() => {
      if (mobile) closeMenu();
    }}>{link.label}</a
  >
{/snippet}

{#snippet bookingLink(mobile = false)}
  <a
    class="book-online"
    href={BOOKING_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="BOOK ONLINE (opens in a new tab)"
    onclick={() => {
      if (mobile) closeMenu();
    }}>BOOK ONLINE</a
  >
{/snippet}

<div class="site-header">
  <div class="mobile-bar header-panel">
    <button
      bind:this={trigger}
      class="icon-action"
      type="button"
      aria-label="Open menu"
      disabled={!ready}
      aria-expanded={open}
      aria-controls="mobile-navigation"
      aria-haspopup="dialog"
      onclick={openMenu}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
    {@render mobileLogo()}
    {@render mobilePhone()}
  </div>

  <div class="desktop-bar header-panel">
    <a
      bind:this={desktopHome}
      class="desktop-logo"
      href="#home"
      aria-label="{company} home"
    >
      <img
        src="/logos/logo-black-horizontal-noborder.svg"
        alt=""
        width="180"
        height="60"
      />
    </a>
    <a
      class="desktop-phone icon-action"
      href="tel:{phone}"
      aria-label="Call {formatPhoneNumber(phone)}"
    >
      {@render phoneIcon()}<span>{formatPhoneNumber(phone)}</span>
    </a>
    <nav aria-label="Main navigation">
      {#each links as link}{@render navLink(link)}{/each}
      {@render bookingLink()}
    </nav>
  </div>
</div>

<dialog
  bind:this={menu}
  id="mobile-navigation"
  aria-label="Navigation menu"
  onclose={menuClosed}
  onkeydown={cycleMenuFocus}
>
  <div class="menu-panel">
    <div class="mobile-bar">
      <button
        class="icon-action"
        type="button"
        aria-label="Close menu"
        onclick={closeMenu}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
      {@render mobileLogo()}
      {@render mobilePhone()}
    </div>
    <nav aria-label="Mobile navigation">
      {#each links as link}{@render navLink(link, true)}{/each}
      {@render bookingLink(true)}
    </nav>
  </div>
</dialog>

<!-- Preserve the previous header's document spacing. Opening the menu adds none. -->
<div class="header-space" aria-hidden="true"></div>

<style>
  .header-space {
    height: 5rem;
  }
  .site-header {
    position: fixed;
    z-index: 30;
    inset: 1rem 1rem auto;
  }
  .header-panel,
  .menu-panel {
    color: #14181c;
    background: #eef1f4f2;
    border: 1px solid #fff8;
    box-shadow: 0 4px 20px #0002;
    border-radius: 2rem;
  }
  .header-panel {
    backdrop-filter: blur(16px);
  }
  .mobile-bar {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 0.5rem;
    min-height: 4rem;
  }
  .icon-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    flex-shrink: 0;
    cursor: pointer;
  }
  .phone {
    justify-self: end;
  }
  .mobile-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
  }
  .mobile-logo img {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }
  .desktop-bar {
    display: none;
  }
  a,
  button {
    -webkit-tap-highlight-color: transparent;
  }
  a:focus-visible,
  button:focus-visible {
    outline: 3px solid #005b59;
    outline-offset: 3px;
  }
  a:hover,
  button:hover {
    background-color: #0000000d;
  }
  .book-online {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: 0.75rem 1rem;
    border-radius: 9999px;
    background: #00cbbb;
    color: #071917;
    font-weight: 700;
    white-space: nowrap;
  }
  .book-online:hover {
    background: #00b7a9;
  }
  dialog {
    position: fixed;
    inset: 1rem 1rem auto;
    width: auto;
    max-width: none;
    max-height: calc(100dvh - 2rem);
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    overflow: hidden;
    overscroll-behavior: contain;
    border-radius: 2rem;
  }
  dialog[open] {
    animation: menu-down 180ms ease-out;
  }
  dialog::backdrop {
    background: #10182080;
  }
  .menu-panel {
    display: flex;
    flex-direction: column;
    max-height: calc(100dvh - 2rem);
    background: #eef1f4;
  }
  .menu-panel .mobile-bar {
    position: sticky;
    top: 0;
    z-index: 1;
    background: #eef1f4;
    border-radius: 2rem 2rem 0 0;
    flex-shrink: 0;
  }
  .menu-panel nav {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0.5rem 1rem 1rem;
    gap: 0.25rem;
  }
  .menu-panel nav a {
    min-height: 44px;
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    text-transform: capitalize;
    font-weight: 600;
  }
  .menu-panel nav .book-online {
    margin-top: 0.5rem;
  }
  @keyframes menu-down {
    from {
      transform: translateY(-1rem);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    dialog[open] {
      animation: none;
    }
  }
  @media (min-width: 1024px) {
    .site-header {
      inset: 1.25rem 1rem auto;
    }
    .mobile-bar {
      display: none;
    }
    dialog {
      display: none;
    }
    .desktop-bar {
      display: flex;
      align-items: center;
      gap: 1rem;
      max-width: 1152px;
      margin-inline: auto;
      padding: 0.5rem 1rem;
      min-height: 72px;
    }
    .desktop-logo {
      flex-shrink: 0;
      width: 160px;
    }
    .desktop-logo img {
      width: 100%;
      height: auto;
    }
    .desktop-phone {
      gap: 0.5rem;
    }
    .desktop-phone span {
      display: none;
    }
    .desktop-bar nav {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 1rem;
      flex: 1;
    }
    .desktop-bar nav a {
      text-transform: capitalize;
      font-weight: 500;
      white-space: nowrap;
    }
    .desktop-bar nav .book-online {
      font-weight: 700;
    }
  }
  @media (min-width: 1280px) {
    .desktop-phone {
      width: auto;
      padding-inline: 0.5rem;
    }
    .desktop-phone span {
      display: inline;
      white-space: nowrap;
    }
  }
</style>
