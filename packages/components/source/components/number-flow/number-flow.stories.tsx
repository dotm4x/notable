import { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button/button.js';
import { NumberFlow } from './number-flow.js';

const meta = {
  parameters: {
    layout: 'centered',
  },
  title: 'Components/NumberFlow',
  component: NumberFlow,
  tags: ['autodocs'],
  args: {
    value: 1234,
  },
  argTypes: {
    value: {
      control: 'number',
    },
    locale: {
      control: 'text',
    },
    duration: {
      control: { type: 'number', min: 0, step: 10 },
    },
  },
} satisfies Meta<typeof NumberFlow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default animated numeric display.',
      },
    },
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive number flow updating with increment and decrement buttons.',
      },
    },
  },
  render: function InteractiveRender() {
    const [value, setValue] = useState(42);

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Button
          variant="outline"
          size="icon"
          aria-label="Decrease value"
          onClick={() => setValue((current) => current - 1)}
        >
          <Minus aria-hidden="true" />
        </Button>
        <NumberFlow value={value} />
        <Button
          variant="outline"
          size="icon"
          aria-label="Increase value"
          onClick={() => setValue((current) => current + 1)}
        >
          <Plus aria-hidden="true" />
        </Button>
      </div>
    );
  },
};

export const Transitions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Smooth transitions between increasing and decreasing values.',
      },
    },
  },
  render: function IncreasingAndDecreasingRender() {
    const [value, setValue] = useState(100);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <NumberFlow value={value} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" onClick={() => setValue(99)}>
            To 99
          </Button>
          <Button variant="secondary" onClick={() => setValue(100)}>
            To 100
          </Button>
          <Button variant="secondary" onClick={() => setValue(9)}>
            To 9
          </Button>
          <Button variant="secondary" onClick={() => setValue(10)}>
            To 10
          </Button>
        </div>
      </div>
    );
  },
};

export const Negative: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Number flow handling negative values.',
      },
    },
  },
  args: {
    value: -248,
  },
};

export const Decimal: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Number flow formatting decimal numbers.',
      },
    },
  },
  args: {
    value: 3.14159,
    format: { maximumFractionDigits: 3 },
  },
};

export const Decimals: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Number flow supporting fixed fraction digits.',
      },
    },
  },
  args: {
    value: 12,
    format: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  },
};

export const Currency: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Number flow formatting currency values.',
      },
    },
  },
  args: {
    value: 1249.5,
    locale: 'en-US',
    format: { style: 'currency', currency: 'USD' },
  },
};

export const Percentage: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Number flow formatting percentage values.',
      },
    },
  },
  args: {
    value: 0.426,
    format: { style: 'percent' },
  },
};

export const Compact: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Number flow formatting large numbers with compact notation.',
      },
    },
  },
  args: {
    value: 1_250_000,
    format: { notation: 'compact', maximumFractionDigits: 1 },
  },
};

export const Locales: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Number flow supporting internationalized number formatting across locales.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <NumberFlow value={1234567.89} locale="en-US" />
      <NumberFlow value={1234567.89} locale="de-DE" />
      <NumberFlow value={1234567.89} locale="fr-FR" />
      <NumberFlow value={1234567.89} locale="en-IN" />
      <NumberFlow value={1234567.89} locale="ar-EG" />
    </div>
  ),
};

export const CurrencyLocale: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Currency formatting across different regional locales.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <NumberFlow
        value={980}
        locale="de-DE"
        format={{ style: 'currency', currency: 'EUR' }}
      />
      <NumberFlow
        value={980}
        locale="ja-JP"
        format={{ style: 'currency', currency: 'JPY' }}
      />
    </div>
  ),
};

export const Live: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Number flow reacting smoothly to rapid real-time value updates.',
      },
    },
  },
  render: function RapidUpdatesRender() {
    const [value, setValue] = useState(0);

    useEffect(() => {
      const interval = window.setInterval(() => {
        setValue((current) => current + 7);
      }, 50);

      return () => {
        window.clearInterval(interval);
      };
    }, []);

    return <NumberFlow value={value} />;
  },
};

export const Large: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Number flow handling large integer numbers.',
      },
    },
  },
  args: {
    value: 9_876_543_210,
  },
};

export const Duration: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Number flow with customized animation duration.',
      },
    },
  },
  args: {
    value: 5000,
    duration: 600,
  },
};

export const ReducedMotion: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When the operating system requests reduced motion, digits change immediately without rolling.',
      },
    },
  },
  args: {
    value: 2024,
  },
};
