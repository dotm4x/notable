'use client';

import { ScrollArea } from '@dotm4x/one/components';

const members = [
  { name: 'Ada Lovelace', role: 'Engineering' },
  { name: 'Grace Hopper', role: 'Platform' },
  { name: 'Alan Turing', role: 'Research' },
  { name: 'Katherine Johnson', role: 'Design' },
  { name: 'Barbara Liskov', role: 'Engineering' },
  { name: 'Frances Allen', role: 'Support' },
];

export default function Horizontal() {
  return (
    <ScrollArea
      aria-label="Team members"
      orientation="horizontal"
      scrollbar="horizontal"
      style={{ width: '20rem' }}
    >
      <ul
        style={{
          display: 'flex',
          gap: 'var(--one-spacing-3)',
          listStyle: 'none',
          margin: 0,
          padding: 'var(--one-spacing-3)',
        }}
      >
        {members.map((member) => (
          <li
            key={member.name}
            style={{
              background: 'var(--one-color-background)',
              borderRadius: 'var(--one-radius-md)',
              minWidth: '10rem',
              padding: 'var(--one-spacing-3)',
            }}
          >
            <strong>{member.name}</strong>
            <p style={{ color: 'var(--one-color-text-muted)', margin: 0 }}>
              {member.role}
            </p>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
