import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimePicker } from './time-picker.js';

const meta = {
  parameters: {
    layout: 'centered',
  },
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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default time picker input.',
      },
    },
  },
};

export const Selection: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Time pickers support initialized default values.',
      },
    },
  },
  args: {
    defaultValue: '09:30',
  },
};

export const Placeholder: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Time pickers support custom placeholder text.',
      },
    },
  },
  args: {
    placeholder: 'Choose a start time',
    'aria-label': 'Meeting start',
  },
};

export const TwelveHour: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Time pickers supporting 12-hour clock format with AM/PM selection.',
      },
    },
  },
  args: {
    format: '12h',
    defaultValue: '15:45',
  },
};

export const TwentyFourHour: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Time pickers supporting 24-hour clock format.',
      },
    },
  },
  args: {
    format: '24h',
    defaultValue: '21:05',
  },
};

export const Step: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Time pickers support custom minute step intervals such as 15-minute increments.',
      },
    },
  },
  args: {
    minuteStep: 15,
    defaultValue: '10:30',
    'aria-label': 'Appointment time',
  },
};

export const Constrained: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Time pickers support minimum and maximum time constraints.',
      },
    },
  },
  args: {
    format: '12h',
    minTime: '09:00',
    maxTime: '17:30',
    minuteStep: 15,
    defaultValue: '12:00',
    'aria-label': 'Business hours',
  },
};

export const Misaligned: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Time pickers handling initial values that do not align with the minute step interval.',
      },
    },
  },
  args: {
    minuteStep: 15,
    defaultValue: '09:07',
    'aria-label': 'Reminder time',
  },
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Time pickers support controlled value state management.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Time pickers can be disabled to prevent interaction.',
      },
    },
  },
  args: {
    defaultValue: '09:30',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Time pickers support read-only mode.',
      },
    },
  },
  args: {
    defaultValue: '09:30',
    readOnly: true,
  },
};

export const Form: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Multiple time pickers composed in an appointment form layout with dependent constraints.',
      },
    },
  },
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

export const Narrow: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Time pickers inside narrow container widths.',
      },
    },
  },
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
