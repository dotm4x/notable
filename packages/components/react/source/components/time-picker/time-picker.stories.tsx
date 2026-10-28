import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimePicker } from './time-picker.js';

const meta = {
  title: 'Components/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Start time',
    locale: 'en-US',
  },
} satisfies Meta<typeof TimePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelection: Story = {
  args: {
    defaultValue: '09:30',
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Choose a start time',
    'aria-label': 'Meeting start',
  },
};

export const TwelveHour: Story = {
  args: {
    format: '12h',
    defaultValue: '15:45',
  },
};

export const TwentyFourHour: Story = {
  args: {
    format: '24h',
    defaultValue: '21:05',
  },
};

export const CustomMinuteStep: Story = {
  args: {
    minuteStep: 15,
    defaultValue: '10:30',
    'aria-label': 'Appointment time',
  },
};

export const Constrained: Story = {
  args: {
    format: '12h',
    minTime: '09:00',
    maxTime: '17:30',
    minuteStep: 15,
    defaultValue: '12:00',
    'aria-label': 'Business hours',
  },
};

export const MisalignedValue: Story = {
  args: {
    minuteStep: 15,
    defaultValue: '09:07',
    'aria-label': 'Reminder time',
  },
};

export const Controlled: Story = {
  render: function ControlledTimePicker(args) {
    const [time, setTime] = useState<string | null>('14:00');

    return (
      <div style={{ display: 'grid', gap: '1rem', maxWidth: '16rem' }}>
        <TimePicker {...args} value={time} onValueChange={setTime} />
        <output>Selected: {time ?? 'none'}</output>
      </div>
    );
  },
  args: {
    'aria-label': 'Controlled time',
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: '09:30',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    defaultValue: '09:30',
    readOnly: true,
  },
};

export const AppointmentForm: Story = {
  render: function AppointmentTimePicker(args) {
    const [start, setStart] = useState<string | null>('09:00');
    const [end, setEnd] = useState<string | null>('10:00');

    return (
      <div style={{ display: 'grid', gap: '1rem', maxWidth: '16rem' }}>
        <TimePicker
          {...args}
          aria-label="Start time"
          value={start}
          onValueChange={setStart}
          minuteStep={15}
          minTime="08:00"
          maxTime="18:00"
        />
        <TimePicker
          {...args}
          aria-label="End time"
          value={end}
          onValueChange={setEnd}
          minuteStep={15}
          minTime={start ?? '08:00'}
          maxTime="18:00"
        />
      </div>
    );
  },
};

export const NarrowContainer: Story = {
  render: function NarrowTimePicker(args) {
    return (
      <div style={{ width: '12rem' }}>
        <TimePicker {...args} format="12h" defaultValue="11:15" />
      </div>
    );
  },
  args: {
    'aria-label': 'Narrow time',
  },
};
