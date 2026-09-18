<script>
  import SiteHeader from "$lib/components/SiteHeader.svelte";
  import { Template, Logo, Footer, Social, Copyright } from "@oneezy/ui";

  import { formatPhoneNumber } from "@oneezy/ui/utils/utils.js";
  import BxHandicap from "~icons/bx/handicap";
  import { CANONICAL_HOST } from "$lib/canonical-host.js";

  let { data, children, ...props } = $props();

  let links = [
    { label: "home", href: "#home" },
    { label: "about", href: "#about" },
    { label: "services", href: "#services" },
    { label: "testimonials", href: "#testimonials" },
    { label: "contact", href: "#contact" },
    { label: "FAQ", href: "#faq" },
    {
      label: "Plans",
      href: "https://app.dentalhq.com/accounts/signup/my-dentist/9628",
    },
  ];

  let href = "/";
  let meta = $derived(data.metaData[0]);

  // One-page site: every URL (including 404s) canonicalises to "/".
  const canonicalUrl = `${CANONICAL_HOST}/`;
  const ogImage = `${CANONICAL_HOST}/images/og.png`;

  // Brand always present in the title; the Sheet still controls the keywords.
  let title = $derived(
    meta.seoTitle.includes(meta.companyName)
      ? meta.seoTitle
      : `${meta.seoTitle} | ${meta.companyName}`
  );

  // "7:30 AM–3:30 PM" -> ["07:30", "15:30"]; undefined when closed/unparseable.
  function parseHours(time) {
    const m = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!m) return undefined;
    const to24 = (h, min, ap) => {
      let hour = Number(h) % 12;
      if (ap.toUpperCase() === "PM") hour += 12;
      return `${String(hour).padStart(2, "0")}:${min}`;
    };
    return [to24(m[1], m[2], m[3]), to24(m[4], m[5], m[6])];
  }

  let jsonLd = $derived(
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Dentist",
      name: meta.companyName,
      url: canonicalUrl,
      telephone: `+${meta.companyPhone}`,
      address: meta.companyAddress,
      image: ogImage,
      openingHoursSpecification: meta.companyHours.flatMap(({ day, time }) => {
        const range = parseHours(time);
        return range
          ? [{ "@type": "OpeningHoursSpecification", dayOfWeek: day, opens: range[0], closes: range[1] }]
          : [];
      }),
    }).replace(/</g, "\\u003c") // never let Sheet text close the script tag
  );
</script>

<svelte:head>
  <title>{title}</title>
  <link rel="canonical" href={canonicalUrl} />
  <meta name="description" content={meta.seoDescription} />
  <meta name="keywords" content={meta.seoKeywords} />
  <meta name="author" content={meta.companyName} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={meta.seoDescription} />
  <meta name="twitter:image" content={ogImage} />
  <meta name="twitter:image:alt" content={meta.companyName} />
  <meta name="twitter:creator" content={meta.companyName} />
  <meta property="og:title" content={title} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:image:alt" content={meta.companyName} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:description" content={meta.seoDescription} />
  <meta property="og:site_name" content={meta.companyName} />
  <meta property="og:locale" content="en_US" />
  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<Template class="[&>main]:min-w-0 [&>footer]:min-w-0">
  {#snippet header()}
    <SiteHeader {links} phone={meta.companyPhone} company={meta.companyName} />
  {/snippet}

  {#snippet main()}
    {@render children()}
  {/snippet}

  {#snippet footer()}
    <Footer
      divider
      dividerFill="fill-accent-500-500"
      class="bg-accent text-primary-50-50 p-4"
      containerClass="grid md:grid-cols-2 grid-flow-dense items-center justify-center gap-4"
    >
      <div
        class="flex flex-col items-center justify-center text-left md:col-span-1 md:col-start-1 md:flex-row md:justify-start"
      >
        <Logo
          {href}
          src="logos/icon-black.svg"
          class="mr-2 flex size-36 items-center justify-center opacity-60 md:size-24"
        />
        <Copyright class="text-center md:text-nowrap"
          >{meta.companyName}</Copyright
        >
      </div>
      <div
        class="flex items-center justify-center md:-col-end-1 md:ml-auto gap-4"
      >
        <div class="flex gap-2 pr-4 items-center border-r-2 border-black/20">
          <BxHandicap class="size-10 text-4xl" />
          <strong>ACCESSIBLE</strong>
        </div>
        <Social socials={meta.socialLinks} />
      </div>
    </Footer>
  {/snippet}
</Template>
