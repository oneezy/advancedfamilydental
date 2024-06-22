import { getProxyUrl } from "@oneezy/ui/utils/utils.js";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ fetch }) {
  // URLs to fetch data from created by Google Sheets
  const urls = [
    "https://opensheet.justinoneill2007.workers.dev/1UX84JSmYUXdmRUsmNxHptNh-1Y-gwG02aLzh9kvlYjE/general",
    "https://opensheet.justinoneill2007.workers.dev/1UX84JSmYUXdmRUsmNxHptNh-1Y-gwG02aLzh9kvlYjE/pages",
  ];

  try {
    // Fetch data from both URLs concurrently
    const [generalResponse, pagesResponse] = await Promise.all(
      urls.map((url) => fetch(url))
    );

    const [generalData, pagesDataArray] = await Promise.all([
      generalResponse.json(),
      pagesResponse.json(),
    ]);

    // Extract the first element of pagesDataArray
    const pagesData = pagesDataArray[0];

    // Map the fetched data to match the expected structure
    const metaData = generalData.map((page) => ({
      seoTitle: page.seo.title,
      seoDescription: page.seo.description,
      seoKeywords: page.seo.keywords,
      companyName: page.company.name,
      companyWebsite: page.company.website,
      companyYear: page.company.year,
      companyPhone: page.company.phone,
      companyAddress: page.company.address,
      companyInsurance: page.company.insurance,
      companyEmails: page.company.email.map((email) => ({
        type: email.type,
        email: email.email,
      })),
      companyPayments: page.company.payment.map((payment) => payment.type),
      companyHours: page.company.hours.map((hour) => ({
        day: hour.day,
        time: hour.time,
      })),
      brandLogo: page.brand.logo,
      brandLogoSmall: page.brand.logoSmall,
      brandLogoLarge: page.brand.logoLarge,
      brandIcon: page.brand.icon,
      brandColors: page.brand.color.map((color) => ({
        name: color.name,
        value: color.value,
      })),
      socialLinks: page.social.map((social) => ({
        name: social.name,
        url: social.url,
      })),
    }));

    const pageData = pagesData.site.page.map((page) => ({
      pageName: page.name,
      pageSlug: page.slug,
      pageTitle: page.title,
      pageTagline: page.tagline,
      pageDescription: page.description,
      pageImage: page.image,
      pageSeoTitle: page.seo_title,
      pageSeoDescription: page.seo_decription,
      pageSeoKeywords: page.seo_keywords,
    }));

    const quicklinksData = pagesData.quicklinks.map((quicklinks) => ({
      icon: quicklinks.icon,
      title: quicklinks.title,
      description: quicklinks.description,
      href: quicklinks.href,
    }));

    const teamData = pagesData.team.map((team) => ({
      id: team.id,
      src: getProxyUrl(team.src),
      image: team.image,
      name: team.name,
      position: team.position,
      description: team.description,
    }));

    const aboutData = pagesData.about.map((about) => ({
      src: getProxyUrl(about.src),
      image: about.image,
      title: about.title,
      subtitle: about.subtitle,
      description: about.description,
    }));

    const servicesData = pagesData.services.map((service) => ({
      title: service.title,
      description: service.description,
    }));

    const reviewData = pagesData.reviews.map((review) => ({
      name: review.name,
      src: getProxyUrl(review.src),
      image: review.image,
      rating: review.rating,
      description: review.description,
    }));

    const faqData = pagesData.faq.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }));

    return {
      metaData,
      pageData,
      aboutData,
      quicklinksData,
      teamData,
      servicesData,
      reviewData,
      faqData,
    };
  } catch (error) {
    console.error("Failed to fetch pages:", error);
    return {
      metaData: [],
      pageData: [],
      aboutData: [],
      quicklinksData,
      teamData: [],
      servicesData: [],
      reviewData: [],
      faqData: [],
    };
  }
}
