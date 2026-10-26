import {
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import './card.css';

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

/** Renders the card's root container. Compound parts are attached below. */
const CardRoot = forwardRef<HTMLElement, CardProps>(function Card(
  { as: Element = 'div', children, className, padding = 'default', ...props },
  ref,
) {
  const Component = Element as ElementType;
  const classes = [
    'notable-card',
    padding === 'none' && 'notable-card--padding-none',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component ref={ref} className={classes} {...props}>
      {children}
    </Component>
  );
});

/** Renders the header region of a card. */
const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ children, className, ...props }, ref) {
    const classes = ['notable-card__header', className]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

/** Renders the title of a card. Defaults to an `h3` heading. */
const CardTitle = forwardRef<HTMLElement, CardTitleProps>(function CardTitle(
  { as: Element = 'h3', children, className, ...props },
  ref,
) {
  const Component = Element as ElementType;
  const classes = ['notable-card__title', className].filter(Boolean).join(' ');

  return (
    <Component ref={ref} className={classes} {...props}>
      {children}
    </Component>
  );
});

/** Renders the muted description text of a card. */
const CardDescription = forwardRef<HTMLElement, CardDescriptionProps>(
  function CardDescription(
    { as: Element = 'p', children, className, ...props },
    ref,
  ) {
    const Component = Element as ElementType;
    const classes = ['notable-card__description', className]
      .filter(Boolean)
      .join(' ');

    return (
      <Component ref={ref} className={classes} {...props}>
        {children}
      </Component>
    );
  },
);

/** Renders the main content region of a card. */
const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  function CardContent({ children, className, ...props }, ref) {
    const classes = ['notable-card__content', className]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

/** Renders the footer region of a card, typically for actions. */
const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({ children, className, ...props }, ref) {
    const classes = ['notable-card__footer', className]
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
 * Renders a non-interactive surface that groups related content. Compose it
 * with `Card.Header`, `Card.Title`, `Card.Description`, `Card.Content`, and
 * `Card.Footer`.
 */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});
