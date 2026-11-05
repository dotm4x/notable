# Hierarchy

A hierarchy places destinations inside destinations. The user moves through
levels without losing the path back to the root.

## Disclosure, not selection

A branch that opens is not the same as a destination that is current. The
disclosure button changes what is visible; the current destination is the page
the user is on. Keep those states distinct.

A branch that also has its own page needs a separate destination for that page.
The docs sidebar uses a disclosure row and an **Overview** child for the section
index. Do not make the disclosure row navigate and toggle at the same time.

## Depth

Each level is indented and connected by the disclosure control. Deep trees are
harder to scan, so prefer shallow structures when the same content can be
organized as a flat list. Do not hide essential destinations behind more levels
than the content needs.

## Alignment

Rows at the same depth share the same start edge, whether they are branches or
leaves. When some siblings use icons, reserve the icon slot for the rest so
labels stay aligned. Keep the disclosure control at the end of the row so it
does not shift the label.

## The current destination

The current destination uses `aria-current="page"` and a persistent visual
marker. Opening an ancestor is automatic so the current page is always
reachable, but expanding a branch does not select it.

## Highlight

Hover and focus move a single highlight surface between rows instead of
painting each row independently. When the tree sits inside a surface that
already owns a highlight, such as the sidebar, the tree must not add a second
one.

## Keyboard

The tree is a single tab stop. Arrow keys move through visible rows; Right
opens a branch or enters its first child; Left closes a branch or returns to
its parent; Home and End jump to the first and last visible rows. Printable
characters search by label.

Keep focus on the row that was moved. Collapsing a branch keeps focus on its
disclosure button; it does not move focus into hidden content.

## Animation

Opening and closing follow the shared collapsible motion. Children may stagger
in, but the stagger must not delay access to the content. Under reduced motion,
the tree changes state without translation, blur, or staggered timing.

## Principle

A hierarchy should make the path visible. If the user cannot tell where they
are or how to get back, the structure is too deep or the state is unclear.
