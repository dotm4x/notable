'use client';

import { Button, Header } from '@dotm4x/one/components';

const paragraphs = [
  'Scroll this page: the header stays pinned to the top of the viewport.',
  'Its content keeps the reading order of the document.',
  'The remaining space belongs to the page content below it.',
];

export default function Fixed() {
  return (
    <div style={{ inlineSize: '100%', minBlockSize: '110vh' }}>
      <Header mode="fixed">
        <strong>Acme Studio</strong>
        <Button variant="secondary">Sign in</Button>
      </Header>
      <div
        style={{
          display: 'grid',
          gap: 'var(--one-spacing-3)',
          padding: 'var(--one-spacing-5)',
        }}
      >
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
