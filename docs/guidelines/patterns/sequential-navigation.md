# Sequential navigation

Sequential navigation moves between neighboring destinations in an ordered
collection, such as documentation pages or steps. It is not pagination: there
is no page count and no arbitrary jump to a number.

## Direction

Previous points toward the start of the sequence and next points toward the end.
The direction label and the destination title are both visible. The accessible
name includes both, so the link is understandable without the surrounding
layout.

## Boundaries

The first destination omits the previous link; the last omits next. Do not
render a disabled placeholder when a destination does not exist. The remaining
link keeps the full available space.

## Relationship to pagination

Use pagination when the user needs to move through a known set of pages or jump
to a page. Use sequential navigation when the order itself is the path. Do not
put a page count in a sequential navigation, and do not make its links look like
page buttons.

## Principle

Sequential navigation should make the next step obvious without turning the
page into a numbered control.
