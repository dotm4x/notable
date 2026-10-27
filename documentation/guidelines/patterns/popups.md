# Popups

A popup is floating content that appears in response to an action, sits above the page, and goes away when the user is finished. Menus, option lists, and small informational panels are popups. A popup is temporary. It exists to help the user make a decision, and it should not become a page in its own right.

## Anchoring

A popup belongs to the element that opened it. It is placed close to that element, so the user's eye does not have to travel far to find it. When there is not enough room in the chosen direction, the popup moves to the side with room, while staying attached to its trigger.

## Appearance

A popup uses the shared floating-surface role, with a clear edge and a shadow that marks it as floating. Its content inherits that surface rather than introducing a component-specific color. See [Elevation](../foundations/elevation.md).

## Entrance and exit

A popup enters with a small, quick movement, such as a slight scale and a fade. Its exit should be shorter, because the user has already decided. Entrance and exit should be calm, not bouncy.

The shared floating surfaces use a shorter transition for exit than for entrance.

A popup must not appear in the wrong place and then move. Its first frame should be where it belongs.

## Contents

Popup content should be short enough to scan. Long content should scroll inside the popup, not extend beyond it. When a popup contains a highlighted list, the highlight follows [Highlight](./highlight.md).

## Dismissal

A popup closes according to its role: an option list closes after a choice, Escape dismisses transient content, and an outside interaction may dismiss non-modal content. Modal surfaces may prevent outside dismissal. When a popup moves focus away from its invoker, closing should restore focus there. A field-owned suggestion list keeps focus in the field; a tooltip never takes focus and must close without moving it.

## Layering

Popups follow the shared layering rules in [Elevation](../foundations/elevation.md).

## Reduced motion

Under reduced motion, a popup appears and disappears with an instant change or a simple fade. It must still be fully usable.

## Principle

A popup should appear where the user expects, stay readable while it is open, and leave without leaving the user disoriented.
