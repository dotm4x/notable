import { forwardRef, type HTMLAttributes } from 'react';
import './shortcut.css';

/** Props for {@link Shortcut}, in addition to native `kbd` attributes. */
export type ShortcutProps = HTMLAttributes<HTMLElement>;

/**
 * Renders a single keyboard key. Compose multiple `Shortcut` elements to show
 * a keyboard shortcut.
 */
export const Shortcut = forwardRef<HTMLElement, ShortcutProps>(
  function Shortcut({ className, ...props }, ref) {
    const classes = ['notable-shortcut', className].filter(Boolean).join(' ');

    return <kbd {...props} ref={ref} className={classes} />;
  },
);
