import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Slider, type TSliderProps } from './slider.js';

const meta = {
  parameters: {
    layout: 'centered',
  },
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
  parameters: {
    docs: {
      description: {
        story: 'The default single-thumb slider.',
      },
    },
  },
  args: {
    defaultValue: 45,
  },
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Sliders support controlled value state management.',
      },
    },
  },
  render: () => <ControlledSlider />,
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

export const CustomRange: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Sliders support custom minimum, maximum, and step intervals.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Sliders support dual thumbs for range selection.',
      },
    },
  },
  args: {
    label: 'Price range',
    defaultValue: [25, 75],
    thumbLabels: ['Minimum price', 'Maximum price'],
    showValue: true,
    marks: [0, 25, 50, 75, 100],
  },
};

export const Marked: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Sliders support step marks and custom mark labels.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Sliders support vertical orientation layout.',
      },
    },
  },
  args: {
    label: 'Vertical volume',
    orientation: 'vertical',
    defaultValue: 65,
    markInterval: 25,
    showValue: true,
  },
};

export const ReadOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Sliders support read-only mode.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Sliders can be disabled to prevent interaction.',
      },
    },
  },
  args: {
    label: 'Managed volume',
    defaultValue: 60,
    disabled: true,
    showValue: true,
  },
};

export const FixedRange: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Sliders where minimum and maximum bounds are equal.',
      },
    },
  },
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
