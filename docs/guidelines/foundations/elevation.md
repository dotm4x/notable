# Elevation

Elevation describes which content sits above other content. Notable uses depth sparingly. Most of the interface is flat, and only content that temporarily floats above the page gains a shadow and a distinct surface.

See [Values](./values.md#shadows) for the shadow values.

## Layers

From lowest to highest, the layers are:

1. The page.
2. Containers, such as cards and panels, which are part of the page.
3. Floating content, such as menus, popups, and tooltips, which appears above the page for a moment.
4. Modal content and transient messages, such as dialogs and notifications, which overlay the rest of the interface. Modal content interrupts; a notification does not necessarily do so.

Each layer should be distinguishable from the one below it, in both themes.

## Shadow

A shadow signals that something floats. Reserve it for floating content. Containers that sit on the page should be separated by surface and border, not by shadow. Shadows applied everywhere make the interface look busy and dilute their meaning.

## Stacking

Floating content must appear above the content it belongs to, regardless of where it sits in the document. Users should never have to work out which of two overlapping items is on top.

## Temporary content

Floating content is temporary. It appears in response to an action and goes away when the user completes or cancels that action. Its entrance and exit should match its temporary role. See [Popups](../patterns/popups.md).

## Principle

Depth should tell the user what is temporary and what is permanent. Only content that truly floats should look like it does.

## Modal and floating surfaces

Dialogs and drawers are modal content. They use a distinct treatment: the raised surface, the stronger shadow, and an overlay that interrupts the page. Menus, popups, and tooltips stay in the floating layer with their own surface. The two stay distinguishable in both themes.
