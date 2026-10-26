import { useState } from 'react';
import {
  Calendar,
  CalendarDays,
  CalendarRange,
  Clock,
  Laptop,
  LayoutGrid,
  Moon,
  Sun,
} from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedControl } from './segmented-control.js';

const meta = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  args: {
    options: [
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' },
    ],
    defaultValue: 'day',
    size: 'medium',
    disabled: false,
    'aria-label': 'Select period',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <SegmentedControl
        size="small"
        defaultValue="day"
        aria-label="Small period"
        options={[
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week' },
          { label: 'Month', value: 'month' },
        ]}
      />
      <SegmentedControl
        size="medium"
        defaultValue="day"
        aria-label="Medium period"
        options={[
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week' },
          { label: 'Month', value: 'month' },
        ]}
      />
      <SegmentedControl
        size="large"
        defaultValue="day"
        aria-label="Large period"
        options={[
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week' },
          { label: 'Month', value: 'month' },
        ]}
      />
    </div>
  ),
};

export const DifferentOptionCounts: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <SegmentedControl
        defaultValue="monthly"
        aria-label="Billing cycle"
        options={[
          { label: 'Monthly', value: 'monthly' },
          { label: 'Annually', value: 'annually' },
        ]}
      />
      <SegmentedControl
        defaultValue="overview"
        aria-label="Page section"
        options={[
          { label: 'Overview', value: 'overview' },
          { label: 'Features', value: 'features' },
          { label: 'Pricing', value: 'pricing' },
        ]}
      />
      <SegmentedControl
        defaultValue="m"
        aria-label="Product size"
        options={[
          { label: 'XS', value: 'xs' },
          { label: 'S', value: 's' },
          { label: 'M', value: 'm' },
          { label: 'L', value: 'l' },
          { label: 'XL', value: 'xl' },
        ]}
      />
    </div>
  ),
};

function ControlledDemo() {
  const [period, setPeriod] = useState('week');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <SegmentedControl
        value={period}
        onChange={setPeriod}
        aria-label="Controlled period selector"
        options={[
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week' },
          { label: 'Month', value: 'month' },
        ]}
      />
      <span
        style={{
          fontSize: '14px',
          color: 'var(--notable-color-text-muted)',
        }}
      >
        Selected value: {period}
      </span>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};

export const Uncontrolled: Story = {
  args: {
    defaultValue: 'month',
    'aria-label': 'Uncontrolled timeframe',
    options: [
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' },
    ],
  },
};

export const WithIcons: Story = {
  render: () => (
    <SegmentedControl
      defaultValue="system"
      aria-label="Theme mode"
      options={[
        { label: 'Light', value: 'light', icon: <Sun aria-hidden="true" /> },
        { label: 'Dark', value: 'dark', icon: <Moon aria-hidden="true" /> },
        {
          label: 'System',
          value: 'system',
          icon: <Laptop aria-hidden="true" />,
        },
      ]}
    />
  ),
};

export const IndividualDisabledOptions: Story = {
  args: {
    defaultValue: 'standard',
    'aria-label': 'Delivery tier',
    options: [
      { label: 'Standard', value: 'standard' },
      { label: 'Express', value: 'express', disabled: true },
      { label: 'Overnight', value: 'overnight' },
    ],
  },
};

export const EntireControlDisabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'week',
    'aria-label': 'Disabled period selector',
    options: [
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' },
    ],
  },
};

export const LongLabelsOrWiderLayout: Story = {
  render: () => (
    <div style={{ maxWidth: '640px', width: '100%' }}>
      <SegmentedControl
        defaultValue="recommended"
        aria-label="Filter products"
        style={{ width: '100%' }}
        options={[
          { label: 'Recommended for you', value: 'recommended' },
          { label: 'Customer rating: High to low', value: 'rating' },
          { label: 'Brand new arrivals only', value: 'newest' },
        ]}
      />
    </div>
  ),
};

function InteractivePeriodDemo() {
  const [period, setPeriod] = useState('week');

  return (
    <div style={{ display: 'grid', gap: '16px', maxWidth: '400px' }}>
      <SegmentedControl
        label="Analytics Timeframe"
        value={period}
        onChange={setPeriod}
        options={[
          {
            label: 'Day',
            value: 'day',
            icon: <Calendar aria-hidden="true" />,
          },
          {
            label: 'Week',
            value: 'week',
            icon: <CalendarDays aria-hidden="true" />,
          },
          {
            label: 'Month',
            value: 'month',
            icon: <CalendarRange aria-hidden="true" />,
          },
        ]}
      />
      <div
        style={{
          padding: '16px',
          borderRadius: 'var(--notable-radius-lg)',
          backgroundColor: 'var(--notable-color-surface-sunken)',
          border:
            'var(--notable-border-width) solid var(--notable-color-border-subtle)',
          fontSize: '14px',
        }}
      >
        Active timeframe view: <strong>{period}</strong>
      </div>
    </div>
  );
}

export const InteractivePeriodSelector: Story = {
  render: () => <InteractivePeriodDemo />,
};

function DraggableDemo() {
  const [period, setPeriod] = useState('week');

  return (
    <div style={{ display: 'grid', gap: '16px', maxWidth: '520px' }}>
      <SegmentedControl
        value={period}
        onChange={setPeriod}
        aria-label="Draggable timeframe"
        options={[
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week' },
          { label: 'Month', value: 'month' },
          { label: 'Year', value: 'year', disabled: true },
        ]}
      />
      <span
        style={{
          fontSize: '14px',
          color: 'var(--notable-color-text-muted)',
        }}
      >
        Selected timeframe: <strong>{period}</strong>
      </span>
      <span
        style={{
          fontSize: '12px',
          color: 'var(--notable-color-text-muted)',
        }}
      >
        Drag the selected indicator horizontally, or click an option.
      </span>
    </div>
  );
}

export const Draggable: Story = {
  render: () => <DraggableDemo />,
};

export const DifferentWidths: Story = {
  args: {
    defaultValue: 'week',
    options: [
      {
        value: 'day',
        label: 'Day',
        icon: <Sun size={16} />,
      },
      {
        value: 'week',
        label: 'This week',
        icon: <CalendarDays size={16} />,
      },
      {
        value: 'month',
        label: 'Month',
        icon: <CalendarRange size={16} />,
      },
      {
        value: 'year',
        label: 'All year',
        icon: <Clock size={16} />,
      },
      {
        value: 'all',
        label: 'Full history',
        icon: <LayoutGrid size={16} />,
      },
    ],
  },
};
