import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../button/button.js';
import { Select } from '../select/select.js';
import {
  createToastController,
  toast,
  ToastProvider,
  type ToastPosition,
} from './toast.js';

const meta = {
  parameters: {
    layout: 'centered',
  },
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
} satisfies Meta<typeof ToastProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

function ToastExamples() {
  const [position, setPosition] = useState<ToastPosition>('bottom-right');
  const [variant, setVariant] = useState<string>('default');

  const handleSendToast = () => {
    switch (variant) {
      case 'success':
        toast.success('Changes saved successfully.');
        break;
      case 'error':
        toast.error('Could not save changes.');
        break;
      case 'warning':
        toast.warning('Your session is about to expire.');
        break;
      case 'info':
        toast.info('A new software update is available.');
        break;
      default:
        toast('This is a default notification message.');
        break;
    }
  };

  return (
    <ToastProvider position={position}>
      <div
        style={{
          display: 'grid',
          gap: '1.5rem',
          width: '20rem',
          justifyItems: 'center',
        }}
      >
        <div style={{ width: '100%', display: 'grid', gap: '1rem' }}>
          <Select.Root
            value={position}
            onValueChange={(val) => val && setPosition(val as ToastPosition)}
          >
            <Select.Label>Position</Select.Label>
            <Select.Trigger>
              <Select.Value placeholder="Select position" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Content>
              <Select.List>
                <Select.Item value="top-left">Top Left</Select.Item>
                <Select.Item value="top-center">Top Center</Select.Item>
                <Select.Item value="top-right">Top Right</Select.Item>
                <Select.Item value="bottom-left">Bottom Left</Select.Item>
                <Select.Item value="bottom-center">Bottom Center</Select.Item>
                <Select.Item value="bottom-right">Bottom Right</Select.Item>
              </Select.List>
            </Select.Content>
          </Select.Root>

          <Select.Root
            value={variant}
            onValueChange={(val) => val && setVariant(val)}
          >
            <Select.Label>Message type</Select.Label>
            <Select.Trigger>
              <Select.Value placeholder="Select message type" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Content>
              <Select.List>
                <Select.Item value="default">Default</Select.Item>
                <Select.Item value="success">Success</Select.Item>
                <Select.Item value="error">Error</Select.Item>
                <Select.Item value="warning">Warning</Select.Item>
                <Select.Item value="info">Info</Select.Item>
              </Select.List>
            </Select.Content>
          </Select.Root>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Button variant="primary" onClick={handleSendToast}>
            Send toast
          </Button>
          <Button variant="outline" onClick={() => toast.dismiss()}>
            Dismiss all
          </Button>
        </div>
      </div>
    </ToastProvider>
  );
}

function ProviderConfiguration() {
  return (
    <ToastProvider position="top-center" defaultDuration={0} maxToasts={2}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button onClick={() => toast('This notification stays visible.')}>
          Persistent default
        </Button>
        <Button
          onClick={() =>
            toast({
              title: 'Per-notification duration',
              description: 'This one dismisses after one second.',
              duration: 1000,
            })
          }
        >
          Override duration
        </Button>
      </div>
    </ToastProvider>
  );
}

function MultipleRootsExample() {
  const [left] = useState(createToastController);
  const [right] = useState(createToastController);

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <ToastProvider controller={left}>
        <Button onClick={() => left.toast.success('Toast in the first root')}>
          First root
        </Button>
      </ToastProvider>
      <ToastProvider controller={right} position="top-left">
        <Button onClick={() => right.toast.info('Toast in the second root')}>
          Second root
        </Button>
      </ToastProvider>
    </div>
  );
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive toast notifications demonstrating success, error, warning, info, and actions.',
      },
    },
  },
  render: () => <ToastExamples />,
};

export const MultipleRoots: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Multiple independent toast provider roots operating simultaneously.',
      },
    },
  },
  render: () => <MultipleRootsExample />,
};

export const Configuration: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Toast provider customized with default duration and maximum toast limits.',
      },
    },
  },
  render: () => <ProviderConfiguration />,
};
