import {
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import './footer.css';

/** Props for {@link Footer}, in addition to native `footer` attributes. */
export type FooterProps = HTMLAttributes<HTMLElement> & {
  /** Footer content, usually `Footer.Content` and `Footer.Bottom`. */
  children?: ReactNode;
};

/** Props for {@link FooterContent}, in addition to native `div` attributes. */
export type FooterContentProps = HTMLAttributes<HTMLDivElement> & {
  /** Brand and navigation regions. */
  children?: ReactNode;
};

/** Props for {@link FooterBrand}, in addition to native `div` attributes. */
export type FooterBrandProps = HTMLAttributes<HTMLDivElement> & {
  /** Logo, name, description, or any other brand content. */
  children?: ReactNode;
};

/** Props for {@link FooterSection}, in addition to native `div` attributes. */
export type FooterSectionProps = HTMLAttributes<HTMLDivElement> & {
  /** Heading and links of a navigation group. */
  children?: ReactNode;
};

/** Props for {@link FooterHeading}, in addition to native heading attributes. */
export type FooterHeadingProps = HTMLAttributes<HTMLElement> & {
  /** Heading text. */
  children?: ReactNode;
  /**
   * Element to render. Defaults to `h2`. Choose the level that fits the
   * page outline.
   */
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';
};

/** Props for {@link FooterBottom}, in addition to native `div` attributes. */
export type FooterBottomProps = HTMLAttributes<HTMLDivElement> & {
  /** Copyright text, legal links, or other closing content. */
  children?: ReactNode;
};

/**
 * Renders the root `footer` element. Compose it with `Footer.Content` and
 * `Footer.Bottom`.
 */
const FooterRoot = forwardRef<HTMLElement, FooterProps>(function Footer(
  { children, className, ...props },
  ref,
) {
  const classes = ['notable-footer', className].filter(Boolean).join(' ');

  return (
    <footer ref={ref} className={classes} {...props}>
      {children}
    </footer>
  );
});

const FooterContent = forwardRef<HTMLDivElement, FooterContentProps>(
  function FooterContent({ children, className, ...props }, ref) {
    const classes = ['notable-footer__content', className]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

const FooterBrand = forwardRef<HTMLDivElement, FooterBrandProps>(
  function FooterBrand({ children, className, ...props }, ref) {
    const classes = ['notable-footer__brand', className]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

const FooterSection = forwardRef<HTMLDivElement, FooterSectionProps>(
  function FooterSection({ children, className, ...props }, ref) {
    const classes = ['notable-footer__section', className]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

const FooterHeading = forwardRef<HTMLElement, FooterHeadingProps>(
  function FooterHeading(
    { as: Element = 'h2', children, className, ...props },
    ref,
  ) {
    const Component = Element as ElementType;
    const classes = ['notable-footer__heading', className]
      .filter(Boolean)
      .join(' ');

    return (
      <Component ref={ref} className={classes} {...props}>
        {children}
      </Component>
    );
  },
);

const FooterBottom = forwardRef<HTMLDivElement, FooterBottomProps>(
  function FooterBottom({ children, className, ...props }, ref) {
    const classes = ['notable-footer__bottom', className]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

export interface FooterComponent extends React.ForwardRefExoticComponent<
  FooterProps & React.RefAttributes<HTMLElement>
> {
  /** Renders the grid holding brand and navigation sections. */
  Content: typeof FooterContent;
  /** Renders the brand region spanning the full width of the footer. */
  Brand: typeof FooterBrand;
  /** Renders a navigation group section. */
  Section: typeof FooterSection;
  /** Renders the title of a footer section. */
  Heading: typeof FooterHeading;
  /** Renders the closing row (copyright, legal links). */
  Bottom: typeof FooterBottom;
}

/**
 * Renders a page footer. Layout and content come entirely from children, so
 * no brand, links, or column count are assumed. Use `Link` for links inside
 * the footer.
 */
export const Footer: FooterComponent = Object.assign(FooterRoot, {
  Content: FooterContent,
  Brand: FooterBrand,
  Section: FooterSection,
  Heading: FooterHeading,
  Bottom: FooterBottom,
});
