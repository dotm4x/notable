import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from './date-picker.js';

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Start date',
    locale: 'en-US',
  },
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelection: Story = {
  args: {
    defaultValue: new Date(2025, 2, 14),
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Choose a delivery date',
    'aria-label': 'Delivery date',
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: new Date(2025, 2, 14),
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    defaultValue: new Date(2025, 2, 14),
    readOnly: true,
  },
};

export const WithConstraints: Story = {
  args: {
    defaultValue: new Date(2025, 2, 14),
    minDate: new Date(2025, 2, 10),
    maxDate: new Date(2025, 2, 25),
    'aria-label': 'Check-in date',
  },
};

export const DisabledDates: Story = {
  args: {
    defaultValue: new Date(2025, 2, 14),
    isDateDisabled: (date) => date.getDay() === 0 || date.getDay() === 6,
    'aria-label': 'Appointment date',
  },
};

export const SpanishLocale: Story = {
  args: {
    locale: 'es-ES',
    defaultValue: new Date(2025, 2, 14),
    placeholder: 'Selecciona una fecha',
    'aria-label': 'Fecha',
  },
};

export const CustomFormatting: Story = {
  args: {
    defaultValue: new Date(2025, 2, 14),
    formatDate: (date) =>
      date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
  },
};

export const Controlled: Story = {
  render: function ControlledDatePicker() {
    const [value, setValue] = useState<Date | null>(new Date(2025, 2, 14));

    return (
      <div style={{ display: 'grid', gap: '1rem', justifyItems: 'start' }}>
        <DatePicker
          aria-label="Event date"
          locale="en-US"
          value={value}
          onValueChange={setValue}
        />
        <p>Selected: {value ? value.toDateString() : 'none'}</p>
        <button type="button" onClick={() => setValue(null)}>
          Clear
        </button>
      </div>
    );
  },
};

export const BookingForm: Story = {
  render: function BookingFormStory() {
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);

    return (
      <div style={{ display: 'grid', gap: '1rem', width: '18rem' }}>
        <DatePicker
          aria-label="Check-in"
          locale="en-US"
          value={checkIn}
          onValueChange={(date) => {
            setCheckIn(date);
            if (checkOut && checkOut < date) {
              setCheckOut(null);
            }
          }}
          minDate={new Date(2025, 2, 1)}
        />
        <DatePicker
          aria-label="Check-out"
          locale="en-US"
          value={checkOut}
          onValueChange={setCheckOut}
          minDate={checkIn ?? new Date(2025, 2, 1)}
        />
      </div>
    );
  },
};

export const NarrowContainer: Story = {
  args: {
    defaultValue: new Date(2025, 2, 14),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '12rem' }}>
        <Story />
      </div>
    ),
  ],
};
