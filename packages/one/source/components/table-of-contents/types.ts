import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

/** Supported placement of the table of contents relative to its content. */
export type TableOfContentsSide = 'left' | 'right';

/** Props for the navigation landmark rendered by {@link TableOfContents.Root}. */
export type TableOfContentsRootProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  /** Side on which the table of contents is placed. Defaults to `left`. */
  side?: TableOfContentsSide;
};

/** Props for `TableOfContents.Header`, rendered as a level-two heading. */
export type TableOfContentsHeaderProps = HTMLAttributes<HTMLHeadingElement>;

/** Props for `TableOfContents.List`, rendered as a list of items. */
export type TableOfContentsListProps = HTMLAttributes<HTMLUListElement>;

/** Props for `TableOfContents.Item`, including its link label and nested list. */
export type TableOfContentsItemProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'href'
> & {
  /** Fragment URL of the section this item links to. */
  href: string;
  /** Visible label for the section link. */
  label: ReactNode;
  /** Optional nested `TableOfContents.List`. */
  children?: ReactNode;
};
