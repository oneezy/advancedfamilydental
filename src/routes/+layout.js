// Prerender the whole site at build time so the HTML never depends on the
// Sheet at request time. Sheet edits show up on the next deploy.
export const prerender = true;
