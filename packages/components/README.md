# Notable

A collection of thoughtfully crafted, expressive components for the web.

## Installation

```sh
npm install @dotm4x/notable
```

React and React DOM 18 or 19 are required as peer dependencies.

## Usage

Import components and the stylesheet from the package:

```tsx
import { Button } from '@dotm4x/notable';
import '@dotm4x/notable/styles.css';

export function Example() {
  return <Button>Get started</Button>;
}
```

Mount one toast provider in the application, then trigger notifications from
anywhere:

```tsx
import { ToastProvider, toast } from '@dotm4x/notable';

export function App() {
  return (
    <ToastProvider>
      <button onClick={() => toast.success('Changes saved.')}>Save</button>
    </ToastProvider>
  );
}
```

Use `toast.promise(promise, { loading, success, error })` to update one
notification through a promise lifecycle. For independent React roots, create a
controller with `createToastController()`, pass it to `ToastProvider`, and call
its `controller.toast` API.

Compound components expose their parts as namespaces, such as `Accordion.Item`,
`RadioGroup.Item`, and `Avatar.Group`. The named exports `AccordionItem`,
`RadioGroupItem`, and `AvatarGroup` remain available and refer to the same
components.

Tooltips open on hover or keyboard focus. Pressing Escape dismisses them until
the pointer leaves or focus moves away and returns.

## License

This project is licensed under the MIT License, see the [LICENSE](LICENSE) for more information.
