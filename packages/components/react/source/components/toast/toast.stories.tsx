import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Info } from 'lucide-react';
import { Button } from '../button/button.js';
import {
  createToastController,
  toast,
  ToastProvider,
  type ToastPosition,
} from './toast.js';

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
} satisfies Meta<typeof ToastProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

function ToastExamples() {
  const [position, setPosition] = useState<ToastPosition>('bottom-right');

  return (
    <ToastProvider position={position}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <Button onClick={() => toast('This is a default notification.')}>
          Default
        </Button>
        <Button onClick={() => toast.success('Changes saved.')}>Success</Button>
        <Button onClick={() => toast.error('Could not save changes.')}>
          Error
        </Button>
        <Button onClick={() => toast.warning('Your session is expiring.')}>
          Warning
        </Button>
        <Button onClick={() => toast.info('A new version is available.')}>
          Info
        </Button>
        <Button
          onClick={() =>
            toast({
              title: 'Deployment complete',
              description: 'Your application is now available.',
              variant: 'success',
              duration: 0,
              action: {
                label: 'View',
                onClick: () => toast('Opening deployment details.'),
              },
            })
          }
        >
          Title, description & action
        </Button>
        <Button
          onClick={() =>
            toast({
              title: 'No icon',
              description: 'Icons can be hidden when they are not needed.',
              icon: null,
            })
          }
        >
          Hidden icon
        </Button>
        <Button
          onClick={() =>
            toast({
              title: 'Custom icon',
              description: 'The icon can be replaced with a React node.',
              icon: <Info aria-hidden="true" />,
            })
          }
        >
          Custom icon
        </Button>
        <Button
          onClick={() =>
            toast.custom((id) => (
              <div>
                <strong>Custom notification</strong>
                <p style={{ margin: '8px 0' }}>
                  Arbitrary React content can be rendered here.
                </p>
                <Button onClick={() => toast.dismiss(id)}>Dismiss</Button>
              </div>
            ))
          }
        >
          Custom content
        </Button>
        <Button
          onClick={() =>
            toast.promise(new Promise((resolve) => setTimeout(resolve, 1200)), {
              loading: 'Publishing...',
              success: 'Project published.',
              error: 'Could not publish the project.',
            })
          }
        >
          Promise transition
        </Button>
        <Button onClick={() => toast.loading('This stays until dismissed.')}>
          Persistent loading
        </Button>
        <Button
          onClick={() =>
            toast({
              title: 'A long description',
              description:
                'This notification demonstrates wrapping for a detailed message that should remain readable at narrow viewport widths without overflowing the page.',
            })
          }
        >
          Long description
        </Button>
        <label>
          Position{' '}
          <select
            value={position}
            onChange={(event) =>
              setPosition(event.currentTarget.value as ToastPosition)
            }
          >
            {[
              'top-left',
              'top-center',
              'top-right',
              'bottom-left',
              'bottom-center',
              'bottom-right',
            ].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <Button onClick={() => toast.dismiss()}>Dismiss all</Button>
        <Button
          onClick={() => {
            for (let index = 1; index <= 4; index += 1) {
              toast(`Stacked notification ${index}`);
            }
          }}
        >
          Stack notifications
        </Button>
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

function MultipleRoots() {
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

export const Interactive: Story = {
  render: () => <ToastExamples />,
};

export const MultipleIndependentRoots: Story = {
  render: () => <MultipleRoots />,
};

export const ProviderConfigurationStory: Story = {
  render: () => <ProviderConfiguration />,
};
