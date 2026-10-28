import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Button } from '../button/button.js';
import { Card } from '../card/card.js';
import { Dialog } from '../dialog/dialog.js';
import { Input } from '../input/input.js';
import { Separator } from '../separator/separator.js';
import { Switch } from '../switch/switch.js';
import { ScrollArea, type ScrollAreaEdgeEffect } from './scroll-area.js';

const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  args: {
    scrollbar: 'none',
    style: { height: '16rem', width: '20rem' },
  },
  argTypes: {
    scrollbar: {
      control: 'select',
      options: [
        'none',
        'vertical',
        'horizontal',
        'both',
        'auto',
        'visible',
        'hidden',
      ],
    },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;

type Story = StoryObj<typeof meta>;

const listStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--notable-spacing-2)',
  listStyle: 'none',
  margin: 0,
  padding: 'var(--notable-spacing-3)',
};

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--notable-spacing-3)',
  padding: 'var(--notable-spacing-2) var(--notable-spacing-3)',
  borderRadius: 'var(--notable-radius-md)',
  background: 'var(--notable-color-background)',
};

const mutedTextStyle: CSSProperties = {
  color: 'var(--notable-color-text-muted)',
  fontSize: '0.875rem',
};

const contacts = [
  'Ana Torres',
  'Bruno Silva',
  'Carla Mendes',
  'Diego Ruiz',
  'Elena Costa',
  'Fernando Lopez',
  'Gabriela Rojas',
  'Hugo Martin',
  'Irene Vega',
  'Javier Ortiz',
  'Karen Mora',
  'Luis Herrera',
  'Marta Gil',
  'Nicolas Paz',
  'Olivia Sanz',
  'Pablo Ramos',
  'Quiroga Lara',
  'Rosa Navarro',
  'Sergio Dominguez',
  'Teresa Molina',
];

const projectFiles = [
  'README.md',
  'package.json',
  'tsconfig.json',
  'src/index.ts',
  'src/components/button/button.tsx',
  'src/components/dialog/dialog.tsx',
  'src/components/scroll-area/scroll-area.tsx',
  'src/styles/tokens/colors.css',
  'src/styles/tokens/spacing.css',
  'src/styles/tokens/motion.css',
  'docs/getting-started.md',
  'docs/theming.md',
  'docs/accessibility.md',
];

const paragraphs = [
  'Scroll areas keep dense content contained inside a fixed region while preserving native keyboard scrolling. The viewport is the focusable element, so arrow keys, Page Up, and Page Down continue to work without extra handling.',
  'The region uses native scrolling, while Notable hides scrollbar visuals. Trackpad, keyboard, touch, and wheel scrolling remain available.',
  'When the content is shorter than the region, no edge indicator is shown. Edge fades only appear on sides that still have hidden content.',
  'Long text wraps to the width of the container. Resizing the parent recalculates overflow and updates the edge indicators.',
  'Nested controls such as buttons, switches, and inputs remain fully interactive inside the scrolling region. Scrolling starts from pointer movement over the content, but focusing a control scrolls it into view automatically.',
];

function ContactList() {
  return (
    <ul style={listStyle}>
      {contacts.map((contact) => (
        <li key={contact} style={rowStyle}>
          <span>{contact}</span>
          <span style={mutedTextStyle}>Online</span>
        </li>
      ))}
    </ul>
  );
}

export const Default: Story = {
  render: (args) => (
    <Card padding="none">
      <ScrollArea {...args}>
        <ContactList />
      </ScrollArea>
    </Card>
  ),
};

export const VerticalScrollbar: Story = {
  args: {
    orientation: 'vertical',
    scrollbar: 'vertical',
    style: { height: '12rem', width: '16rem' },
  },
  render: (args) => (
    <Card padding="none" data-theme="light">
      <ScrollArea {...args}>
        <ContactList />
      </ScrollArea>
    </Card>
  ),
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    scrollbar: 'horizontal',
    style: { width: '24rem' },
  },
  render: (args) => (
    <Card padding="none">
      <ScrollArea {...args}>
        <div
          style={{
            display: 'flex',
            gap: 'var(--notable-spacing-3)',
            padding: 'var(--notable-spacing-3)',
          }}
        >
          {[
            'Kyoto',
            'Lisbon',
            'Oaxaca',
            'Reykjavik',
            'Hanoi',
            'Cusco',
            'Porto',
            'Marrakesh',
          ].map((city) => (
            <div
              key={city}
              style={{
                ...rowStyle,
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                width: '9rem',
                height: '6rem',
                flexShrink: 0,
              }}
            >
              <strong>{city}</strong>
              <span style={mutedTextStyle}>Saved trip</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  ),
};

export const Bidirectional: Story = {
  args: {
    orientation: 'both',
    scrollbar: 'both',
    style: { height: '16rem', width: '24rem' },
  },
  render: (args) => (
    <Card padding="none">
      <ScrollArea {...args}>
        <table
          style={{
            borderCollapse: 'collapse',
            width: '60rem',
            fontSize: '0.875rem',
          }}
        >
          <thead>
            <tr>
              {[
                'Week',
                'Revenue',
                'Refunds',
                'Net',
                'Orders',
                'Returning',
                'New',
                'Region',
                'Channel',
                'Notes',
              ].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  style={{
                    padding:
                      'var(--notable-spacing-2) var(--notable-spacing-3)',
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 24 }, (_, index) => (
              <tr
                key={index}
                style={{ borderTop: '1px solid var(--notable-color-border)' }}
              >
                <td
                  style={{
                    padding:
                      'var(--notable-spacing-2) var(--notable-spacing-3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Week {index + 1}
                </td>
                <td
                  style={{
                    padding:
                      'var(--notable-spacing-2) var(--notable-spacing-3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ${(12000 + index * 830).toLocaleString('en-US')}
                </td>
                <td
                  style={{
                    padding:
                      'var(--notable-spacing-2) var(--notable-spacing-3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ${(120 + index * 14).toLocaleString('en-US')}
                </td>
                <td
                  style={{
                    padding:
                      'var(--notable-spacing-2) var(--notable-spacing-3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ${(11880 + index * 816).toLocaleString('en-US')}
                </td>
                <td
                  style={{
                    padding:
                      'var(--notable-spacing-2) var(--notable-spacing-3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {340 + index * 9}
                </td>
                <td
                  style={{
                    padding:
                      'var(--notable-spacing-2) var(--notable-spacing-3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {70 + (index % 5) * 3}%
                </td>
                <td
                  style={{
                    padding:
                      'var(--notable-spacing-2) var(--notable-spacing-3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {index % 3 === 0
                    ? 'EMEA'
                    : index % 3 === 1
                      ? 'Americas'
                      : 'APAC'}
                </td>
                <td
                  style={{
                    padding:
                      'var(--notable-spacing-2) var(--notable-spacing-3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {index % 2 === 0 ? 'Web' : 'Mobile'}
                </td>
                <td
                  style={{
                    padding:
                      'var(--notable-spacing-2) var(--notable-spacing-3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Reviewed on Monday
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </Card>
  ),
};

export const LongListAndText: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--notable-spacing-4)' }}>
      <Card padding="none">
        <ScrollArea {...args}>
          <ContactList />
        </ScrollArea>
      </Card>
      <Card padding="none">
        <ScrollArea {...args} style={{ height: '12rem', width: '20rem' }}>
          <div
            style={{
              display: 'grid',
              gap: 'var(--notable-spacing-3)',
              padding: 'var(--notable-spacing-3)',
            }}
          >
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                style={{ margin: 0, lineHeight: 1.6 }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  ),
};

export const NestedInteractiveContent: Story = {
  render: (args) => (
    <Card padding="none">
      <ScrollArea {...args} style={{ height: '18rem', width: '22rem' }}>
        <ul style={listStyle}>
          {projectFiles.map((file) => (
            <li key={file} style={rowStyle}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                {file}
              </span>
              <Button size="small" variant="secondary">
                Open
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </Card>
  ),
};

export const EdgeFadeEnabledAndDisabled: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--notable-spacing-4)',
      }}
    >
      {[false, true].map((fadeEdges) => (
        <div
          key={String(fadeEdges)}
          style={{ display: 'grid', gap: 'var(--notable-spacing-2)' }}
        >
          <span style={mutedTextStyle}>
            {fadeEdges ? 'fadeEdges' : 'No fade'}
          </span>
          <Card padding="none">
            <ScrollArea
              fadeEdges={fadeEdges}
              style={{ height: '12rem', width: '16rem' }}
            >
              <ContactList />
            </ScrollArea>
          </Card>
        </div>
      ))}
    </div>
  ),
};

function ThemedScrollArea({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <Card
      data-theme={theme}
      style={{
        background: 'var(--notable-color-background)',
        padding: 'var(--notable-spacing-3)',
      }}
    >
      <ScrollArea
        fadeEdges
        scrollbar="vertical"
        style={{ height: '12rem', width: '16rem' }}
      >
        <ContactList />
      </ScrollArea>
    </Card>
  );
}

export const LightAndDark: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--notable-spacing-4)',
      }}
    >
      <ThemedScrollArea theme="light" />
      <ThemedScrollArea theme="dark" />
    </div>
  ),
};

export const ShortContent: Story = {
  render: (args) => (
    <Card padding="none">
      <ScrollArea
        {...args}
        orientation="both"
        scrollbar="both"
        fadeEdges
        style={{ height: '12rem', width: '20rem' }}
      >
        <div style={{ padding: 'var(--notable-spacing-3)' }}>
          <p style={{ margin: 0 }}>
            This content fits inside the region, so no overflow edge indicator
            appears.
          </p>
        </div>
      </ScrollArea>
    </Card>
  ),
};

function DynamicNotifications() {
  const [notifications, setNotifications] = useState([
    'Build finished',
    'Deploy queued',
  ]);

  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--notable-spacing-3)',
        justifyItems: 'start',
      }}
    >
      <Button
        size="small"
        onClick={() =>
          setNotifications((current) => [
            `Event ${current.length + 1} received`,
            ...current,
          ])
        }
      >
        Add notification
      </Button>
      <Card padding="none">
        <ScrollArea
          fadeEdges
          scrollbar="vertical"
          style={{ height: '12rem', width: '20rem' }}
        >
          <ul style={listStyle}>
            {notifications.map((notification, index) => (
              <li
                key={`${notification}-${notifications.length - index}`}
                style={rowStyle}
              >
                {notification}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </Card>
    </div>
  );
}

export const DynamicContent: Story = {
  render: () => <DynamicNotifications />,
};

export const SettingsPanel: Story = {
  render: (args) => (
    <Card padding="none">
      <ScrollArea {...args} style={{ height: '20rem', width: '22rem' }}>
        <div
          style={{
            display: 'grid',
            gap: 'var(--notable-spacing-4)',
            padding: 'var(--notable-spacing-4)',
          }}
        >
          <section style={{ display: 'grid', gap: 'var(--notable-spacing-3)' }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Profile</h3>
            <Input aria-label="Display name" defaultValue="Ana Torres" />
            <Input
              aria-label="Email"
              type="email"
              defaultValue="ana@example.com"
            />
          </section>
          <Separator />
          <section style={{ display: 'grid', gap: 'var(--notable-spacing-3)' }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Notifications</h3>
            <Switch label="Email digests" defaultChecked />
            <Switch label="Mentions" defaultChecked />
            <Switch label="Product updates" />
          </section>
          <Separator />
          <section style={{ display: 'grid', gap: 'var(--notable-spacing-3)' }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Privacy</h3>
            <Switch label="Show online status" defaultChecked />
            <Switch label="Share usage data" />
            <Switch label="Personalized suggestions" defaultChecked />
          </section>
        </div>
      </ScrollArea>
    </Card>
  ),
};

export const DialogLayout: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>
        <Button>Open release notes</Button>
      </Dialog.Trigger>
      <Dialog.Content size="medium">
        <Dialog.Header>
          <Dialog.Title>Release notes</Dialog.Title>
          <Dialog.Description>
            Changes included in version 2.4.0.
          </Dialog.Description>
        </Dialog.Header>
        <ScrollArea fadeEdges style={{ maxHeight: '40vh' }}>
          <div
            style={{
              display: 'grid',
              gap: 'var(--notable-spacing-3)',
              paddingBlock: 'var(--notable-spacing-1)',
            }}
          >
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                style={{ margin: 0, lineHeight: 1.6 }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </ScrollArea>
        <Dialog.Footer>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
};

export const FadeVisualization: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--notable-spacing-4)' }}>
      {['1.5rem', '3rem'].map((fadeSize) => (
        <div
          key={fadeSize}
          style={{ display: 'grid', gap: 'var(--notable-spacing-2)' }}
        >
          <span style={mutedTextStyle}>fadeSize=&quot;{fadeSize}&quot;</span>
          <Card padding="none">
            <ScrollArea
              orientation="horizontal"
              fadeEdges
              fadeSize={fadeSize}
              style={{ width: '24rem' }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--notable-spacing-3)',
                  padding: 'var(--notable-spacing-3)',
                }}
              >
                {Array.from({ length: 12 }, (_, index) => (
                  <div
                    key={index}
                    style={{
                      width: '6rem',
                      height: '4rem',
                      flexShrink: 0,
                      borderRadius: 'var(--notable-radius-md)',
                      background: 'var(--notable-color-border-strong)',
                    }}
                  />
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      ))}
    </div>
  ),
};

const edgeEffects: ScrollAreaEdgeEffect[] = ['none', 'fade', 'blur'];

function EdgeEffectSample({
  edgeEffect,
  orientation,
}: {
  edgeEffect: ScrollAreaEdgeEffect;
  orientation: 'vertical' | 'horizontal';
}) {
  return (
    <Card padding="none">
      <ScrollArea
        orientation={orientation}
        edgeEffect={edgeEffect}
        style={
          orientation === 'vertical'
            ? { height: '12rem', width: '16rem' }
            : { width: '20rem' }
        }
      >
        {orientation === 'vertical' ? (
          <ContactList />
        ) : (
          <div
            style={{
              display: 'flex',
              gap: 'var(--notable-spacing-3)',
              padding: 'var(--notable-spacing-3)',
            }}
          >
            {Array.from({ length: 12 }, (_, index) => (
              <div
                key={index}
                style={{
                  width: '6rem',
                  height: '4rem',
                  flexShrink: 0,
                  borderRadius: 'var(--notable-radius-md)',
                  background: 'var(--notable-color-border-strong)',
                }}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}

export const EdgeEffectComparison: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--notable-spacing-6)' }}>
      {(['vertical', 'horizontal'] as const).map((orientation) => (
        <div
          key={orientation}
          style={{ display: 'grid', gap: 'var(--notable-spacing-3)' }}
        >
          <span style={mutedTextStyle}>{orientation} scrolling</span>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--notable-spacing-4)',
            }}
          >
            {edgeEffects.map((edgeEffect) => (
              <div
                key={edgeEffect}
                style={{ display: 'grid', gap: 'var(--notable-spacing-2)' }}
              >
                <span style={mutedTextStyle}>
                  edgeEffect=&quot;{edgeEffect}&quot;
                </span>
                <EdgeEffectSample
                  edgeEffect={edgeEffect}
                  orientation={orientation}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const EdgeEffectThemes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--notable-spacing-4)',
      }}
    >
      {(['light', 'dark'] as const).map((theme) => (
        <Card
          key={theme}
          data-theme={theme}
          style={{
            background: 'var(--notable-color-background)',
            padding: 'var(--notable-spacing-3)',
          }}
        >
          <span style={mutedTextStyle}>{theme}</span>
          <ScrollArea
            edgeEffect="blur"
            scrollbar="vertical"
            style={{ height: '12rem', width: '16rem' }}
          >
            <ContactList />
          </ScrollArea>
        </Card>
      ))}
    </div>
  ),
};

export const NarrowAndWideContainers: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--notable-spacing-4)' }}>
      <Card padding="none" style={{ width: '12rem' }}>
        <ScrollArea {...args} style={{ height: '10rem' }}>
          <ContactList />
        </ScrollArea>
      </Card>
      <Card padding="none" style={{ width: '100%' }}>
        <ScrollArea {...args} style={{ height: '10rem' }}>
          <ContactList />
        </ScrollArea>
      </Card>
    </div>
  ),
};
