# Components

Components in these guidelines are fundamental interaction primitives. A primitive describes one reusable behavior: a contract for what the user can do, what the user sees, and what the user can rely on. Finished widgets are not primitives. A widget is a composition of primitives, patterns, and foundations, and its specialized behavior follows from that composition.

A primitive is documented only when it provides a behavioral contract that several components can share. Each one covers its semantics, states, input behavior, keyboard and accessibility expectations, focus, motion, and composition. The visual design of a finished widget is not part of any primitive.

## Primitives in this category

- [Choice](./choice.md): choosing one value from a set of mutually exclusive options.
- [Toggle](./toggle.md): setting one independent value on or off.
- [Views](./views.md): moving between mutually exclusive areas of content.
- [Field](./field.md): typing and editing a value, with optional suggestions.

## Composition

Finished components are described by the primitives they combine. The composition is a guide for designers, not an inventory.

- A select is a [choice](./choice.md) shown in a popup, opened from a trigger.
- A combobox is a [field](./field.md) with suggestions that behave as a [choice](./choice.md).
- A radio group is a [choice](./choice.md) presented as native radio options.
- Tabs are [views](./views.md) arranged along an axis, which may be [dragged](../patterns/drag.md).
- A segmented control is a [choice](./choice.md) with options shown together, which may be [dragged](../patterns/drag.md).
- A switch is a [toggle](./toggle.md) with a sliding track, which may be [dragged](../patterns/drag.md).
- A checkbox is a [toggle](./toggle.md) shown as a mark.
- A breadcrumb is a trail of links ending in the current location, where a level may open a [popup](../patterns/popups.md) of sibling destinations.

## Relationship to the other categories

Primitives apply [Patterns](../patterns/README.md), which describe shared behaviors such as highlight, drag, and popups, and [Foundations](../foundations/README.md), which describe the visual rules they share. Their purpose is governed by the [Principles](../principles/README.md).

## Adding a primitive

Add a primitive only when a behavior is shared by more than one kind of component, and when its meaning can be stated without naming a finished widget. Otherwise, document the behavior in a pattern or describe the composition above.
