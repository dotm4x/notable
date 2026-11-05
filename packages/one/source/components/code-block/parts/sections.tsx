'use client';

import { forwardRef, type ElementType } from 'react';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import { CopyButton } from '../../copy-button/copy-button.js';
import type {
  TCodeBlockActionsProps,
  TCodeBlockContentProps,
  TCodeBlockCopyButtonProps,
  TCodeBlockFooterProps,
  TCodeBlockHeaderProps,
  TCodeBlockLineProps,
  TCodeBlockProps,
  TCodeBlockTitleProps,
} from '../types.js';

export const CodeBlockRoot = forwardRef<HTMLDivElement, TCodeBlockProps>(
  function CodeBlockRoot(
    { children, className, size = 'default', variant = 'default', ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={joinClassNames(
          'one-code-block',
          variant !== 'default' && `one-code-block--${variant}`,
          size !== 'default' && `one-code-block--${size}`,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

export const CodeBlockHeader = forwardRef<
  HTMLDivElement,
  TCodeBlockHeaderProps
>(function CodeBlockHeader({ children, className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={joinClassNames('one-code-block__header', className)}
      {...props}
    >
      {children}
    </div>
  );
});

export const CodeBlockTitle = forwardRef<HTMLElement, TCodeBlockTitleProps>(
  function CodeBlockTitle(
    { as: Element = 'div', children, className, ...props },
    ref,
  ) {
    const Component = Element as ElementType;

    return (
      <Component
        ref={ref}
        className={joinClassNames('one-code-block__title', className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

export const CodeBlockActions = forwardRef<
  HTMLDivElement,
  TCodeBlockActionsProps
>(function CodeBlockActions({ children, className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={joinClassNames('one-code-block__actions', className)}
      {...props}
    >
      {children}
    </div>
  );
});

/** A compact, icon-only copy action sized for a code block. */
export function CodeBlockCopyButton({
  showLabel = false,
  size = 'small',
  variant = 'ghost',
  ...props
}: TCodeBlockCopyButtonProps) {
  return (
    <CopyButton
      showLabel={showLabel}
      size={size}
      variant={variant}
      {...props}
    />
  );
}

export const CodeBlockContent = forwardRef<
  HTMLPreElement,
  TCodeBlockContentProps
>(function CodeBlockContent(
  {
    children,
    className,
    lineNumbers = false,
    startLine = 1,
    tabIndex = 0,
    wrap = false,
    ...props
  },
  ref,
) {
  const lines =
    typeof children === 'string'
      ? children.replace(/\n$/, '').split('\n')
      : null;

  return (
    <pre
      {...props}
      ref={ref}
      dir="ltr"
      tabIndex={tabIndex}
      className={joinClassNames('one-code-block__pre', className)}
    >
      <code
        className={joinClassNames(
          'one-code-block__code',
          wrap && 'one-code-block__code--wrap',
        )}
      >
        {lines
          ? lines.map((line, index) => (
              <span className="one-code-block__line" key={index}>
                {lineNumbers ? (
                  <span
                    aria-hidden="true"
                    className="one-code-block__line-number"
                  >
                    {startLine + index}
                  </span>
                ) : null}
                <span className="one-code-block__line-content">{line}</span>
              </span>
            ))
          : children}
      </code>
    </pre>
  );
});

export const CodeBlockLine = forwardRef<HTMLSpanElement, TCodeBlockLineProps>(
  function CodeBlockLine(
    { children, className, variant = 'default', ...props },
    ref,
  ) {
    return (
      <span
        ref={ref}
        data-variant={variant !== 'default' ? variant : undefined}
        className={joinClassNames('one-code-block__line', className)}
        {...props}
      >
        <span className="one-code-block__line-content">{children}</span>
      </span>
    );
  },
);

export const CodeBlockFooter = forwardRef<
  HTMLDivElement,
  TCodeBlockFooterProps
>(function CodeBlockFooter({ children, className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={joinClassNames('one-code-block__footer', className)}
      {...props}
    >
      {children}
    </div>
  );
});
