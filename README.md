# Advanced Family Dental

The Advanced Family Dental website, built with SvelteKit.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- pnpm `11.20.0`

This repository must use pnpm because the workspace applies a compatibility patch to `@oneezy/ui` during installation.

## Setup

```bash
pnpm install --frozen-lockfile
```

## Developing

```bash
pnpm dev
```

The local site runs at `http://localhost:1111`.

## Validation

```bash
pnpm test
pnpm check
pnpm build
```

## Production preview

```bash
pnpm preview
```

Choose and configure the appropriate [SvelteKit adapter](https://svelte.dev/docs/kit/adapters) before deploying to a production host.
