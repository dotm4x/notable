'use client';

import { Button, Header } from '@dotm4x/one/components';

const paragraphs = [
  'Scroll up and down to see the header react to the direction of travel.',
  'Passing the top of the page floats the header away from the edge.',
  'Scrolling down hides it so more of the page stays readable.',
  'Scrolling up brings it back before the reader reaches the top.',
];

export default function Dynamic() {
  return (
    <div style={{ inlineSize: '100%', minBlockSize: '120vh' }}>
      <Header mode="dynamic">
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
