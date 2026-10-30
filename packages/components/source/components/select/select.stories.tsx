import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Select } from './select.js';

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default single-selection select dropdown.',
      },
    },
  },
  render: () => (
    <div style={{ width: '16rem' }}>
      <Select.Root>
        <Select.Label>Fruit</Select.Label>
        <Select.Trigger>
          <Select.Value placeholder="Pick a fruit" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content>
          <Select.List>
            {fruitOptions.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.List>
        </Select.Content>
      </Select.Root>
    </div>
  ),
};

export const DefaultValue: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Selects can be initialized with a default selected value.',
      },
    },
  },
  render: () => (
    <div style={{ width: '16rem' }}>
      <Select.Root defaultValue="banana">
        <Select.Label>Fruit</Select.Label>
        <Select.Trigger>
          <Select.Value placeholder="Pick a fruit" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content>
          <Select.List>
            {fruitOptions.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.List>
        </Select.Content>
      </Select.Root>
    </div>
  ),
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Selects support controlled value state management.',
      },
    },
  },
  render: function ControlledStory() {
    const [value, setValue] = useState<string | null>('cherry');

    return (
      <div style={{ width: '16rem', display: 'grid', gap: '1rem' }}>
        <Select.Root value={value} onValueChange={setValue}>
          <Select.Label>Fruit</Select.Label>
          <Select.Trigger>
            <Select.Value placeholder="Pick a fruit" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Content>
            <Select.List>
              {fruitOptions.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.List>
          </Select.Content>
        </Select.Root>
        <p>Selected: {value ?? 'none'}</p>
      </div>
    );
  },
};

export const Groups: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Select options can be organized into labeled groups with separators.',
      },
    },
  },
  render: () => (
    <div style={{ width: '16rem' }}>
      <Select.Root>
        <Select.Label>Food</Select.Label>
        <Select.Trigger>
          <Select.Value placeholder="Pick a food" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content>
          <Select.List>
            <Select.Group>
              <Select.GroupLabel>Fruits</Select.GroupLabel>
              <Select.Item value="apple">Apple</Select.Item>
              <Select.Item value="banana">Banana</Select.Item>
            </Select.Group>
            <Select.Separator />
            <Select.Group>
              <Select.GroupLabel>Vegetables</Select.GroupLabel>
              <Select.Item value="carrot">Carrot</Select.Item>
              <Select.Item value="pea">Pea</Select.Item>
            </Select.Group>
          </Select.List>
        </Select.Content>
      </Select.Root>
    </div>
  ),
};

export const LongList: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Select popups scroll internally when they contain many options.',
      },
    },
  },
  render: () => (
    <div style={{ width: '16rem' }}>
      <Select.Root>
        <Select.Label>Number</Select.Label>
        <Select.Trigger>
          <Select.Value placeholder="Pick a number" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content>
          <Select.List>
            {Array.from({ length: 30 }, (_, index) => (
              <Select.Item key={index} value={`item-${index + 1}`}>
                Option {index + 1}
              </Select.Item>
            ))}
          </Select.List>
        </Select.Content>
      </Select.Root>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Selects can be disabled to prevent interaction.',
      },
    },
  },
  render: () => (
    <div style={{ width: '16rem' }}>
      <Select.Root defaultValue="apple" disabled>
        <Select.Label>Fruit</Select.Label>
        <Select.Trigger>
          <Select.Value placeholder="Pick a fruit" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content>
          <Select.List>
            {fruitOptions.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.List>
        </Select.Content>
      </Select.Root>
    </div>
  ),
};
