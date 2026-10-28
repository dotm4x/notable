import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type DateRange, DateRangePicker } from './date-range-picker.js';

const meta = {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Stay dates',
    locale: 'en-US',
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelection: Story = {
  args: {
    defaultValue: { start: new Date(2025, 2, 10), end: new Date(2025, 2, 14) },
  },
};

export const PartialSelection: Story = {
  args: {
    defaultValue: { start: new Date(2025, 2, 10), end: null },
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Choose your trip dates',
    'aria-label': 'Trip dates',
  },
};

export const WithConstraints: Story = {
  args: {
    defaultValue: { start: new Date(2025, 2, 12), end: new Date(2025, 2, 18) },
    minDate: new Date(2025, 2, 10),
    maxDate: new Date(2025, 2, 25),
    'aria-label': 'Booking dates',
  },
};

export const DisabledDates: Story = {
  args: {
    isDateDisabled: (date) => date.getDay() === 0 || date.getDay() === 6,
    'aria-label': 'Work sprint dates',
  },
};

export const Clearable: Story = {
  args: {
    clearable: true,
    defaultValue: { start: new Date(2025, 2, 10), end: new Date(2025, 2, 14) },
  },
};

export const SpanishLocale: Story = {
  args: {
    locale: 'es-ES',
    placeholder: 'Selecciona un rango de fechas',
    defaultValue: { start: new Date(2025, 2, 10), end: new Date(2025, 2, 14) },
    'aria-label': 'Fechas',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: { start: new Date(2025, 2, 10), end: new Date(2025, 2, 14) },
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: { start: new Date(2025, 2, 10), end: new Date(2025, 2, 14) },
  },
};

export const Controlled: Story = {
  render: function ControlledDateRangePicker() {
    const [value, setValue] = useState<DateRange>({
      start: new Date(2025, 2, 10),
      end: new Date(2025, 2, 14),
    });

    return (
      <div style={{ display: 'grid', gap: '1rem', justifyItems: 'start' }}>
        <DateRangePicker
          aria-label="Event dates"
          locale="en-US"
          clearable
          value={value}
          onValueChange={setValue}
        />
        <p>
          Start: {value.start ? value.start.toDateString() : 'none'}
          <br />
          End: {value.end ? value.end.toDateString() : 'none'}
        </p>
      </div>
    );
  },
};
