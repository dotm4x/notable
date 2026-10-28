import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from './breadcrumb.js';

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Breadcrumb>
      <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
      <Breadcrumb.Item href="#">Settings</Breadcrumb.Item>
      <Breadcrumb.Item current>Profile</Breadcrumb.Item>
    </Breadcrumb>
  ),
};

export const LongHierarchy: Story = {
  render: () => (
    <Breadcrumb>
      <Breadcrumb.Item href="#">Workspace</Breadcrumb.Item>
      <Breadcrumb.Item href="#">Projects</Breadcrumb.Item>
      <Breadcrumb.Item href="#">Notable</Breadcrumb.Item>
      <Breadcrumb.Item href="#">Packages</Breadcrumb.Item>
      <Breadcrumb.Item href="#">Components</Breadcrumb.Item>
      <Breadcrumb.Item href="#">React</Breadcrumb.Item>
      <Breadcrumb.Item current>Breadcrumb</Breadcrumb.Item>
    </Breadcrumb>
  ),
};

export const CustomSeparator: Story = {
  render: () => (
    <Breadcrumb separator="/">
      <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
      <Breadcrumb.Item href="#">Docs</Breadcrumb.Item>
      <Breadcrumb.Item current>Components</Breadcrumb.Item>
    </Breadcrumb>
  ),
};

export const Collapsible: Story = {
  render: () => (
    <Breadcrumb maxVisibleItems={4}>
      <Breadcrumb.Item href="#">Workspace</Breadcrumb.Item>
      <Breadcrumb.Item href="#">Projects</Breadcrumb.Item>
      <Breadcrumb.Item href="#">Notable</Breadcrumb.Item>
      <Breadcrumb.Item href="#">Packages</Breadcrumb.Item>
      <Breadcrumb.Item href="#">Components</Breadcrumb.Item>
      <Breadcrumb.Item current>Breadcrumb</Breadcrumb.Item>
    </Breadcrumb>
  ),
};

export const DropdownNavigation: Story = {
  render: () => (
    <Breadcrumb>
      <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
      <Breadcrumb.Dropdown
        label="Projects"
        items={[
          { label: 'Notable', href: '#notable' },
          { label: 'Website', href: '#website' },
          { label: 'Tooling', href: '#tooling' },
        ]}
      />
      <Breadcrumb.Item current>Notable</Breadcrumb.Item>
    </Breadcrumb>
  ),
};

export const Combined: Story = {
  render: () => (
    <Breadcrumb maxVisibleItems={4}>
      <Breadcrumb.Item href="#">Workspace</Breadcrumb.Item>
      <Breadcrumb.Dropdown
        label="Projects"
        items={[
          { label: 'Notable', href: '#notable' },
          { label: 'Website', href: '#website' },
        ]}
      />
      <Breadcrumb.Item href="#">Packages</Breadcrumb.Item>
      <Breadcrumb.Item href="#">Components</Breadcrumb.Item>
      <Breadcrumb.Item href="#">Button</Breadcrumb.Item>
      <Breadcrumb.Item current>Variants</Breadcrumb.Item>
    </Breadcrumb>
  ),
};
