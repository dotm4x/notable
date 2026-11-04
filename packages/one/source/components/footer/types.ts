import type { HTMLAttributes, ReactNode } from 'react';

/** Props for {@link Footer}, in addition to native `footer` attributes. */
export type FooterProps = HTMLAttributes<HTMLElement> & {
  /** Renders the footer without a background. Defaults to `false`. */
  transparent?: boolean;
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
