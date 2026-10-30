import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button/button.js';
import { Card } from './card.js';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['div', 'section', 'article'],
      description: 'The semantic HTML element to render.',
    },
    padding: {
      control: 'inline-radio',
      options: ['default', 'none'],
      description: 'Inner padding size.',
    },
  },
  args: {
    as: 'div',
    padding: 'default',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Card {...args}>
      <Card.Header>
        <Card.Title>Project settings</Card.Title>
        <Card.Description>
          Manage how this project is shared and built.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        Visibility is set to private for all collaborators.
      </Card.Content>
      <Card.Footer>
        <Button variant="secondary" size="small">
          Cancel
        </Button>
        <Button size="small">Save</Button>
      </Card.Footer>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default card layout with header, content, and footer.',
      },
    },
  },
};

export const Minimal: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A simplified card containing only content.',
      },
    },
  },
  render: (args) => (
    <Card {...args}>
      <Card.Content>A card with only content.</Card.Content>
    </Card>
  ),
};

export const HeaderOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A card composed with only a header section.',
      },
    },
  },
  render: (args) => (
    <Card {...args}>
      <Card.Header>
        <Card.Title>Release notes</Card.Title>
        <Card.Description>Version 2.4.0 was published today.</Card.Description>
      </Card.Header>
    </Card>
  ),
};

export const Flush: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Cards can remove default padding so inner content sits flush with the edges.',
      },
    },
  },
  args: {
    padding: 'none',
  },
  render: (args) => (
    <Card {...args}>
      <Card.Header style={{ padding: 'var(--notable-spacing-6)' }}>
        <Card.Title>Recent activity</Card.Title>
        <Card.Description>
          Content below sits flush with the edge.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div
          style={{
            height: 120,
            overflow: 'auto',
            padding: 'var(--notable-spacing-6)',
          }}
        >
          Scrollable content that stays inside the rounded card corners.
        </div>
      </Card.Content>
    </Card>
  ),
};

export const Semantic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Cards support semantic HTML elements such as section and article.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card as="section" aria-labelledby="section-card-title">
        <Card.Header>
          <Card.Title id="section-card-title" as="h2">
            Section card
          </Card.Title>
          <Card.Description>Rendered as a section element.</Card.Description>
        </Card.Header>
      </Card>
      <Card as="article" aria-labelledby="article-card-title">
        <Card.Header>
          <Card.Title id="article-card-title" as="h2">
            Article card
          </Card.Title>
          <Card.Description>Rendered as an article element.</Card.Description>
        </Card.Header>
      </Card>
    </div>
  ),
};

export const Themes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Cards adapt correctly across light and dark themes.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      {(['light', 'dark'] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          style={{
            padding: 16,
            borderRadius: 'var(--notable-radius-md)',
            background: 'var(--notable-color-background)',
          }}
        >
          <Card {...args}>
            <Card.Header>
              <Card.Title>{theme} theme</Card.Title>
              <Card.Description>
                Surface, border, and text follow the active theme.
              </Card.Description>
            </Card.Header>
          </Card>
        </div>
      ))}
    </div>
  ),
};

export const Narrow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Cards wrap their text content cleanly inside narrow containers.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 220 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Card {...args}>
      <Card.Header>
        <Card.Title>A long card title that wraps across lines</Card.Title>
        <Card.Description>
          Descriptions wrap naturally inside a narrow container.
        </Card.Description>
      </Card.Header>
      <Card.Footer>
        <Button size="small">Primary action</Button>
        <Button variant="secondary" size="small">
          Secondary
        </Button>
      </Card.Footer>
    </Card>
  ),
};
