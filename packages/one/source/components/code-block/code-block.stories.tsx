import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeBlock } from './code-block.js';
import { useHighlightedCode } from './highlighter.js';
import { Tabs } from '../tabs/tabs.js';

const meta = {
  title: 'Components/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'destructive'],
    },
    size: {
      control: 'inline-radio',
      options: ['default', 'sm'],
    },
  },
  args: {
    variant: 'default',
    size: 'default',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 640 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <CodeBlock {...args}>
      <CodeBlock.Header>
        <CodeBlock.Title>app/api/chat/route.ts</CodeBlock.Title>
        <CodeBlock.Actions>
          <CodeBlock.CopyButton
            value={
              'export async function GET() {\n  return Response.json({ ok: true });\n}'
            }
          />
        </CodeBlock.Actions>
      </CodeBlock.Header>
      <CodeBlock.Content>
        {
          'export async function GET() {\n  return Response.json({ ok: true });\n}'
        }
      </CodeBlock.Content>
    </CodeBlock>
  ),
} satisfies Meta<typeof CodeBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FloatingActions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When Actions is a direct child of CodeBlock, it floats and appears on hover or focus.',
      },
    },
  },
  render: () => (
    <CodeBlock>
      <CodeBlock.Actions>
        <CodeBlock.CopyButton value="pnpm add @dotm4x/one" />
      </CodeBlock.Actions>
      <CodeBlock.Content lineNumbers>
        {'$ pnpm add @dotm4x/one\nPackages: +4\nDone.'}
      </CodeBlock.Content>
    </CodeBlock>
  ),
};

export const LineNumbers: Story = {
  render: (args) => (
    <CodeBlock {...args}>
      <CodeBlock.Header>
        <CodeBlock.Title>src/greeting.ts</CodeBlock.Title>
      </CodeBlock.Header>
      <CodeBlock.Content lineNumbers startLine={12}>
        {
          'export function greet(name: string) {\n  return `Hello, ${name}!`;\n}'
        }
      </CodeBlock.Content>
    </CodeBlock>
  ),
};

export const Diff: Story = {
  render: (args) => (
    <CodeBlock {...args}>
      <CodeBlock.Header>
        <CodeBlock.Title>src/greeting.ts</CodeBlock.Title>
      </CodeBlock.Header>
      <CodeBlock.Content>
        <CodeBlock.Line>
          export function greet(name: string) {'{'}
        </CodeBlock.Line>
        <CodeBlock.Line variant="removed">
          {'  return `Hello, ${name}`;'}
        </CodeBlock.Line>
        <CodeBlock.Line variant="added">
          {'  return `Hello, ${name}!`;'}
        </CodeBlock.Line>
        <CodeBlock.Line variant="highlighted">{'}'}</CodeBlock.Line>
      </CodeBlock.Content>
    </CodeBlock>
  ),
};

export const Wrap: Story = {
  args: {
    size: 'sm',
  },
  render: (args) => (
    <CodeBlock {...args}>
      <CodeBlock.Content wrap>
        {
          'Error: The request is too large. Remove some messages or summarize the conversation before trying again.'
        }
      </CodeBlock.Content>
    </CodeBlock>
  ),
};

function HighlightedExample() {
  const code = `export function greet(name: string) {
  return \`Hello, \${name}!\`;
}`;
  const lines = useHighlightedCode(code, 'tsx');

  return (
    <CodeBlock>
      <CodeBlock.Header>
        <CodeBlock.Title>src/greeting.ts</CodeBlock.Title>
        <CodeBlock.Actions>
          <CodeBlock.CopyButton value={code} />
        </CodeBlock.Actions>
      </CodeBlock.Header>
      <CodeBlock.Content>
        {lines.map((line, index) => (
          <CodeBlock.Line key={index}>{line}</CodeBlock.Line>
        ))}
      </CodeBlock.Content>
    </CodeBlock>
  );
}

export const Highlighted: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The optional highlighter returns one React node list per line and uses Shiki.',
      },
    },
  },
  render: () => <HighlightedExample />,
};

export const WithTabs: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Compose CodeBlock with Tabs to show several files without adding tab logic to the code block.',
      },
    },
  },
  render: () => (
    <Tabs defaultValue="route">
      <Tabs.List aria-label="Files">
        <Tabs.Trigger value="route">route.ts</Tabs.Trigger>
        <Tabs.Trigger value="chat">chat.tsx</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="route">
        <CodeBlock>
          <CodeBlock.Header>
            <CodeBlock.Title>app/api/chat/route.ts</CodeBlock.Title>
          </CodeBlock.Header>
          <CodeBlock.Content>
            {
              'export async function POST() {\n  return Response.json({ ok: true });\n}'
            }
          </CodeBlock.Content>
        </CodeBlock>
      </Tabs.Content>
      <Tabs.Content value="chat">
        <CodeBlock>
          <CodeBlock.Header>
            <CodeBlock.Title>components/chat.tsx</CodeBlock.Title>
          </CodeBlock.Header>
          <CodeBlock.Content>
            {'export function Chat() {\n  return null;\n}'}
          </CodeBlock.Content>
        </CodeBlock>
      </Tabs.Content>
    </Tabs>
  ),
};
