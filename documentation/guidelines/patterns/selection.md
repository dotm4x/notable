# Selection

Selection is how a user chooses a value or item. Notable distinguishes between three related but different concepts: highlighted, selected, and current. Each communicates a different fact, and each must remain understandable when more than one applies to the same item.

## Highlighted

Highlighted is the item currently identified by pointer position or keyboard navigation. It is temporary and can change as the user explores available options.

Highlight answers the question, "Where is my attention now?" It does not, by itself, mean the item has been chosen. See [Highlight](./highlight.md).

## Selected

Selected is the value or item the user has chosen. It persists until the selection changes and remains identifiable when the pointer moves elsewhere.

Selected answers the question, "What did I choose?"

## Current

Current identifies the item or destination representing the user's present position within an interface, such as the current navigation destination.

Current answers the question, "Where am I?" It is a position, not necessarily a value chosen from a set of options.

## Visual indicators

The visual treatment of a selected value must communicate its persistent meaning. A selection indicator may move when the selected value changes, but its purpose differs from that of a highlight.

A highlight follows the temporary interaction target. A selection indicator represents the committed value. Neither should obscure focus or any other meaningful state.

The same item may be highlighted and selected simultaneously. When the highlight moves elsewhere, the selected value must remain clear.

## Communicating selection

Selection must not rely on color alone. Typography, an icon, an indicator, or a change in shape may reinforce the selected state. In a list that users scan, font weight alone is too subtle to serve as the only indication.

See [Colors](../foundations/colors.md) and [Choice](../components/choice.md).

## Current and highlighted can coexist

The current item and the highlighted item may be the same or different. When they coincide, both meanings must remain discernible. The highlight must not hide the visual treatment that communicates the current position.

## Principle

Highlighted, selected, and current each answer a different question. Their visual treatments must preserve those distinctions, even when the same item has more than one state.
