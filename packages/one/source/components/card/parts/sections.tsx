import { forwardRef, type ElementType } from 'react';
import type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
} from '../types.js';

export const CardRoot = forwardRef<HTMLElement, CardProps>(function CardRoot(
  { as: Element = 'div', children, className, padding = 'default', ...props },
  ref,
) {
  const Component = Element as ElementType;
  const classes = [
    'one-card',
    padding === 'none' && 'one-card--padding-none',
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

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ children, className, ...props }, ref) {
    const classes = ['one-card__header', className].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

export const CardTitle = forwardRef<HTMLElement, CardTitleProps>(
  function CardTitle(
    { as: Element = 'h3', children, className, ...props },
    ref,
  ) {
    const Component = Element as ElementType;
    const classes = ['one-card__title', className].filter(Boolean).join(' ');

    return (
      <Component ref={ref} className={classes} {...props}>
        {children}
      </Component>
    );
  },
);

export const CardDescription = forwardRef<HTMLElement, CardDescriptionProps>(
  function CardDescription(
    { as: Element = 'p', children, className, ...props },
    ref,
  ) {
    const Component = Element as ElementType;
    const classes = ['one-card__description', className]
      .filter(Boolean)
      .join(' ');

    return (
      <Component ref={ref} className={classes} {...props}>
        {children}
      </Component>
    );
  },
);

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  function CardContent({ children, className, ...props }, ref) {
    const classes = ['one-card__content', className].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({ children, className, ...props }, ref) {
    const classes = ['one-card__footer', className].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);
