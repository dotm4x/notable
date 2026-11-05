# AGENTS.md — @dotm4x/one

`@dotm4x/one` is the React implementation of One. It translates the design language defined in `docs/guidelines/` into components, styles, icons, and public APIs.

Follow the root `AGENTS.md` first. This file adds only React-specific rules and does not repeat repo-wide policy.

## 1. Source of truth

Before implementing or changing a component:

1. Read the guidelines for the component, its foundations, and its patterns.
2. Inspect the existing component, related components, shared helpers, tokens, tests, and stories.
3. Check the public exports and `package.json`.
4. Reuse an existing pattern before inventing one.

- The documented design language decides visual and interaction behavior.
- React-specific technical decisions belong here, not in `docs/guidelines/`.
- If a guideline is unclear or contradicts the implementation, investigate both and report the conflict.
- If a change establishes a design decision that applies beyond React, update the guideline instead of encoding it only in code.

Do not copy an existing implementation blindly when it violates the guidelines.

## 2. Component architecture

### General rules

- Build focused, composable components with explicit, minimal public APIs.
- Separate public behavior from internal implementation.
- Prefer native HTML semantics and browser behavior.
- Keep application-specific logic out of the library.
- Avoid unnecessary state, effects, refs, memoization, wrappers, and abstractions.
- Prefer derived values over duplicated state.
- Preserve useful native attributes and event handlers.
- Follow the Rules of Hooks.
- Avoid direct DOM manipulation without a concrete reason.

### Compound components

Use a namespace API when a component has meaningful public parts.

```tsx
<Avatar.Root>
  <Avatar.Image src="/avatar.png" alt="User avatar" />
  <Avatar.Fallback>JD</Avatar.Fallback>
</Avatar.Root>
```

- Use one public namespace per compound component.
- Prefer roles such as `Root`, `Trigger`, `Content`, `Item`, `Image`, and `Fallback`.
- Do not add `Root` when a component has no meaningful parts.
- Do not create empty or uniform subcomponents.
- Keep internal helpers private.
- Preserve accessibility relationships across composed parts.

### Compound typing and JSDoc

When building the namespace with `Object.assign`:

- Declare an explicit interface, such as `AvatarComponent`, extending `React.FC<Props>` or `React.ForwardRefExoticComponent<...>`.
- Document public subcomponents only on the interface properties.
- Do not add JSDoc to internal helpers or subcomponent function declarations.

### Base UI

`@base-ui/react` supplies interaction behavior for complex components. It is an internal implementation dependency, never part of One's public API.

Use Base UI when a primitive provides meaningful behavior, accessibility, state management, or interaction infrastructure. Typical cases are dialogs, drawers, popovers, tooltips, selects, comboboxes, menus, tabs, accordions, and other composites that need focus, keyboard, dismissal, or coordinated state.

Do not use it for simple presentational work such as badges, separators, cards, skeletons, or basic avatars, nor for basic buttons that native elements already cover. Do not recreate complex interaction behavior manually when an appropriate primitive exists.

Encapsulation is mandatory:

- Wrap primitives in One-owned components and namespaces.
- Define One's own props, types, exports, composition, and styling.
- Map primitive state and props onto an intentional One API.
- Keep primitive imports, internal state adapters, and implementation types private.
- Do not require consumers to import Base UI.
- Do not expose primitive prop names or types for convenience.
- Do not blindly forward every prop.
- Keep the primitive replaceable without breaking consumers.
- Verify the installed version's actual API. Do not assume behavior from another version.

Integration:

- Reuse the behavior the primitive already implements. Do not duplicate focus, dismissal, keyboard, or selection logic.
- Add custom behavior only where One's requirements exceed the primitive.
- Avoid selectors that depend on undocumented DOM structure.
- Preserve native attributes and refs that belong to the public contract.
- Test the integration, not the primitive's internals.

Styling:

- Apply `one-` classes through supported slots and styling hooks.
- Use design tokens for shared decisions.
- Verify focus, disabled, selected, open, and closed states.
- Do not override primitive behavior only to reproduce a visual effect.

## 3. Package structure

```text
packages/one/
├── source/
│   ├── components/        # public components
│   ├── icons/             # icon sources, generated icons, public icon entry
│   ├── internal/          # cross-component infrastructure
│   │   ├── helpers/       # shared helpers and hooks
│   │   ├── primitives/    # established internal primitives
│   │   └── styles/        # shared non-token styles
│   ├── styles/            # stylesheet entry, fonts, tokens, motion helpers
│   ├── index.ts           # imports the shared stylesheet
│   └── styles.d.ts
├── scripts/generate-icons.ts
├── tsup.config.ts
└── vitest.config.ts
```

A typical component:

```text
source/components/avatar/
├── avatar.tsx      # implementation and public props
├── avatar.css
├── avatar.test.tsx
├── avatar.stories.tsx
├── types.ts        # types shared by the entry and its parts
├── context.ts      # shared component context
├── index.ts        # the component's public exports
├── parts/          # subcomponents grouped by domain
├── helpers/        # component-specific helpers
└── hooks/          # component-specific hooks
```

Only the files the component needs exist. A simple component may consist of the entry, stylesheet, test, story, and `index.ts`.

Rules:

- Keep the entry implementation, stylesheet, tests, and stories at the component root.
- Keep component-specific helpers, hooks, and parts inside the component. Do not place them in `source/internal/`.
- Split only along a real boundary: context, stateful behavior, pure logic, or a distinct group of subcomponents. Never split by line count.
- Group related subcomponents in one part file. Do not create a file per small element.
- Do not add `index.ts` barrels inside `helpers/`, `hooks/`, or `parts/`. Import files directly.
- Keep types shared between the entry and its parts in `types.ts`, and re-export public types from the entry to avoid import cycles.
- The entry owns the compound `Object.assign` and the public type re-exports.
- Keep component CSS in one file unless a split preserves cascade order and has a clear domain boundary.

Shared code:

- `source/internal/helpers/`: reusable implementation helpers and hooks shared across components.
- `source/internal/primitives/`: established internal interaction primitives.
- `source/internal/styles/`: shared non-token styles, such as `floating-surface.css`.
- `source/styles/`: the stylesheet entry, fonts, tokens, and motion helpers.
- Do not create competing locations for the same category.
- Do not export internal helpers from the package.

Icons:

- `source/icons/svg/` and `metadata.schema.json` are the source of truth.
- `source/icons/components/`, `source/icons/generated.ts`, and `source/icons/metadata.generated.ts` are generated and gitignored. Never edit them. Run `pnpm --filter @dotm4x/one generate:icons`; `prebuild` also regenerates them.
- `source/icons/types.ts` defines the hand-written metadata contract exported by the generated registry.
- `createIcon` returns an `IIconComponent` that exposes `iconNode`, so tools can preview or serialize an icon without duplicating its data.

## 4. Naming

- Component directories and files: kebab-case, such as `radio-group/` and `radio-group.tsx`.
- React components and namespaces: PascalCase.
- Variables, functions, hooks, and parameters: camelCase.
- Test and story files: `<component>.test.tsx` and `<component>.stories.tsx`.
- CSS classes: the `one-` convention in section 7.

Named TypeScript types use a `T` prefix: `TAvatarProps`, `TDialogState`, `TSelectionResult`. Prefer `TValue`, `TElement`, or `TResult` over a bare `T`. The prefix applies to named types only, not to components, namespaces, values, or functions. Keep implementation-only types private and export types only when consumers need them.

Use descriptive English names and established terminology. Avoid unexplained abbreviations and inconsistent synonyms.

## 5. TypeScript and React

- Use strict TypeScript. Never use `any`.
- Prefer accurate types, discriminated unions, explicit narrowing, and `unknown` for values that need validation.
- Avoid unjustified casts, non-null assertions, and redundant runtime checks.
- Prefer immutable transformations and `readonly` where it expresses the contract.
- Use `satisfies` when it adds validation without losing inference.
- Let TypeScript infer straightforward local values.
- Keep props minimal, and avoid boolean combinations that allow invalid states.
- Use controlled or uncontrolled state according to the component's intended contract.
- Avoid effects for values derivable during render.
- Use `useMemo` and `useCallback` only for a concrete identity, performance, or correctness problem.
- Avoid hooks that wrap a single trivial operation.
- Use the existing `motion` dependency. Do not add another animation library.

### Refs

- Support refs when consumers need them or the contract requires them.
- Ensure refs reach the intended DOM element or primitive.
- Preserve ref behavior when wrapping a primitive.

### Errors

- Handle meaningful failure and boundary conditions explicitly.
- Do not swallow errors or hide invalid states behind fallbacks.
- Validate at genuine trust boundaries only.

## 6. Design tokens and styles

The shared tokens are the source of truth for styling. Inspect `source/styles/` before adding values.

Locations:

- `source/styles/index.css`: shared style entry.
- `source/styles/fonts.css`: shared fonts.
- `source/styles/tokens/`: tokens by category, currently `colors`, `spacing`, `typography`, `radii`, `borders`, `shadows`, `blur`, `layers`, `motion`, `focus`, and `controls`.
- `source/styles/motion.ts`: shared motion helpers.
- `source/styles.d.ts`: style type declarations.
- `source/internal/styles/`: shared styles that are not tokens.

Token rules:

- Reuse existing tokens for color, spacing, typography, radii, borders, shadows, blur, layering, opacity, and motion.
- Prefer semantic tokens over raw palette values.
- Never hardcode a value when an appropriate token exists, and never duplicate a token under a new name.
- Keep tokens generic and independent of a single component.
- Add a token only for a reusable design decision, in the correct category.
- Changing a shared token requires inspecting its consumers and verifying the impact.
- If a token is genuinely missing, add it to its category instead of hardcoding the value.

### Component-internal custom properties

- Prefix component-scoped custom properties with `--_`, such as `--_sidebar-width`.
- Declare them in the component stylesheet or pass them through an inline style from the component. Never add them to `source/styles/tokens/`.
- They are private. If consumers must customize a value, expose an intentional prop.
- Keep primitive-provided properties, such as Base UI's `--toast-index`, unchanged and adapt them into the `--_` namespace where needed.

### Token organization

- Keep categories separated and preserve existing file boundaries.
- Use short category comments in token files only to group declarations.
- Do not use token files for duplicate or unnecessary abstractions.

### CSS versus inline styles

- Style through CSS classes and component stylesheets.
- Do not introduce Tailwind or another utility framework.
- Use inline styles only for values that are genuinely dynamic at runtime.
- Prefer CSS custom properties for dynamic values.
- Do not use inline styles to bypass tokens.
- Avoid global selectors, excessive specificity, and `!important`.
- Use logical properties, preserve writing directions, and respect reduced motion.

## 7. CSS class naming

Use the component-scoped, BEM-inspired convention with the `one-` prefix.

- Block: `one-{component}`, such as `one-avatar` or `one-radio-group`.
- Element: `one-{component}__{element}`, such as `one-dialog__title`.
- Modifier: `one-{component}--{modifier}`, such as `one-button--primary`.

Rules:

- Use elements for meaningful parts, not arbitrary wrappers.
- Avoid nesting element names: `.one-dialog__title`, not `.one-dialog__content__title`.
- Use modifiers only for documented variants.
- Prefer semantic attributes for states: `[data-checked]`, `[data-open]`, `[aria-selected='true']`, `:focus-visible`, `:disabled`.
- Use the attributes the component or primitive actually renders. Do not invent state attributes.
- Do not encode a state redundantly in both a class and an attribute.
- Never use unscoped generic classes such as `.root`, `.content`, or `.active`.
- Do not target fragile primitive DOM structure when a stable class or supported state attribute exists.
- Keep class names consistent across implementation, tests, and documentation.

## 8. Icons

- Import interface icons from `@dotm4x/one/icons`.
- Do not add icon libraries, or substitute emoji, Unicode characters, or handcrafted glyphs.
- Prefer an existing One icon over a custom SVG.
- Keep icon sizing, alignment, stroke, and spacing consistent, using tokens where applicable.
- Mark decorative icons as hidden from assistive technology.
- Give icon-only controls an accessible name. Never use an unlabeled icon as the only name.
- Do not add icons that reduce clarity.

## 9. Tests, stories, and browser checks

### Component tests

Use Vitest and React Testing Library: `source/components/{component}/{component}.test.tsx`.

- Use Arrange–Act–Assert with clear structure and descriptive names. Do not add phase comments.
- Test public behavior and observable contracts.
- Prefer accessible queries (`getByRole`, `getByLabelText`, `getByText`) and `userEvent`.
- Use asynchronous queries and `waitFor` only when behavior is asynchronous.
- Verify callbacks, state changes, composition, accessible names, and boundary conditions.
- Keep tests deterministic and isolated. Restore mocks, and avoid sleeps, needless snapshots, and order dependence.
- Do not depend on private implementation details unless a narrowly scoped integration test requires it.

### What not to test

Do not duplicate behavior a primitive already guarantees and One does not change. Test what One owns: the public API, composition, defaults, state mapping, styling contracts, accessibility relationships, documented interactions, and integration risks.

### Regression tests

Add a focused regression test when fixing a bug. It must fail before the fix and pass after. Never delete, skip, or weaken assertions to get a passing run.

### Browser checks

There is no standalone Playwright suite. Browser-level coverage runs through Vitest browser mode using the `storybook` project, with Playwright as the provider.

- `pnpm --filter @dotm4x/one test:storybook` runs that project.
- Use browser checks for real focus, keyboard, overlay, positioning, layering, scrolling, and responsive behavior that jsdom cannot represent.
- Prefer web-first assertions and observable conditions over elapsed time.
- Use `.playwright/cli.config.json` only for ad-hoc CLI verification. Do not add a second automation framework.

## 10. Storybook

Stories are the interactive documentation of the public API. Follow the installed Storybook configuration.

- Location: `source/components/{component}/{component}.stories.tsx`, using CSF.
- Shape stories around public behavior: Default, variants, sizes, states, composition, and interaction where meaningful.
- Do not create a story per trivial prop combination.
- Use `satisfies Meta<typeof Component>` and `tags: ['autodocs']`.
- Provide `args` and `argTypes` for meaningful public props, and exclude private ones.
- Default to `parameters: { layout: 'centered' }`. Reserve `fullscreen` or `padded` for page-level structures.
- Story names: concise Title Case, one or two words, three at most, with `Default` first. Avoid `With`, `Has`, `Using`, `Example`, `Basic`, and `Demo`.
- Every exported story includes a one-sentence English description:

  ```tsx
  parameters: {
    docs: {
      description: {
        story: 'Explains what this specific story demonstrates.',
      },
    },
  },
  ```

- For compound components, demonstrate the namespace API and realistic composition.
- Use real components, tokens, and One icons. Do not mock appearance.
- Keep stories deterministic and independent, and do not duplicate the test suite.
- Use Storybook interaction testing only where it adds value.

Stories must reflect the exported component, not a simplified imitation of it.

## 11. Accessibility

Follow `docs/guidelines/foundations/accessibility.md`, `focus.md`, and the applicable interaction patterns.

- Prefer native semantics and the correct interactive element.
- Provide names, descriptions, labels, and error associations where required.
- Use ARIA only for semantics native HTML does not express. Never add contradictory or redundant ARIA.
- Ensure keyboard support, logical focus order, and visible focus using focus tokens.
- Respect focus management provided by primitives.
- Avoid keyboard traps except for a correctly implemented modal.
- Restore focus when an interaction requires it.
- Communicate disabled, invalid, selected, expanded, and loading states correctly, never through color or motion alone.
- Maintain contrast and respect reduced motion.
- Verify with semantic assertions, keyboard tests, automated checks where available, and manual verification when automation is insufficient.

Never remove accessibility behavior to simplify an implementation.

## 12. Comments and documentation

Do not add ordinary code comments. Prefer clear code and naming.

Comments are appropriate only for information the code cannot express reliably: a browser or platform workaround, a critical invariant, a subtle interoperability constraint, a primitive limitation, or a correctness or security decision whose rationale matters. Keep them concise and current.

Short category comments are allowed in token files under `source/styles/tokens/` only.

Documentation belongs to the public contract: props and types, composition, variants and states, non-obvious behavior and constraints, accessibility responsibilities, and customization points. Keep the README, Storybook autodocs, examples, and public types aligned. Do not document private helpers, internal adapters, or trivial internals.

## 13. Motion

- Follow `docs/guidelines/foundations/motion.md` and the relevant patterns.
- Reuse shared motion tokens and helpers from `source/styles/motion.ts`.
- Use CSS transitions and animations for straightforward effects, and `motion` when its capabilities fit.
- Do not add another animation library.
- Avoid redundant animation state, timers, and layout thrash.
- Respect `prefers-reduced-motion`.
- Ensure motion never blocks keyboard use, focus, readability, or comprehension, and never carries state alone.

## 14. Package exports and public API

The entries built by `tsup` are:

- `source/index.ts`: imports the shared stylesheet. It does not re-export components.
- `source/components/index.ts`: public components and their types, published as `@dotm4x/one/components`.
- `source/icons/index.ts`: icons and their metadata, published as `@dotm4x/one/icons`.
- `dist/index.css`: the combined stylesheet, published as `@dotm4x/one/styles.css`. `tsup` appends the component CSS in its `onSuccess` step.

Rules:

- Export supported components and public types through these entries.
- Keep each component's `index.ts` limited to that component's public API.
- Never export internal helpers, private hooks, adapters, or internal types.
- Do not expose primitives as substitutes for One components.
- Keep exports, declarations, package metadata, styles, and documentation synchronized.
- Preserve supported import paths and module formats.
- Avoid redundant aliases and compatibility layers.
- Verify that the build emits the expected exports and declarations.
- Treat export changes as public API changes.

The public API should describe One, not reveal how it is implemented today.

The package does not add `"use client"` directives. Consumers render components from client code; do not assume they work in a React Server Component context.

## 15. Dependencies

- Follow the pnpm workspace conventions.
- Inspect existing dependencies before adding one, and prefer what is already installed.
- Base UI is justified only for complex interaction behavior.
- Use `@dotm4x/one/icons` for icons and the existing Motion, testing, and Storybook infrastructure.
- Preserve the React and React DOM peer dependency ranges.
- Do not add competing frameworks, styling systems, icon libraries, or browser-testing tools.
- Do not edit lockfiles. Use pnpm.
- Remove a dependency only after checking scripts, build configuration, exports, and usage.

## 16. Verification

After each logical change:

1. Format the changed files: `pnpm exec prettier --write <paths>`, or `pnpm format`.
2. Run `pnpm --filter @dotm4x/one test`.
3. Run `pnpm lint`.
4. Run `pnpm --filter @dotm4x/one typecheck`.
5. Run `pnpm --filter @dotm4x/one build` when implementation, styles, exports, icons, or package configuration change.
6. Run `pnpm --filter @dotm4x/one storybook:build` when stories or Storybook configuration change.

Before finishing:

- Run `pnpm --filter @dotm4x/one test:all` and record the actual result.
- Run the formatting, lint, type-check, and build commands that cover the change.
- Run `pnpm --filter @dotm4x/one test:storybook` when browser behavior is affected.

Do not attribute failures to the environment without evidence. Do not delete tests, weaken assertions, suppress diagnostics, or loosen compiler and lint rules to pass. If a check cannot run, say why and report the exact result.

## 17. Local consistency review

While working, watch for:

- Duplicated component behavior or unnecessary helpers.
- Inconsistent props, type names, or compound APIs.
- Inconsistent class naming.
- Hardcoded values that duplicate tokens.
- Unused CSS and obsolete tokens.
- Stale primitive integrations or assumed APIs.
- Missing or incorrect exports.
- Drift between implementation, tests, stories, and documentation.
- Tests that re-verify primitive behavior.
- Accessibility regressions and missing states.
- Unused imports, exports, and dependencies.
- Redundant wrappers, state, effects, or memoization.
- Flaky browser assertions.
- Debug output and temporary files.

Fix low-risk issues directly related to the task. Record broader issues for a separate change.

## 18. Completion criteria

A task in this package is complete when:

- The implementation follows the design language.
- The public API is coherent and leaks no primitive details.
- Tokens, helpers, CSS conventions, and naming are respected.
- Accessibility and interaction behavior are preserved.
- Tests and stories reflect the real public contract.
- Primitive behavior is not needlessly retested.
- Formatting, lint, type-check, build, and test commands ran.
- Exports and documentation are synchronized.
- The diff has no accidental changes.
- Remaining failures and limitations are reported honestly.

### Final report

- Changes implemented.
- Public API and architectural decisions.
- Accessibility and behavior considerations.
- Checks executed and their results.
- Remaining issues or pre-existing failures.
