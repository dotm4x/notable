# Component CSS Token Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace component CSS literals with existing One tokens wherever the value and meaning match, without adding tokens or changing unrelated local work.

**Architecture:** Keep `source/styles/tokens/` authoritative. Use semantic color and typography tokens, the existing border-width token, and spacing tokens for matching reusable dimensions and layout values. Preserve values that have no appropriate token or are implementation-specific.

**Tech Stack:** CSS custom properties, pnpm, Vitest, TypeScript, tsup.

**Spec:** `docs/guidelines/foundations/{values,colors,spacing,shape,typography,focus}.md`; `packages/one/AGENTS.md` §6.

## Global Constraints

- Reuse existing tokens; do not add or rename tokens for one component.
- Preserve computed values and component behavior except where an existing foundation explicitly requires an existing token.
- Do not modify the user's current changes in `footer.css`, the site, package manifests, or generated/local files.
- Keep raw values that lack an appropriate token (for example 1px borders, spacing values outside the scale, zero resets, and typography-relative `em` values).
- Leave text-decoration measurements as typography details rather than mapping them to unrelated border or spacing tokens.
- Do not modify generated output under `dist/` or `storybook-static/`.

## Review Focus

- Token substitutions must preserve layout and focus treatment at the default root font size.
- `#000` in scroll masks is an alpha-mask stop, not theme-dependent interface text; use the invariant black primitive only.
- Focus outline width must stay shared and remain distinct from the existing 2px outline offset.
- Component dimensions are tokenized only when an existing spacing token has the exact value; do not invent missing size steps.
- Preserve the uncommitted `footer.css` changes; its text-decoration measurements are not layout/border tokens.

---

### Task 1: Tokenize repeated border and focus widths

**Files:**

- Modify `packages/one/source/components/accordion/accordion.css`
- Modify `packages/one/source/components/breadcrumb/breadcrumb.css`
- Modify `packages/one/source/components/button/button.css`
- Modify `packages/one/source/components/calendar/calendar.css`
- Modify `packages/one/source/components/checkbox/checkbox.css`
- Modify `packages/one/source/components/collapsible/collapsible.css`
- Modify `packages/one/source/components/combobox/combobox.css`
- Modify `packages/one/source/components/file-upload/file-upload.css`
- Modify `packages/one/source/components/link/link.css`
- Modify `packages/one/source/components/navigation-menu/navigation-menu.css`
- Modify `packages/one/source/components/pagination/pagination.css`
- Modify `packages/one/source/components/radio-group/radio-group.css`
- Modify `packages/one/source/components/scroll-area/scroll-area.css`
- Modify `packages/one/source/components/segmented-control/segmented-control.css`
- Modify `packages/one/source/components/slider/slider.css`
- Modify `packages/one/source/components/switch/switch.css`
- Modify `packages/one/source/components/tabs/tabs.css`
- Modify `packages/one/source/components/toast/toast.css`
- Modify `packages/one/source/components/toggle/toggle.css`
- Modify `packages/one/source/internal/primitives/menu/menu.css`

- [x] Run a static scan and confirm the focus-outline literals and radio indicator's 2px border are present.
- [x] Replace focus and border widths with `var(--one-border-width)`; use it for the Slider/Tabs 2px stroke dimensions and Segmented Control's inner-radius subtraction too. Leave outline offsets unchanged because they describe placement, not stroke width.
- [x] Re-run the scan and confirm no matching hard-coded border/focus stroke widths remain in the task files.

### Task 2: Reuse the spacing scale for matching dimensions and insets

**Files:**

- Modify `packages/one/source/components/accordion/accordion.css`
- Modify `packages/one/source/components/avatar/avatar.css`
- Modify `packages/one/source/components/avatar/avatar-group.css`
- Modify `packages/one/source/components/button/button.css`
- Modify `packages/one/source/components/calendar/calendar.css`
- Modify `packages/one/source/components/checkbox/checkbox.css`
- Modify `packages/one/source/components/empty/empty.css`
- Modify `packages/one/source/components/pagination/pagination.css`
- Modify `packages/one/source/components/progress/progress.css`
- Modify `packages/one/source/components/radio-group/radio-group.css`
- Modify `packages/one/source/components/segmented-control/segmented-control.css`
- Modify `packages/one/source/components/shortcut/shortcut.css`
- Modify `packages/one/source/components/skeleton/skeleton.css`
- Modify `packages/one/source/components/slider/slider.css`
- Modify `packages/one/source/components/switch/switch.css`
- Modify `packages/one/source/components/tabs/tabs.css`
- Modify `packages/one/source/components/time-picker/time-picker.css`
- Modify `packages/one/source/components/toggle/toggle.css`
- Modify `packages/one/source/components/tooltip/tooltip.css`
- Modify `packages/one/source/internal/primitives/menu/menu.css`

- [x] Run a static scan to record exact literals matching the existing spacing scale in layout, size, and component custom-property declarations.
- [x] Replace those exact matches with their `--one-spacing-*` token; leave non-scale values and text-relative values unchanged.
- [x] Re-run the scan and confirm no matching raw spacing-scale values remain in the targeted declarations.

### Task 3: Tokenize the remaining exact typography and palette matches

**Files:**

- Modify `packages/one/source/components/breadcrumb/breadcrumb.css`
- Modify `packages/one/source/components/link/link.css`
- Modify `packages/one/source/components/scroll-area/scroll-area.css`

- [x] Confirm the breadcrumb's 500 weight matches `--one-font-weight-medium` and the scroll masks' `#000` matches the invariant `--one-black` primitive.
- [x] Replace those literals with the corresponding existing tokens; use `--one-radius-xs` for the Link's 2px radius, which is outside the documented radius family.
- [x] Verify the raw literals are gone while mask gradients still end in `transparent`.

### Task 4: Verify package behavior and output

**Files:** None.

- [ ] Run `pnpm format:check` and `pnpm lint`.
- [x] Run `pnpm --filter @one/components typecheck` and `pnpm --filter @one/components build`.
- [ ] Run `pnpm --filter @one/components test:all` and confirm all tests pass.
- [x] Review `git diff` to ensure no unrelated or user-owned files were changed.
