import type { HTMLAttributes, ReactNode } from 'react';

/** Tone of the callout, mapped to the semantic color tokens. */
export type TCalloutTone = 'info' | 'success' | 'warning' | 'danger';

/** Accessible role of the callout. Defaults to `note`. */
export type TCalloutRole = 'note' | 'alert' | 'status';

export type TCalloutProps = HTMLAttributes<HTMLDivElement> & {
  /** Semantic tone of the message. Defaults to `info`. */
  tone?: TCalloutTone;
  /** Accessible role. Use `alert` only for urgent, time-sensitive messages. */
  role?: TCalloutRole;
  children?: ReactNode;
};

export type TCalloutIconProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export type TCalloutContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export type TCalloutTitleProps = HTMLAttributes<HTMLElement> & {
  /** Element to render. Defaults to `p`. */
  as?: 'p' | 'div' | 'h2' | 'h3' | 'h4';
  children?: ReactNode;
};

export type TCalloutActionsProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};
