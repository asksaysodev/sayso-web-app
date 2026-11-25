# CLAUDE.md

Guidance for Claude Code (and the Sentry triage bot) working in this repo.

Sayso's web app: React 19 + Vite + TypeScript, deployed on Vercel. It talks to the Node/Express API in `sayso-backend`.

## Commands

```bash
npm run dev      # Vite dev server on :5173
npm run build    # tsc -b && vite build
npm run lint     # eslint
npm test         # vitest run (npm run test:watch to watch)
```

## Branches

PRs target `development`. `staging` and `main` only receive promotions. Every PR runs the `Validate` check (`.github/workflows/ci.yml`: lint, `tsc -b`, `npm test`), and it is required, next to Vercel's build.

## Testing

Vitest with jsdom and Testing Library (`vitest.config.ts`, separate from `vite.config.ts` so tests never load the Sentry plugin). Tests live next to the code they cover as `*.test.ts` / `*.test.tsx`.

Coverage is thin and deliberate. Write:

- **Unit tests** for pure logic: utils, formatters, the Sentry filters (`src/config/sentry.ts`).
- **Component tests** for UI bugs: render the component, act on it the way the user did, assert it doesn't break. A bug fix comes with a test that fails without the fix.

Don't chase coverage, and don't add end-to-end browser tests.

## Rules

- Never use plain `React.lazy` / `lazy()`: use `lazyView` from `@/utils/lazyView` (ESLint enforces it). Plain `lazy()` crashes on stale-chunk reloads after a deploy (SAYSO-APP-CZ).
