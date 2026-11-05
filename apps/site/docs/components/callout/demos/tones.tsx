'use client';

import { Callout } from '@dotm4x/one/components';
import { CheckCircle, CircleX, Info, TriangleAlert } from '@dotm4x/one/icons';

const tones = [
  { tone: 'info', title: 'Information', icon: <Info aria-hidden="true" /> },
  {
    tone: 'success',
    title: 'Changes saved',
    icon: <CheckCircle aria-hidden="true" />,
  },
  {
    tone: 'warning',
    title: 'Review required',
    icon: <TriangleAlert aria-hidden="true" />,
  },
  {
    tone: 'danger',
    title: 'Something went wrong',
    icon: <CircleX aria-hidden="true" />,
  },
] as const;

export default function Tones() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%' }}>
      {tones.map(({ tone, title, icon }) => (
        <Callout key={tone} tone={tone}>
          <Callout.Icon>{icon}</Callout.Icon>
          <Callout.Content>
            <Callout.Title>{title}</Callout.Title>
            <p>This message uses the {tone} tone.</p>
          </Callout.Content>
        </Callout>
      ))}
    </div>
  );
}
