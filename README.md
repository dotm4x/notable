# Notable

Notable is a workspace for building a cohesive, expressive design system for the
web. Its current focus is a React component library: reusable interface
building blocks, shared visual foundations, and examples that help keep their
behavior and appearance consistent.

The component package's installation and usage instructions live in
[`packages/components/README.md`](./packages/components/README.md).

## Vision

Notable aims to make everyday interfaces feel clear, welcoming, and considered.
Components should be useful on their own and fit together as part of a
consistent system, rather than feeling like unrelated UI pieces.

The design language is friendly and expressive, with approachable shapes,
readable typography, and purposeful motion. Personality should support usability:
interactions stay predictable, content stays legible, and accessibility remains
part of the component's design rather than an afterthought.

## Design principles

- **Cohesion:** shared tokens and patterns keep components visually related.
- **Clarity:** semantics, labels, and interaction feedback make controls easy to
  understand.
- **Accessibility:** prefer native HTML behavior and support keyboard and
  assistive-technology users.
- **Composability:** keep components focused and make them work naturally
  together.
- **Purposeful expression:** use shape, typography, and motion to create a
  distinctive feel without sacrificing usability.

## Project structure

| Package           | Description                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `@dotm4x/notable` | React component library, including reusable components, shared styles and design tokens, tests, and Storybook stories. |
| `apps/sandbox`    | Vite and React app for trying the component library against its live source.                                           |

The repository root contains the pnpm workspace configuration and shared
development scripts. Run `pnpm dev` to start the sandbox.

## Development

The repository uses [pnpm](https://pnpm.io/) workspaces. From the repository
root:

```sh
pnpm install
pnpm build
pnpm lint
pnpm typecheck
pnpm format:check
```

To run the component package's tests or open its Storybook:

```sh
pnpm --filter @dotm4x/notable test
pnpm --filter @dotm4x/notable storybook
```

## License

Notable is available under the [MIT License](./LICENSE).
