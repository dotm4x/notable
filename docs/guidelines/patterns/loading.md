# Loading

Loading feedback tells the user that content or an action is still in progress. It should reduce uncertainty without making the wait feel longer than it is.

## Placeholders match their content

A placeholder should have the size and shape of the content it replaces. When content arrives, the layout should not shift. A placeholder that looks nothing like its final content makes the arrival feel like a jump.

## Gentle activity

The placeholder should show activity with a calm, continuous motion, such as a soft wave moving across the surface. The motion should be slow enough to read as ambient, not urgent. It should not compete with the content around it.

## Pointer response

Loading placeholders are not interactive, so a pointer-following light is not part of the loading language. It must not appear on a placeholder, because the light would suggest an action that does not exist. A pointer light belongs only to interactive surfaces, where it signals a real affordance.

## Reduced motion

Under reduced motion, the placeholder keeps its shape and stops its shimmer, pulse, and pointer-following spotlight. The user must still understand that content is loading. See [Motion](../foundations/motion.md).

## Contrast

Placeholders should remain visible in both themes, but they are not text and do not need text contrast. They should still be clearly distinct from the page, so a user can see where content will appear.

## Principle

Loading feedback should show that something is coming, where it will appear, and roughly what it will look like, without drawing more attention than the content itself.

## Open question

Should pointer-following light remain part of the loading-placeholder language when placeholders themselves are not interactive, or should it be reserved for contexts where it cannot imply an affordance?
