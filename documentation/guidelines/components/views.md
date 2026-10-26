# Views

Views are mutually exclusive areas of content, and exactly one of them is current at a time. Switching to a view changes which content the user sees. A view differs from a [Choice](./choice.md): a choice sets a value, while a view is the place the user is.

## What a view is

Views are peers. They are sections the user moves between, not levels of a hierarchy. Each view has a name that describes its content. The name must be available to every user, and the current view must be communicated to assistive technology, not only shown visually.

## The current view

The current view indicator shows where the user is. It is persistent and visible at all times, so the user always knows which view is open. The indicator moves to the new view when the user switches, which lets the user follow the change. See [Selection](../patterns/selection.md).

The current view differs in meaning from a highlight. The indicator is a position, and the highlight is attention.

## Preview

Moving the pointer over a view previews where the user can go. The preview follows [Highlight](../patterns/highlight.md), so it travels between views rather than appearing on each one.

When both are visible, the preview and current indicator must remain visually distinct. The preview answers "where can I go?" while the current indicator answers "where am I?" See [Selection](../patterns/selection.md).

## Switching

Switching is a committed action: a press, a confirming key, or the release of a drag. A view's content changes only after a switch. Current view-switching behavior activates as keyboard focus moves; whether that should be the system-wide rule remains open in [Choice](./choice.md). See [Drag](../patterns/drag.md) for the gesture.

## Orientation

Views may be arranged horizontally or vertically. The meaning is the same in both. The current indicator and the preview follow the axis of the arrangement, and arrow keys move along that axis.

## Content stability

The content area should keep its position when the user switches views, so the arrangement of views remains a stable point of reference. Content that changes shape should not shift the views themselves.

## Keyboard and focus

Arrow keys move focus between enabled views in the direction of the arrangement; Home and End move to the first and last enabled views. Focus follows [Focus](../foundations/focus.md) and remains distinct from the current indicator.

## Disabled views

A disabled view is visible but cannot be previewed or switched to, and keyboard navigation skips it. How disabled semantics affect direct focus depends on whether the platform control is natively disabled or uses an accessibility state; see [States](../patterns/states.md).

## Dragging

Views arranged along an axis may be dragged. The drag indicator follows the pointer, while the current view and its content remain unchanged until release. See [Drag](../patterns/drag.md).

## Principle

Views should make it easy to move between related places, and they should always show which place is open.
