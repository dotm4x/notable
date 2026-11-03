import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type DateRange, DateRangePicker } from './date-range-picker.js';

const meta = {
  parameters: {
    layout: 'centered',
  },
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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default date range picker input and popup calendar.',
      },
    },
  },
};

export const Selection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Date range pickers support initialized start and end date selections.',
      },
    },
  },
  args: {
    defaultValue: { start: new Date(2025, 2, 10), end: new Date(2025, 2, 14) },
  },
};

export const Partial: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Date range pickers supporting partial selections with only a start date.',
      },
    },
  },
  args: {
    defaultValue: { start: new Date(2025, 2, 10), end: null },
  },
};

export const Placeholder: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Date range pickers support custom placeholder text.',
      },
    },
  },
  args: {
    placeholder: 'Choose your trip dates',
    'aria-label': 'Trip dates',
  },
};

export const Constraints: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Date range pickers support minimum and maximum date range boundaries.',
      },
    },
  },
  args: {
    defaultValue: { start: new Date(2025, 2, 12), end: new Date(2025, 2, 18) },
    minDate: new Date(2025, 2, 10),
    maxDate: new Date(2025, 2, 25),
    'aria-label': 'Booking dates',
  },
};

export const DisabledDates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Specific dates can be disabled within the range picker calendar.',
      },
    },
  },
  args: {
    isDateDisabled: (date) => date.getDay() === 0 || date.getDay() === 6,
    'aria-label': 'Work sprint dates',
  },
};

export const Clearable: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Date range pickers support a clear button to reset selections.',
      },
    },
  },
  args: {
    clearable: true,
    defaultValue: { start: new Date(2025, 2, 10), end: new Date(2025, 2, 14) },
  },
};

export const Spanish: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Date range pickers support localized formatting and day names in Spanish.',
      },
    },
  },
  args: {
    locale: 'es-ES',
    placeholder: 'Selecciona un rango de fechas',
    defaultValue: { start: new Date(2025, 2, 10), end: new Date(2025, 2, 14) },
    'aria-label': 'Fechas',
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Date range pickers can be disabled to prevent interaction.',
      },
    },
  },
  args: {
    disabled: true,
    defaultValue: { start: new Date(2025, 2, 10), end: new Date(2025, 2, 14) },
  },
};

export const ReadOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Date range pickers support read-only mode.',
      },
    },
  },
  args: {
    readOnly: true,
    defaultValue: { start: new Date(2025, 2, 10), end: new Date(2025, 2, 14) },
  },
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Date range pickers support controlled value state management.',
      },
    },
  },
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
