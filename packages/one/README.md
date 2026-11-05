# @dotm4x/one

**One design for the web.**

A unified design system bringing together a cohesive design language, expressive React components, and carefully crafted icons. Everything is designed to work together, helping you build consistent, accessible, and beautiful interfaces.

One is more than a component library. It provides foundations, principles, patterns, and tools for creating thoughtful web experiences.

## Installation

```sh
npm install @dotm4x/one
```

React and React DOM 18 or 19 are required as peer dependencies.

## Usage

```tsx
import { Button } from '@dotm4x/one/components';
import { Plus } from '@dotm4x/one/icons';
import '@dotm4x/one/styles.css';

export function Example() {
  return (
    <Button>
      <Plus /> Get started
    </Button>
  );
}
```

## What's included

- **Components** — Accessible, customizable React components with thoughtful defaults, expressive visuals, and purposeful interactions, available through the `@dotm4x/one/components` subpath. This includes Callout, CopyButton, Disclosure, Pager, Table, DataTable, Tree, and CodeBlock, plus a syntax highlighter.
- **Icons** — A collection of consistent icons available through the `@dotm4x/one/icons` subpath.
- **Styles** — Shared design tokens and component styles via `@dotm4x/one/styles.css`.

## Design language

One is built around four dimensions:

- **Foundations** — Color, typography, spacing, shape, elevation, focus, and motion.
- **Principles** — The ideas and values that guide design decisions.
- **Patterns** — Shared approaches to interaction, selection, loading, and interface states.
- **Components** — Consistent visual and behavioral building blocks.

Explore the full design guidelines in the repository for foundations, principles, patterns, and conventions.

## License

One is available under the [MIT License](./LICENSE).
