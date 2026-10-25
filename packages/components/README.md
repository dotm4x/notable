# Notable

A collection of thoughtfully crafted, expressive components for the web.
Components are exported from the package root, and the stylesheet is available
as a separate package subpath.

```tsx
import { Avatar, AvatarGroup, Button, Tooltip } from '@dotm4x/notable';
import '@dotm4x/notable/styles.css';
```

The package requires React and React DOM 18 or 19 as peer dependencies.
Interactive components use native elements where possible and preserve their
standard HTML attributes. Provide an accessible name for controls whenever a
visible label is not supplied.

## Components

### Button

Renders a button with optional motion feedback. Native button attributes are
forwarded. The default `type` is `button`.

| Prop        | Type                                                           | Default   | Description                                  |
| ----------- | -------------------------------------------------------------- | --------- | -------------------------------------------- |
| `children`  | `ReactNode`                                                    | —         | Button content.                              |
| `variant`   | `primary \| secondary \| outline \| ghost \| danger`           | `primary` | Visual treatment.                            |
| `size`      | `small \| medium \| large \| icon \| icon-small \| icon-large` | `medium`  | Button dimensions.                           |
| `disabled`  | `boolean`                                                      | `false`   | Disables the button and its motion feedback. |
| `className` | `string`                                                       | —         | Additional class.                            |
| `type`      | native button type                                             | `button`  | Native form behavior.                        |

### Input

Wraps a native input and can associate a label, description, error message, and
leading or trailing content. All native input attributes and the forwarded ref
are preserved.

| Prop                                                | Type        | Default | Description                                                                          |
| --------------------------------------------------- | ----------- | ------- | ------------------------------------------------------------------------------------ |
| `label`                                             | `ReactNode` | —       | Visible, associated label.                                                           |
| `description`                                       | `ReactNode` | —       | Supporting text linked with `aria-describedby`.                                      |
| `error`                                             | `ReactNode` | —       | Error message; also marks the input invalid.                                         |
| `invalid`                                           | `boolean`   | `false` | Applies invalid styling and semantics.                                               |
| `leadingIcon`, `trailingIcon`                       | `ReactNode` | —       | Decorative content in the input control.                                             |
| `leadingIconInteractive`, `trailingIconInteractive` | `boolean`   | `false` | Prevents the corresponding icon wrapper from being hidden from assistive technology. |
| `className`                                         | `string`    | —       | Class applied to the native input.                                                   |

### Checkbox

Native checkbox input with an associated optional label and description.
Forwards native input attributes and its ref.

| Prop            | Type        | Default | Description                                     |
| --------------- | ----------- | ------- | ----------------------------------------------- |
| `label`         | `ReactNode` | —       | Visible, associated label.                      |
| `description`   | `ReactNode` | —       | Supporting text linked with `aria-describedby`. |
| `indeterminate` | `boolean`   | `false` | Sets the native mixed state.                    |
| `className`     | `string`    | —       | Class applied to the native input.              |

### Switch

A native checkbox exposed with switch semantics. Forwards native input
attributes and its ref.

| Prop          | Type        | Default | Description                                     |
| ------------- | ----------- | ------- | ----------------------------------------------- |
| `label`       | `ReactNode` | —       | Visible, associated label.                      |
| `description` | `ReactNode` | —       | Supporting text linked with `aria-describedby`. |
| `error`       | `ReactNode` | —       | Error message and invalid state.                |
| `invalid`     | `boolean`   | `false` | Applies invalid styling and semantics.          |
| `className`   | `string`    | —       | Class applied to the native input.              |

### Badge

Inline, non-interactive label. Compose text and icons through `children`; span
attributes are forwarded.

| Prop        | Type                                                                      | Default   | Description       |
| ----------- | ------------------------------------------------------------------------- | --------- | ----------------- |
| `children`  | `ReactNode`                                                               | —         | Label content.    |
| `variant`   | `default \| secondary \| outline \| success \| warning \| danger \| info` | `default` | Visual treatment. |
| `size`      | `small \| medium`                                                         | `medium`  | Badge dimensions. |
| `className` | `string`                                                                  | —         | Additional class. |

### Avatar

Compound component with image and fallback composition. A neutral built-in
user icon is used when there is no image or custom fallback.

```tsx
<Avatar size="medium">
  <Avatar.Image src="/avatars/max.png" alt="Max Perez" />
  <Avatar.Fallback>MX</Avatar.Fallback>
</Avatar>
```

| Prop              | Type                                      | Default  | Description                                               |
| ----------------- | ----------------------------------------- | -------- | --------------------------------------------------------- |
| `size`            | `small \| medium \| large \| extra-large` | `medium` | Avatar dimensions.                                        |
| `children`        | `ReactNode`                               | —        | Compose `Avatar.Image` and/or `Avatar.Fallback`.          |
| `className`       | `string`                                  | —        | Additional class.                                         |
| `Avatar.Image`    | native image attributes                   | —        | Image; fallback is shown until it loads and after errors. |
| `Avatar.Fallback` | span attributes and `ReactNode` children  | —        | Custom text, icon, or other fallback content.             |

### AvatarGroup

Arranges avatars or wrapped interactive content. `spacing` is the number of
pixels by which neighboring items overlap, not the gap between them. The
`max` value counts avatars only; any overflow indicator is additional.

| Prop          | Type                                      | Default      | Description                                                                         |
| ------------- | ----------------------------------------- | ------------ | ----------------------------------------------------------------------------------- |
| `children`    | `ReactNode`                               | —            | Composed avatars, optionally inside links, buttons, or tooltips.                    |
| `size`        | `small \| medium \| large \| extra-large` | `medium`     | Size inherited by descendant avatars and the overflow indicator.                    |
| `max`         | `number`                                  | —            | Maximum visible children; non-positive values show none, decimals are rounded down. |
| `spacing`     | `number`                                  | `8`          | Overlap in pixels; negative values clamp to zero.                                   |
| `orientation` | `horizontal \| vertical`                  | `horizontal` | Direction of the overlap.                                                           |
| `overflow`    | `ReactNode`                               | `+N`         | Custom visual content for the accessible hidden-avatar indicator.                   |
| `className`   | `string`                                  | —            | Additional class.                                                                   |

### Spinner

Decorative loading icon exposed as a status. Use `label` to describe the
operation; the icon itself is hidden from assistive technology.

| Prop                 | Type                              | Default   | Description                                                      |
| -------------------- | --------------------------------- | --------- | ---------------------------------------------------------------- |
| `label`              | `string`                          | `Loading` | Accessible status name.                                          |
| `size`               | `small \| medium \| large`        | `medium`  | Spinner dimensions.                                              |
| `className`          | `string`                          | —         | Additional class.                                                |
| HTML span attributes | `HTMLAttributes<HTMLSpanElement>` | —         | Forwarded to the status element; `aria-label` overrides `label`. |

### SegmentedControl

Controlled or uncontrolled, single-selection radio group.

| Prop           | Type                                | Default   | Description                                                                                  |
| -------------- | ----------------------------------- | --------- | -------------------------------------------------------------------------------------------- |
| `options`      | `readonly SegmentedControlOption[]` | required  | Options with unique `value`, visible `label`, optional `icon`, `disabled`, and `aria-label`. |
| `value`        | `string`                            | —         | Controlled selected option.                                                                  |
| `defaultValue` | `string`                            | —         | Initial selection when uncontrolled.                                                         |
| `onChange`     | `(value) => void`                   | —         | Called when selection changes.                                                               |
| `size`         | `small \| medium \| large`          | `medium`  | Control dimensions.                                                                          |
| `disabled`     | `boolean`                           | `false`   | Disables all options.                                                                        |
| `name`         | `string`                            | generated | Native radio form name.                                                                      |
| `label`        | `ReactNode`                         | —         | Visible group label.                                                                         |
| `className`    | `string`                            | —         | Additional class on the radio group.                                                         |

### Tooltip

Positions a tooltip relative to its single child element, using a portal to
avoid clipping by ancestors. The child should be an element that can receive
`aria-describedby`.

| Prop        | Type                             | Default  | Description                                        |
| ----------- | -------------------------------- | -------- | -------------------------------------------------- |
| `children`  | single `ReactElement`            | required | Trigger element.                                   |
| `content`   | `string`                         | required | Tooltip text.                                      |
| `placement` | `top \| right \| bottom \| left` | `top`    | Preferred placement; may flip to fit the viewport. |
| `delay`     | `number`                         | `350`    | Show delay in milliseconds.                        |
| `disabled`  | `boolean`                        | `false`  | Disables tooltip display.                          |
| `className` | `string`                         | —        | Class on the trigger wrapper.                      |

## Styling and themes

Import `@dotm4x/notable/styles.css` once in the application entry point.
Tokens are defined under `:root` and can be themed by setting
`data-theme="light"` or `data-theme="dark"` on a root element.
