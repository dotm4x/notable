# Data display

Tables present structured values so people can compare, scan, and act on them.
They are for data, not for layout.

## Structure

Use a native table with a caption or another accessible name. Header cells
describe their column and use `scope="col"`; row headers use `scope="row"`.
Do not use a table when a list or a set of cards communicates the same
information more directly.

## Alignment

Text starts at the inline start. Numbers that are compared or summed align at
the inline end and use tabular figures. Dates and times follow the same rule
when their width matters. Alignment must come from the content, not from a
decorative attempt to center everything.

## Sorting

A sortable header is a control, not a decoration. It exposes the current
direction through `aria-sort`, and the visible indicator must not be the only
signal. Sorting must be stable enough that equal values do not jump between
renders.

## Filtering and empty states

Filtering narrows the rows without hiding the fact that a filter is active.
When no rows match, show a clear empty state inside the table region and
explain whether the data is missing or the filter is too narrow.

## Selection

Row selection is independent from the current row and from hover. Selected rows
remain selected when the pointer leaves, and a header selection applies only to
the rows it names, such as the current page. A selection count is announced
politely and should not replace the visible selection state.

## Responsive behavior

A table that cannot fit keeps its structure and scrolls horizontally inside its
own region. Do not collapse a table into an unrelated card layout unless the
data no longer needs column comparison.

## Principle

A table should make comparison easier. If the structure makes the data harder
to read, the table is the wrong form.
