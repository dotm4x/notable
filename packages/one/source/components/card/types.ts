import type { HTMLAttributes, ReactNode } from 'react';

/** Padding applied to the card's root container. */
export type CardPadding = 'default' | 'none';

/** Props for {@link Card}, in addition to native `div` attributes. */
export type CardProps = HTMLAttributes<HTMLElement> & {
  /** Content of the card. */
  children?: ReactNode;
  /** Semantic element to render. Defaults to `div`. */
  as?: 'div' | 'section' | 'article';
  /**
   * Inner padding. Use `none` when content, such as a ScrollArea, should
   * sit flush with the card edges.
   */
  padding?: CardPadding;
};

/** Props for {@link CardHeader}, in addition to native `div` attributes. */
export type CardHeaderProps = HTMLAttributes<HTMLDivElement> & {
  /** Header content, usually a title and description. */
  children?: ReactNode;
};

/** Props for {@link CardTitle}, in addition to native heading attributes. */
export type CardTitleProps = HTMLAttributes<HTMLElement> & {
  /** Title text. */
  children?: ReactNode;
  /** Element to render. Defaults to `h3`. */
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';
};

/** Props for {@link CardDescription}, in addition to native attributes. */
export type CardDescriptionProps = HTMLAttributes<HTMLElement> & {
  /** Description text. */
  children?: ReactNode;
  /** Element to render. Defaults to `p`. */
  as?: 'p' | 'div';
};

/** Props for {@link CardContent}, in addition to native `div` attributes. */
export type CardContentProps = HTMLAttributes<HTMLDivElement> & {
  /** Main content of the card. */
  children?: ReactNode;
};

/** Props for {@link CardFooter}, in addition to native `div` attributes. */
export type CardFooterProps = HTMLAttributes<HTMLDivElement> & {
  /** Footer content, usually actions. */
  children?: ReactNode;
};
