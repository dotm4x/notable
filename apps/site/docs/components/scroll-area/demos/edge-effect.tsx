'use client';

import { ScrollArea } from '@dotm4x/one/components';

const paragraphs = [
  'Scroll areas keep dense content contained while preserving native keyboard scrolling.',
  'The region uses native overflow, so trackpad, touch, and wheel scrolling remain available.',
  'Edge effects only appear on sides that still have hidden content.',
  'Long text wraps to the width of the container and recalculates as the parent resizes.',
  'Focusing a control inside the region scrolls it into view automatically.',
];

export default function EdgeEffect() {
  return (
    <ScrollArea
      aria-label="Notes"
      edgeEffect="blur"
      scrollbar="auto"
      style={{ height: '14rem', width: '22rem' }}
    >
      <div
        style={{
          display: 'grid',
          gap: 'var(--one-spacing-3)',
          padding: 'var(--one-spacing-3)',
        }}
      >
        {paragraphs.map((paragraph) => (
          <p key={paragraph} style={{ margin: 0 }}>
            {paragraph}
          </p>
        ))}
      </div>
    </ScrollArea>
  );
}
