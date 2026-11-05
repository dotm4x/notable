import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Box,
  Code,
  FileText,
  Folder,
  Home,
  Settings,
} from '../../icons/index.js';
import { Tree } from './tree.js';
import type { TreeNode } from './types.js';

const items: TreeNode[] = [
  {
    id: 'home',
    label: 'Home',
    href: '#home',
    icon: <Home aria-hidden="true" />,
  },
  {
    id: 'components',
    label: 'Components',
    icon: <Box aria-hidden="true" />,
    children: [
      { id: 'button', label: 'Button', href: '#button' },
      { id: 'dialog', label: 'Dialog', href: '#dialog' },
      {
        id: 'data',
        label: 'Data',
        children: [
          { id: 'table', label: 'Table', href: '#table' },
          { id: 'data-table', label: 'DataTable', href: '#data-table' },
        ],
      },
    ],
  },
  {
    id: 'patterns',
    label: 'Patterns',
    icon: <Code aria-hidden="true" />,
    children: [
      { id: 'loading', label: 'Loading', href: '#loading' },
      { id: 'selection', label: 'Selection', href: '#selection' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '#settings',
    icon: <Settings aria-hidden="true" />,
  },
];

const meta = {
  title: 'Components/Tree',
  component: Tree,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    'aria-label': 'Documentation',
    items,
  },
} satisfies Meta<typeof Tree>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: {
    activeId: 'button',
  },
};

export const Expanded: Story = {
  args: {
    defaultExpandedIds: ['components', 'data'],
  },
};

export const Links: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Leaves with href render as native links, preserving open-in-new-tab and middle click.',
      },
    },
  },
  args: {
    activeId: 'dialog',
  },
};

export const Deep: Story = {
  render: () => (
    <Tree
      aria-label="Project files"
      defaultExpandedIds={['src', 'components', 'data']}
      items={[
        {
          id: 'src',
          label: 'src',
          icon: <Folder aria-hidden="true" />,
          children: [
            {
              id: 'components',
              label: 'components',
              icon: <Folder aria-hidden="true" />,
              children: [
                {
                  id: 'data',
                  label: 'data',
                  icon: <Folder aria-hidden="true" />,
                  children: [
                    {
                      id: 'table',
                      label: 'table.tsx',
                      href: '#table',
                      icon: <FileText aria-hidden="true" />,
                    },
                    {
                      id: 'data-table',
                      label: 'data-table.tsx',
                      href: '#data-table',
                      icon: <FileText aria-hidden="true" />,
                    },
                  ],
                },
                {
                  id: 'button',
                  label: 'button.tsx',
                  href: '#button',
                  icon: <FileText aria-hidden="true" />,
                },
              ],
            },
          ],
        },
        {
          id: 'package',
          label: 'package.json',
          href: '#package',
          icon: <FileText aria-hidden="true" />,
        },
      ]}
    />
  ),
};
