'use client';

import { ScrollArea } from '@dotm4x/one/components';

const activity = [
  'Ada Lovelace commented on the release notes.',
  'Grace Hopper merged the navigation refactor.',
  'Alan Turing requested changes to the API proposal.',
  'Katherine Johnson published the design tokens.',
  'Margaret Hamilton reopened the onboarding issue.',
  'Barbara Liskov approved the migration plan.',
  'Edsger Dijkstra added a regression test.',
  'Frances Allen updated the accessibility audit.',
];

export default function Default() {
  return (
    <ScrollArea
      aria-label="Recent activity"
      scrollbar="vertical"
      style={{ height: '16rem', width: '20rem' }}
    >
      <ul
        style={{
          display: 'grid',
          gap: 'var(--one-spacing-2)',
          listStyle: 'none',
          margin: 0,
          padding: 'var(--one-spacing-3)',
        }}
      >
        {activity.map((entry) => (
          <li
            key={entry}
            style={{
              background: 'var(--one-color-background)',
              borderRadius: 'var(--one-radius-md)',
              padding: 'var(--one-spacing-2) var(--one-spacing-3)',
            }}
          >
            {entry}
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
