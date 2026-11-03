import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { ArrowRight } from '../../icons';
import './link.css';

/** Props for {@link Link}. Accepts all native anchor attributes. */
export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Shows a trailing arrow after the label. Defaults to `false`. */
  arrow?: boolean;
};

/**
 * Renders a native anchor with an animated underline and optional arrow. It
 * performs no routing; pass `href` and any other anchor attributes directly.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { arrow = false, className, children, ...props },
  ref,
) {
  const classes = ['one-link', arrow && 'one-link--arrow', className]
    .filter(Boolean)
    .join(' ');

  return (
    <a {...props} ref={ref} className={classes}>
      <span className="one-link__text">{children}</span>
      {arrow ? (
        <ArrowRight
          className="one-link__arrow"
          aria-hidden="true"
          focusable="false"
          size={16}
        />
      ) : null}
    </a>
  );
});
