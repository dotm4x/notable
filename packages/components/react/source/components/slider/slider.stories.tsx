import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Slider, type TSliderProps } from './slider.js';

const meta = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: {
    label: 'Volume',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<TSliderProps>;

export default meta;

type Story = StoryObj<TSliderProps>;

export const Default: Story = {
  args: {
    defaultValue: 45,
  },
};

function ControlledSlider() {
  const [value, setValue] = useState(35);

  return (
    <Slider
      label="Playback speed"
      min={0.5}
      max={2}
      step={0.25}
      value={value}
      onValueChange={(nextValue) => {
        if (typeof nextValue === 'number') {
          setValue(nextValue);
        }
      }}
      showValue
    />
  );
}

export const Controlled: Story = {
  render: () => <ControlledSlider />,
};

export const CustomRange: Story = {
  args: {
    label: 'Temperature',
    min: 10,
    max: 30,
    step: 2,
    defaultValue: 18,
    showValue: true,
    description: 'Choose a value in two-degree increments.',
  },
};

export const RangeSelection: Story = {
  args: {
    label: 'Price range',
    defaultValue: [25, 75],
    thumbLabels: ['Minimum price', 'Maximum price'],
    showValue: true,
    marks: [0, 25, 50, 75, 100],
  },
};

export const Marked: Story = {
  args: {
    label: 'Distance',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 25,
    markInterval: 25,
    marks: [{ value: 50, label: 'Halfway' }],
    showValue: true,
  },
};

export const Vertical: Story = {
  args: {
    label: 'Vertical volume',
    orientation: 'vertical',
    defaultValue: 65,
    markInterval: 25,
    showValue: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Fixed playback speed',
    defaultValue: 1,
    min: 0.5,
    max: 2,
    step: 0.25,
    readOnly: true,
    showValue: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Managed volume',
    defaultValue: 60,
    disabled: true,
    showValue: true,
  },
};

export const FixedRange: Story = {
  args: {
    label: 'Fixed value',
    min: 5,
    max: 5,
    defaultValue: 5,
    showValue: true,
    disabled: true,
    description: 'The available range contains one value.',
  },
};
