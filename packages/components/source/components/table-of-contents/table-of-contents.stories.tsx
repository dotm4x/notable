import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableOfContents } from './table-of-contents.js';

const meta = {
  title: 'Components/TableOfContents',
  component: TableOfContents,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TableOfContents>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '12rem minmax(0, 32rem)',
        gap: '3rem',
        alignItems: 'start',
      }}
    >
      <TableOfContents.Root style={{ position: 'sticky', top: '1.5rem' }}>
        <TableOfContents.Header>On this page</TableOfContents.Header>
        <TableOfContents.List>
          <TableOfContents.Item href="#principles" label="Principles">
            <TableOfContents.List>
              <TableOfContents.Item
                href="#clarity"
                label="Clarity and restraint"
              />
              <TableOfContents.Item href="#consistency" label="Consistency" />
            </TableOfContents.List>
          </TableOfContents.Item>
          <TableOfContents.Item href="#accessibility" label="Accessibility" />
          <TableOfContents.Item href="#motion" label="Motion" />
        </TableOfContents.List>
      </TableOfContents.Root>

      <article
        style={{
          color: 'var(--notable-color-text)',
          fontFamily: 'var(--notable-font-family)',
          lineHeight: 'var(--notable-line-height-relaxed)',
        }}
      >
        <section id="principles" style={{ minHeight: '16rem' }}>
          <h2>Principles</h2>
          <p>Experiences should make their purpose clear and easy to follow.</p>
        </section>
        <section id="clarity" style={{ minHeight: '16rem' }}>
          <h3>Clarity and restraint</h3>
          <p>Keep each interface focused on the task at hand.</p>
        </section>
        <section id="consistency" style={{ minHeight: '16rem' }}>
          <h3>Consistency</h3>
          <p>Related actions should behave in familiar, predictable ways.</p>
        </section>
        <section id="accessibility" style={{ minHeight: '16rem' }}>
          <h2>Accessibility</h2>
          <p>Every interaction should work across supported input methods.</p>
        </section>
        <section id="motion" style={{ minHeight: '16rem' }}>
          <h2>Motion</h2>
          <p>Motion explains change and respects reduced-motion preferences.</p>
        </section>
      </article>
    </div>
  ),
};
