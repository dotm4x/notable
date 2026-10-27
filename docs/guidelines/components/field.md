# Field

A field is where the user types or edits a value. Typing is the primary action, so the field keeps focus while the user types. A field can stand alone, or it can host suggestions. When it hosts suggestions, it becomes the input half of a combined control, and the suggestions follow [Choice](./choice.md).

## Typing keeps focus

The user should not need to move focus into a list to keep typing. When a field offers suggestions, navigation keys move through them while focus stays in the field. The user should always know whether they are typing or navigating.

## Name

The field has a name that describes what is entered. Its visible label must be part of that name, so a spoken name matches what the user sees. See [Accessibility](../foundations/accessibility.md).

## Editing state

When a field has focus, it is in its editing state. For a text field, focus is therefore a meaningful state, not an incidental one. The focus treatment follows [Focus](../foundations/focus.md).

## Suggestions

Suggestions update as the user types. They narrow to matching options, and results should change smoothly, without flicker or jumping. An option that remains in the results should keep its place where possible.

When a suggestion is highlighted, it must be a valid, enabled option. If that option is removed by a new query, clear the highlight or move it to a relevant remaining option. Disabled options never receive the highlight, even when they match.

The selected value is separate from the suggestions. It stays known when the query changes, even if it is no longer among the results. See [Selection](../patterns/selection.md).

Suggestions appear in a popup that remains anchored to and does not obscure the field. When suggestions are navigated from the field, focus stays there. See [Popups](../patterns/popups.md).

## Empty results

When nothing matches, the suggestions should say so clearly. An empty surface must not look like a loading state, and it must not show a highlight.

## Keyboard

Navigation keys move the highlight through suggestions without leaving the field. A confirming key commits the highlighted option and closes the suggestions. The escape key dismisses the suggestions without changing the value. See [Choice](./choice.md).

## Principle

Typing should feel immediate, and the results should follow the user without surprise. The highlight should always rest on something the user can choose.
