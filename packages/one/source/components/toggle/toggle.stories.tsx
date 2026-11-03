import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Toggle } from './toggle.js';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'Bold',
    variant: 'default',
    size: 'medium',
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: 'The visual style of the toggle.',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the toggle.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the toggle is non-interactive.',
    },
    onPressedChange: { action: 'pressed change' },
  },
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A standalone toggle controls one independent on/off value.',
      },
    },
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default and outline variants distinguish toggle emphasis.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '12px' }}>
      <Toggle defaultPressed>Default pressed</Toggle>
      <Toggle>Default unpressed</Toggle>
      <Toggle variant="outline" defaultPressed>
        Outline pressed
      </Toggle>
      <Toggle variant="outline">Outline unpressed</Toggle>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const defaultPressed = canvas.getByRole('button', {
      name: 'Default pressed',
    });
    const defaultUnpressed = canvas.getByRole('button', {
      name: 'Default unpressed',
    });

    expect(getComputedStyle(defaultPressed).fontWeight).toBe(
      getComputedStyle(defaultUnpressed).fontWeight,
    );
    expect(
      getComputedStyle(canvas.getByRole('button', { name: 'Outline pressed' }))
        .fontWeight,
    ).toBe(
      getComputedStyle(
        canvas.getByRole('button', { name: 'Outline unpressed' }),
      ).fontWeight,
    );

    const initialTransform = getComputedStyle(defaultUnpressed).transform;
    expect(getComputedStyle(defaultUnpressed).transition).toContain(
      'background-color',
    );

    await userEvent.hover(defaultUnpressed);
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    expect(getComputedStyle(defaultUnpressed).transform).toBe(initialTransform);

    await userEvent.pointer({
      keys: '[MouseLeft>]',
      target: defaultUnpressed,
    });
    await waitFor(() => {
      expect(getComputedStyle(defaultUnpressed).transform).not.toBe(
        initialTransform,
      );
    });
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Toggles come in small, medium, and large sizes.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Toggle size="small">Small</Toggle>
      <Toggle size="medium">Medium</Toggle>
      <Toggle size="large">Large</Toggle>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Disabled toggles preserve their current state.',
      },
    },
  },
  args: {
    disabled: true,
    defaultPressed: true,
  },
};
