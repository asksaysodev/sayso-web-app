import { lazy } from 'react';

/**
 * `React.lazy` that survives a stale-chunk reload. When an old chunk 404s after a deploy, the
 * `vite:preloadError` handler in main.tsx calls preventDefault() and reloads, which makes the
 * dynamic import *resolve with undefined*. Plain `lazy()` then reads `.default` off undefined and
 * crashes the tree (SAYSO-APP-9W, SAYSO-APP-CZ). Here we suspend forever instead, until the reload lands.
 *
 * Use this for every lazy component — never plain `lazy()`.
 */
const lazyView: typeof lazy = (factory) =>
    lazy(() => factory().then((module) => module ?? new Promise<never>(() => {})));

export default lazyView;
