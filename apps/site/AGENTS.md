# AGENTS.md — @one/site

`@one/site` is the Next.js documentation and marketing site. It consumes `@dotm4x/one` through the pnpm workspace and renders the design guidelines and component documentation.

Follow the root `AGENTS.md`. This file covers only site-specific conventions.

## 1. Commands

| Command                                 | Purpose                                                         |
| --------------------------------------- | --------------------------------------------------------------- |
| `pnpm --filter @one/site dev`           | Build the package, regenerate the demo registry, start Next dev |
| `pnpm --filter @one/site build`         | Build the package and registry, then run `next build`           |
| `pnpm --filter @one/site start`         | Serve the production build                                      |
| `pnpm --filter @one/site typecheck`     | Regenerate the registry, then run `tsc --noEmit`                |
| `pnpm --filter @one/site generate:docs` | Regenerate `source/docs/generated/demos.ts`                     |

`predev`, `prebuild`, and `pretypecheck` already run the package build and registry generation. Do not repeat those steps.

## 2. Structure

```text
apps/site/
├── app/                 # App Router routes
│   ├── page.tsx         # marketing home
│   ├── components/      # redirect to /docs/components
│   └── docs/            # /docs, /docs/[...slug], shared layout
├── docs/                # MDX content; folder = URL
├── source/
│   ├── components/      # site UI, including the docs adapters
│   └── docs/            # docs engine
├── scripts/generate-docs.mjs
└── public/
```

The docs engine (`source/docs/`):

- `config.ts`: content directory, base path, page filename, ignored folders.
- `content.ts`: filesystem scan, navigation tree, breadcrumbs, previous and next pages.
- `toc.ts`: table of contents from headings.
- `mdx.tsx`: binds MDX primitives and renders a page.
- `demo.tsx` and `demo-frame.tsx`: resolve a demo and render the Preview and Code tabs.
- `generated/demos.ts`: generated demo registry, committed to the repository.

## 3. Documentation content

- A folder path is a URL. Each page is `<folder>/index.mdx`; `assets/` and `demos/` folders are not pages.
- Frontmatter drives navigation and metadata:

| Field         | Purpose                                 |
| ------------- | --------------------------------------- |
| `title`       | Page title and sidebar label            |
| `description` | Page description                        |
| `order`       | Sidebar ordering                        |
| `icon`        | Icon name                               |
| `status`      | `draft`, `stable`, or `beta`            |
| `sidebar`     | Whether the page appears in the sidebar |

- Do not add an H1. The page header renders the frontmatter title.
- MDX files contain no imports. Use the available primitives:
  - `<Demo name="..." />`
  - `<PageList />`
  - `<Callout title="...">`
  - `<PackageManagerTabs />`
- Fenced code blocks render through the package `CodeBlock` with client-side Shiki. Do not add another highlighter.

### Demos

- One file per demo in `<page>/demos/`, kebab-case, such as `with-icon.tsx`.
- Export camelCase names from `<page>/demos/index.ts`:

  ```ts
  export { default as withIcon } from './with-icon';
  ```

- Reference the export name in MDX: `<Demo name="withIcon" />`.
- Adding a demo requires regenerating the registry with `pnpm --filter @one/site generate:docs`, or by restarting `dev`.
- An unknown demo name fails at render time. Fix the export or the `name`.
- Demos use real One components from the workspace package.

### MDX pitfalls

- Do not nest block elements that MDX turns into paragraphs inside `<Callout>`. Write the text directly and let MDX create the paragraph; otherwise hydration fails on invalid nesting.
- Do not add an H1 or a manual page title.

## 4. Server and client boundaries

- Docs engine modules that read content import `server-only` (`content.ts`, `mdx.tsx`, `demo.tsx`). Never import them from client components.
- The docs UI adapters are client components: `DocsShell`, `DocsSidebar`, `DocsHeader`, `DocsToc`, `DocsBreadcrumbs`, `DocsCallout`, `DocsPageList`, `DocsPager`, and `DocsCodeBlock`.
- The package ships without `"use client"` directives. Render One components inside client components, and do not import the components barrel from a server component.
- `next-themes` controls the `data-theme` attribute. The theme toggle lives in `source/components/theme-toggle`.

## 5. Styling and accessibility

- Reuse One tokens and the package stylesheet. Do not hardcode colors, spacing, typography, or radii.
- Keep site-only styles in the site (`app/page.css`, `source/styles`), scoped to site classes.
- Preserve semantic HTML, landmarks, heading order, focus behavior, keyboard access, and reduced motion.
- Documentation examples must be operable by keyboard and understandable without relying on color or motion alone.

## 6. Verification

- Run `pnpm --filter @one/site typecheck` for content, engine, and component changes.
- Run `pnpm --filter @one/site build` for route, MDX, demo, or configuration changes. Stop any running `next start` first; a stale `.next` directory causes transient type errors.
- Run `pnpm --filter @one/site generate:docs` and commit the regenerated registry when demos change.
- Run `pnpm lint` and `pnpm format:check` at the repository root.
- Verify new pages and demos in the browser. A new page should appear in the sidebar in the intended order.

A known, pre-existing warning reports that the Next ESLint plugin is not configured. It is non-fatal.

## 7. Completion criteria

- The page renders, appears in navigation, and has correct frontmatter.
- Every demo resolves and matches its documentation.
- No server or client boundary is violated.
- No hardcoded design values.
- Typecheck and build pass, or the limitation is reported.
