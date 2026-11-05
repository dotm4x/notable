# Messages

Inline messages explain something that belongs to the content around them.
They are persistent until the condition changes, unlike a toast, which is
transient feedback about an action.

## Tones

- **Info** adds context without implying a problem.
- **Success** confirms a completed change that matters beyond the action itself.
- **Warning** describes a risk that the user can still address.
- **Danger** describes a failure, a loss, or a blocked path.

Tone is semantic, not decorative. Do not use danger for emphasis, and do not use
success for a neutral status.

## Role and urgency

An inline message is a note by default. Use `alert` only when the message must
interrupt assistive technology immediately, such as a connection loss during a
task. A status message that can wait uses `status` or the default note.

## Content

A message has one purpose. A title is short and optional; the body explains the
condition and what the user can do. Actions sit with the message and follow the
same hierarchy as the rest of the interface. Do not put a second, unrelated
message inside the same callout.

## Relationship to other feedback

Use a toast for transient confirmation after an action. Use a callout when the
message must remain visible next to the content it describes. Use an empty
state when the message explains the absence of content rather than a condition
within it.

## Principle

A message should be noticed in proportion to what it asks the user to do.
