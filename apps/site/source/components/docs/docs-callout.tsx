'use client';

import { Callout as OneCallout } from '@dotm4x/one/components';
import type { ReactNode } from 'react';

export interface DocsCalloutProps {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  title?: ReactNode;
  children: ReactNode;
}

/** Client adapter that binds the docs MDX API to the package Callout. */
export function DocsCallout({
  tone = 'info',
  title,
  children,
}: DocsCalloutProps) {
  return (
    <OneCallout tone={tone}>
      <OneCallout.Content>
        {title ? <OneCallout.Title>{title}</OneCallout.Title> : null}
        {children}
      </OneCallout.Content>
    </OneCallout>
  );
}
