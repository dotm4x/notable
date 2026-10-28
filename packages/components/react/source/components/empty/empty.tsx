import {
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import './empty.css';

/** Visual presentation of the empty state container. */
export type TEmptyVariant = 'default' | 'outline' | 'surface';

/** Density of the empty state container. */
export type TEmptySize = 'compact' | 'default' | 'spacious';

/** Media presentation. `icon` wraps an icon in a restrained container. */
export type TEmptyMediaVariant = 'default' | 'icon';

export type TEmptyRootProps = HTMLAttributes<HTMLDivElement> & {
  /** Content of the empty state, usually a header and content region. */
  children?: ReactNode;
  /** Visual presentation. Defaults to `default`, which is borderless. */
  variant?: TEmptyVariant;
  /** Density of the layout. Defaults to `default`. */
  size?: TEmptySize;
};

export type TEmptyHeaderProps = HTMLAttributes<HTMLDivElement> & {
  /** Media, title, and description. */
  children?: ReactNode;
};

export type TEmptyMediaProps = HTMLAttributes<HTMLDivElement> & {
  /** Icon or custom visual content, such as an illustration or avatar. */
  children?: ReactNode;
  /** Use `icon` for an icon inside a restrained container. */
  variant?: TEmptyMediaVariant;
};

export type TEmptyTitleProps = HTMLAttributes<HTMLElement> & {
  /** Title text. */
  children?: ReactNode;
  /** Heading element to render. Defaults to `h3`. */
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';
};

export type TEmptyDescriptionProps = HTMLAttributes<HTMLElement> & {
  /** Description content. Inline links are supported. */
  children?: ReactNode;
  /** Element to render. Defaults to `p`. Use `div` for block content. */
  as?: 'p' | 'div';
};

export type TEmptyContentProps = HTMLAttributes<HTMLDivElement> & {
  /** Actions or supplementary content. */
  children?: ReactNode;
};

/** Renders the root container of the empty state. Compound parts are attached below. */
const EmptyRoot = forwardRef<HTMLDivElement, TEmptyRootProps>(function Empty(
  { children, className, variant = 'default', size = 'default', ...props },
  ref,
) {
  const classes = [
    'notable-empty',
    variant !== 'default' && `notable-empty--variant-${variant}`,
    size !== 'default' && `notable-empty--size-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

/** Groups the media, title, and description of an empty state. */
const EmptyHeader = forwardRef<HTMLDivElement, TEmptyHeaderProps>(
  function EmptyHeader({ children, className, ...props }, ref) {
    const classes = ['notable-empty__header', className]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

/** Renders the visual above the title. Use `variant="icon"` for icons. */
const EmptyMedia = forwardRef<HTMLDivElement, TEmptyMediaProps>(
  function EmptyMedia(
    { children, className, variant = 'default', ...props },
    ref,
  ) {
    const classes = [
      'notable-empty__media',
      variant === 'icon' && 'notable-empty__media--variant-icon',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

/** Renders the title of an empty state. Defaults to an `h3` heading. */
const EmptyTitle = forwardRef<HTMLElement, TEmptyTitleProps>(
  function EmptyTitle(
    { as: Element = 'h3', children, className, ...props },
    ref,
  ) {
    const Component = Element as ElementType;
    const classes = ['notable-empty__title', className]
      .filter(Boolean)
      .join(' ');

    return (
      <Component ref={ref} className={classes} {...props}>
        {children}
      </Component>
    );
  },
);

/** Renders the muted description of an empty state. */
const EmptyDescription = forwardRef<HTMLElement, TEmptyDescriptionProps>(
  function EmptyDescription(
    { as: Element = 'p', children, className, ...props },
    ref,
  ) {
    const Component = Element as ElementType;
    const classes = ['notable-empty__description', className]
      .filter(Boolean)
      .join(' ');

    return (
      <Component ref={ref} className={classes} {...props}>
        {children}
      </Component>
    );
  },
);

/** Renders the actions and supplementary content of an empty state. */
const EmptyContent = forwardRef<HTMLDivElement, TEmptyContentProps>(
  function EmptyContent({ children, className, ...props }, ref) {
    const classes = ['notable-empty__content', className]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

/**
 * Renders a placeholder for a region without content. Compose it with
 * `Empty.Header`, `Empty.Media`, `Empty.Title`, `Empty.Description`, and
 * `Empty.Content`.
 */
export const Empty = Object.assign(EmptyRoot, {
  Header: EmptyHeader,
  Media: EmptyMedia,
  Title: EmptyTitle,
  Description: EmptyDescription,
  Content: EmptyContent,
});
