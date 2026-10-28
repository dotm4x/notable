import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button/button.js';
import { NavigationMenu } from '../navigation-menu/navigation-menu.js';
import { Header } from './header.js';

const meta = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    mode: 'normal',
  },
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['normal', 'fixed', 'dynamic'],
    },
  },
  render: (args) => (
    <Header {...args}>
      <strong>Acme Studio</strong>
      <Button variant="secondary">Sign in</Button>
    </Header>
  ),
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Scrollable content so sticky and dynamic behavior can be observed. */
function LongPage({ children }: { children: ReactNode }) {
  return (
    <div style={{ minBlockSize: '300vh' }}>
      {children}
      <div style={{ padding: 24, display: 'grid', gap: 16 }}>
        {Array.from({ length: 40 }, (_, index) => (
          <p key={index}>
            Paragraph {index + 1}. Scroll down to move the header out of view
            and scroll up to reveal it again.
          </p>
        ))}
      </div>
    </div>
  );
}

export const Normal: Story = {
  args: {
    mode: 'normal',
  },
};

export const Fixed: Story = {
  args: {
    mode: 'fixed',
  },
  render: (args) => (
    <LongPage>
      <Header {...args}>
        <strong>Acme Studio</strong>
        <Button variant="secondary">Sign in</Button>
      </Header>
    </LongPage>
  ),
};

export const Dynamic: Story = {
  args: {
    mode: 'dynamic',
  },
  render: (args) => (
    <LongPage>
      <Header {...args}>
        <strong>Acme Studio</strong>
        <Button variant="secondary">Sign in</Button>
      </Header>
    </LongPage>
  ),
};

export const CustomContent: Story = {
  args: {
    mode: 'dynamic',
  },
  render: (args) => (
    <LongPage>
      <Header {...args}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="12" cy="12" r="10" fill="currentColor" />
          </svg>
          <strong>Acme Studio</strong>
        </span>
        <NavigationMenu aria-label="Main">
          <NavigationMenu.List>
            <NavigationMenu.Item value="products">
              <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <NavigationMenu.Link href="#" closeOnClick>
                  Editor
                </NavigationMenu.Link>
                <NavigationMenu.Link href="#" closeOnClick>
                  Sync
                </NavigationMenu.Link>
                <NavigationMenu.Link href="#" closeOnClick>
                  Export
                </NavigationMenu.Link>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item value="resources">
              <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <NavigationMenu.Group>
                  <NavigationMenu.Link href="#" closeOnClick>
                    Documentation
                  </NavigationMenu.Link>
                  <NavigationMenu.Link href="#" closeOnClick>
                    Changelog
                  </NavigationMenu.Link>
                </NavigationMenu.Group>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item value="pricing">
              <NavigationMenu.Link href="#" active>
                Pricing
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item value="coming-soon">
              <NavigationMenu.Trigger disabled>
                Coming soon
              </NavigationMenu.Trigger>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu>
        <Button variant="primary">Get started</Button>
      </Header>
    </LongPage>
  ),
};
