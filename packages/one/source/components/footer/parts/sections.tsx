import { forwardRef, type ElementType } from 'react';
import type {
  FooterBottomProps,
  FooterBrandProps,
  FooterContentProps,
  FooterHeadingProps,
  FooterProps,
  FooterSectionProps,
} from '../types.js';

export const FooterRoot = forwardRef<HTMLElement, FooterProps>(
  function FooterRoot(
    { children, className, transparent = false, ...props },
    ref,
  ) {
    const classes = [
      'one-footer',
      transparent && 'one-footer--transparent',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <footer ref={ref} className={classes} {...props}>
        {children}
      </footer>
    );
  },
);

export const FooterContent = forwardRef<HTMLDivElement, FooterContentProps>(
  function FooterContent({ children, className, ...props }, ref) {
    const classes = ['one-footer__content', className]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

export const FooterBrand = forwardRef<HTMLDivElement, FooterBrandProps>(
  function FooterBrand({ children, className, ...props }, ref) {
    const classes = ['one-footer__brand', className].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

export const FooterSection = forwardRef<HTMLDivElement, FooterSectionProps>(
  function FooterSection({ children, className, ...props }, ref) {
    const classes = ['one-footer__section', className]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

export const FooterHeading = forwardRef<HTMLElement, FooterHeadingProps>(
  function FooterHeading(
    { as: Element = 'h2', children, className, ...props },
    ref,
  ) {
    const Component = Element as ElementType;
    const classes = ['one-footer__heading', className]
      .filter(Boolean)
      .join(' ');

    return (
      <Component ref={ref} className={classes} {...props}>
        {children}
      </Component>
    );
  },
);

export const FooterBottom = forwardRef<HTMLDivElement, FooterBottomProps>(
  function FooterBottom({ children, className, ...props }, ref) {
    const classes = ['one-footer__bottom', className].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);
