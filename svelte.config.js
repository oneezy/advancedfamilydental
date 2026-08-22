/** @type {import("svelte").Config} */
import adapter from "@sveltejs/adapter-vercel";
import svelteConfig from "@oneezy/ui/svelte.config.js";

const config = {
  ...svelteConfig,
  kit: {
    ...svelteConfig.kit,
    adapter: adapter(),
  },
};

export default config;
