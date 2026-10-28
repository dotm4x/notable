import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar, type CalendarProps } from './calendar.js';

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  args: {
    defaultMonth: new Date(2025, 2, 1),
    locale: 'en-US',
  },
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelection: Story = {
  args: {
    defaultValue: new Date(2025, 2, 14),
  },
};

export const MondayStart: Story = {
  args: {
    defaultValue: new Date(2025, 2, 14),
    weekStartsOn: 1,
  },
};

export const SpanishLocale: Story = {
  args: {
    locale: 'es-ES',
    defaultValue: new Date(2025, 2, 14),
    weekStartsOn: 1,
  },
};

export const DateLimits: Story = {
  args: {
    defaultValue: new Date(2025, 2, 14),
    minDate: new Date(2025, 2, 10),
    maxDate: new Date(2025, 4, 20),
  },
};

export const DisabledDates: Story = {
  args: {
    defaultValue: new Date(2025, 2, 14),
    isDateDisabled: (date) => date.getDay() === 0 || date.getDay() === 6,
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: new Date(2025, 2, 14),
    disabled: true,
  },
};

function ControlledCalendar(props: CalendarProps) {
  const [value, setValue] = useState<Date | null>(new Date(2025, 2, 14));
  const [month, setMonth] = useState(new Date(2025, 2, 1));

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Calendar
        {...props}
        value={value}
        onValueChange={setValue}
        month={month}
        onMonthChange={setMonth}
      />
      <p style={{ margin: 0 }}>
        Selected: {value ? value.toDateString() : 'none'}
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledCalendar {...args} />,
};

export const BookingExample: Story = {
  render: (args) => {
    const today = new Date();
    const firstAvailable = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );

    return (
      <Calendar
        {...args}
        defaultValue={null}
        minDate={firstAvailable}
        isDateDisabled={(date) => date.getDay() === 1}
      />
    );
  },
};

export const MultipleInstances: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <Calendar {...args} defaultValue={new Date(2025, 2, 14)} />
      <Calendar
        {...args}
        defaultMonth={new Date(2025, 3, 1)}
        defaultValue={new Date(2025, 3, 22)}
      />
    </div>
  ),
};
