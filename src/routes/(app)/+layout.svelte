<script>
  import { page } from "$app/stores";
  import SiteHeader from "$lib/components/SiteHeader.svelte";
  import { Template, Logo, Footer, Social, Copyright } from "@oneezy/ui";

  import { formatPhoneNumber } from "@oneezy/ui/utils/utils.js";
  import BxHandicap from "~icons/bx/handicap";

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
</script>

<svelte:head>
  <title>{meta.seoTitle}</title>
  <meta name="description" content={meta.seoDescription} />
  <meta name="keywords" content={meta.seoKeywords} />
  <meta name="author" content={meta.companyName} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content={meta.seoDescription} />
  <meta name="twitter:title" content={meta.seoTitle} />
  <meta name="twitter:description" content={meta.seoDescription} />
  <meta name="twitter:image" content="{$page.url.origin}/images/og.png" />
  <meta name="twitter:image:alt" content={meta.companyName} />
  <meta name="twitter:creator" content={meta.companyName} />
  <meta property="og:title" content={meta.seoTitle} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={meta.companyWebsite} />
  <meta property="og:image" content="{$page.url.origin}/images/og.png" />
  <meta property="og:image:alt" content={meta.companyName} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:description" content={meta.seoDescription} />
  <meta property="og:site_name" content={meta.companyName} />
  <meta property="og:locale" content="EN_US" />
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
