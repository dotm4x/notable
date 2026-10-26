# Toggle

A toggle sets one value to on or off. Changing it takes effect at once, and it does not depend on any other value. Each toggle is independent, so toggles do not share a moving highlight, and no group of toggles behaves like a choice.

## What a toggle is

A toggle answers the question "is this on?" Its name describes what it controls, such as "Notifications" or "Compact view". The name must be available to every user, and it must be read together with the state. See [Accessibility](../foundations/accessibility.md).

## Forms

A toggle can show its state in two forms. Both are the same primitive, and the choice between them depends on meaning.

- **A mark** shows the state as present or absent, such as a check. It suits a value that reads as yes or no within a list of settings.
- **A track with a sliding knob** shows the state as a position. It suits a value that takes effect as soon as it changes, because the knob's position reads as the result.

Whichever form is used, the on and off states must be distinguishable without color. See [Selection](../patterns/selection.md).

## Interaction

A press changes the value. The change is confirmed at the moment of input, so the new state must be visible immediately.

## Dragging

A toggle with a sliding track may be dragged. The knob follows the pointer, and the new state is decided on release. When released, a dragged toggle changes to the side the knob has passed the midpoint toward. Releasing before passing the midpoint keeps the previous state, and a cancelled drag changes nothing. See [Drag](../patterns/drag.md).

A toggle that uses a mark does not need dragging. A mark has no track to travel along, so a press is its complete gesture.

## Keyboard

The control's standard keyboard activation changes the value; for checkbox-style toggles, this is Space. This provides a non-pointer alternative to dragging. Focus follows [Focus](../foundations/focus.md), and every gesture follows [Accessibility](../foundations/accessibility.md).

## Disabled

A disabled toggle shows its current state and cannot be changed. It does not respond to hover, press, or drag. See [States](../patterns/states.md).

## Principle

A toggle should say clearly whether something is on, and a change should take effect as the user expects.
