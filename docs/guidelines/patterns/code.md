# Code

Code is read as code, even when it appears inside a product interface. It keeps
its own type, direction, and selection behavior.

## Direction

Code always reads left to right, including on right-to-left pages. Only the
surrounding header and actions follow the page direction. Mixed direction
inside a line makes code harder to read and to copy.

## Type

Code uses the monospace family from the typography foundation. It does not use
the interface typeface, because alignment between characters carries meaning.
Code text is not smaller than the readable minimum for its context.

## Copying

A copy action copies the code, not its presentation. Line numbers, diff
markers, and other decoration stay out of the copied text. The action confirms
success in place and announces it politely; it does not open a toast for a
single copy.

## Structure

Headers name a file or a language. Long lines scroll by default; wrapping is an
explicit choice for output and error text. A code surface is focusable so it can
be scrolled from the keyboard.

## Diff and highlighted lines

A diff line carries a marker as well as a tint, so the change does not depend on
color alone. Highlighted lines call attention to a region without implying that
the code changed. Decoration must remain out of the selection.

## Principle

Code should be easy to read, easy to copy, and unchanged by the interface around
it.
