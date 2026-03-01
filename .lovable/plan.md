

## Deploying to GitHub Pages

You're correct. For GitHub Pages, you need to set the `base` option in `vite.config.ts` so that all asset paths are relative to your repository's subdirectory.

### Change in `vite.config.ts`

Add `base: "/lotengo-espa-ol-online/"` to the Vite config. This tells Vite to prefix all asset URLs with `/lotengo-espa-ol-online/` instead of `/`, which is required when hosting under `https://davineiva.github.io/lotengo-espa-ol-online/`.

### Important notes

- After building (`npm run build`), the `dist/` folder contents should be deployed to the `gh-pages` branch or configured in your repo's GitHub Pages settings.
- You'll also want to make sure your React Router uses `basename="/lotengo-espa-ol-online"` on `BrowserRouter`, otherwise client-side routing will break on GitHub Pages. Alternatively, use `HashRouter` instead of `BrowserRouter` for simpler GitHub Pages compatibility.
- The file is `vite.config.ts` (TypeScript), not `vite.config.js`.

