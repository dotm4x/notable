# Docs content

This directory is the content root for the documentation site. It is organized
so a new section can be added without changing the documentation renderer.

## Structure

Every page is a folder with an `index.mdx` file:

```
docs/
  index.mdx
  installation/
    index.mdx
  components/
    index.mdx
    button/
      index.mdx
      demos/
        index.ts
        variants.tsx
      assets/
```

- The folder path becomes the URL: `docs/components/button/index.mdx` renders at
  `/docs/components/button`.
- `docs/index.mdx` renders at `/docs`.
- A folder with an `index.mdx` is both a page and a navigation section.
- Adding `icons/`, `foundations/`, or `patterns/` requires no renderer changes.
- Icon detail pages live at `/docs/icons/<icon>` and are generated from
  `@dotm4x/one/icons` metadata by `app/docs/icons/[name]/page.tsx`, not from MDX.

## Page frontmatter

```yaml
---
title: Button
description: Displays a button or a component that looks like a button.
order: 10
---
```

- `title` and `description` are required for a useful sidebar and metadata.
- `order` controls position among siblings. Use gaps of ten.
- `icon` optionally selects a sidebar icon (`home`, `download`, `box`,
  `sparkles`; other values fall back to a document icon).
- `status: draft` hides the page in production.
- `sidebar: false` keeps the page out of the navigation.

## Demos

Demos live beside the page that uses them:

```
components/button/
  index.mdx
  demos/
    index.ts
    variants.tsx
```

A demo file is pure. It renders the component and does not include titles,
borders, or documentation chrome:

```tsx
'use client';

import { Button } from '@dotm4x/one/components';

export default function Variants() {
  return <Button>Click me</Button>;
}
```

`demos/index.ts` exposes the demos by name:

```ts
export { default as variants } from './variants';
```

The MDX references a demo by name:

```mdx
<Demo name="variants" />
```

The docs renderer resolves the demo, renders a preview, reads the source file,
and shows it in a code tab. Files use kebab-case and exports use camelCase; the
renderer maps `withIcon` to `with-icon.tsx`.

After adding or removing a `demos/index.ts`, run
`pnpm --filter @one/site generate:docs` or restart the dev server to refresh
the generated registry.

## Rules

1. Use kebab-case folder and file names.
2. Every page is a folder with `index.mdx`.
3. One demo per file. The file name is the kebab-case form of the demo name.
4. Never import demos from MDX. Reference them with `<Demo name="…" />`.
5. Do not add docs chrome inside a demo.
6. Put page-specific images in `assets/`.
7. Do not add an `h1` to the page body. The page header renders the title from
   frontmatter.
8. Do not duplicate design-language guidelines here. The guidelines in the
   repository root `docs/guidelines` remain the authoritative source.
