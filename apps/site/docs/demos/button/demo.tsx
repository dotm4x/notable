'use client';

import {
  ButtonDisabledDemo,
  ButtonIconsDemo,
  ButtonLoadingDemo,
  ButtonLongTextDemo,
  ButtonSizesDemo,
  ButtonVariantsDemo,
  ButtonWithIconDemo,
} from './index';

const demos = [
  {
    title: 'Variants',
    description: 'Available visual variants for different intent levels.',
    Component: ButtonVariantsDemo,
  },
  {
    title: 'Sizes',
    description: 'Available sizes for different contexts.',
    Component: ButtonSizesDemo,
  },
  {
    title: 'With Icon',
    description: 'Button with leading icon and label.',
    Component: ButtonWithIconDemo,
  },
  {
    title: 'Icons',
    description: 'Icon-only buttons for compact actions.',
    Component: ButtonIconsDemo,
  },
  {
    title: 'Loading',
    description: 'Disabled buttons showing progress.',
    Component: ButtonLoadingDemo,
  },
  {
    title: 'Disabled',
    description: 'Non-interactive disabled buttons.',
    Component: ButtonDisabledDemo,
  },
  {
    title: 'Long Text',
    description: 'Buttons adapt width to longer labels.',
    Component: ButtonLongTextDemo,
  },
];

export function ButtonDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {demos.map(({ title, description, Component }) => (
        <section key={title}>
          <h3 style={{ margin: '0 0 4px' }}>{title}</h3>
          <p
            style={{
              margin: '0 0 8px',
              color: 'var(--muted-foreground, #666)',
            }}
          >
            {description}
          </p>
          <Component />
        </section>
      ))}
    </div>
  );
}
