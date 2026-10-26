import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Button } from '../button/button.js';
import { Input } from '../input/input.js';
import { Dialog, type DialogSize } from './dialog.js';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledDialog() {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState(
    'Dialog has not been opened yet.',
  );

  return (
    <div style={{ display: 'grid', gap: '1rem', justifyItems: 'start' }}>
      <p style={{ margin: 0 }}>{lastAction}</p>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          setLastAction(
            nextOpen
              ? 'Dialog opened by the parent.'
              : 'Dialog closed by the parent.',
          );
        }}
      >
        <Dialog.Trigger>
          <Button>Open controlled dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Controlled dialog</Dialog.Title>
            <Dialog.Description>
              The parent owns the open state and reacts to every change request.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}

function ConfirmationDialog() {
  const [status, setStatus] = useState('No project deleted yet.');

  return (
    <div style={{ display: 'grid', gap: '1rem', justifyItems: 'start' }}>
      <p style={{ margin: 0 }}>{status}</p>
      <Dialog>
        <Dialog.Trigger>
          <Button variant="danger">Delete project</Button>
        </Dialog.Trigger>
        <Dialog.Content size="small">
          <Dialog.Header>
            <Dialog.Title>Delete project?</Dialog.Title>
            <Dialog.Description>
              This action cannot be undone. All files in the project will be
              removed.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Dialog.Close>Cancel</Dialog.Close>
            <Button
              variant="danger"
              onClick={() => {
                setStatus('Project deleted.');
              }}
            >
              Delete
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}

function FormDialog() {
  const [savedName, setSavedName] = useState('');

  return (
    <div style={{ display: 'grid', gap: '1rem', justifyItems: 'start' }}>
      <p style={{ margin: 0 }}>
        {savedName ? `Saved project: ${savedName}` : 'No project saved yet.'}
      </p>
      <Dialog>
        <Dialog.Trigger>
          <Button variant="secondary">Rename project</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              setSavedName(String(formData.get('projectName') ?? ''));
            }}
          >
            <Dialog.Header>
              <Dialog.Title>Rename project</Dialog.Title>
              <Dialog.Description>
                Choose a name that is easy to recognize in your workspace.
              </Dialog.Description>
            </Dialog.Header>
            <Input
              label="Project name"
              name="projectName"
              defaultValue="Quarterly report"
              required
            />
            <Dialog.Footer>
              <Dialog.Close>Cancel</Dialog.Close>
              <Button type="submit">Save</Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}

const sizes: DialogSize[] = ['small', 'medium', 'large'];

export const Default: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>
        <Button>Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Share project</Dialog.Title>
          <Dialog.Description>
            Anyone with the link can view this project. You can revoke access at
            any time.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Close>Done</Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
};

export const Confirmation: Story = {
  render: () => <ConfirmationDialog />,
};

export const Form: Story = {
  render: () => <FormDialog />,
};

export const LargeScrollable: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>
        <Button variant="outline">Read terms</Button>
      </Dialog.Trigger>
      <Dialog.Content size="large">
        <Dialog.Header>
          <Dialog.Title>Terms of service</Dialog.Title>
          <Dialog.Description>
            Review the full agreement before continuing.
          </Dialog.Description>
        </Dialog.Header>
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index} style={{ margin: 0 }}>
            Section {index + 1}: Access to the service is granted for the
            duration of your subscription. You are responsible for keeping your
            credentials secure and for all activity that occurs under your
            account.
          </p>
        ))}
        <Dialog.Footer>
          <Dialog.Close variant="outline">Decline</Dialog.Close>
          <Dialog.Close variant="primary">Accept</Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {sizes.map((size) => (
        <Dialog key={size}>
          <Dialog.Trigger>
            <Button variant="outline">{size}</Button>
          </Dialog.Trigger>
          <Dialog.Content size={size}>
            <Dialog.Header>
              <Dialog.Title>{`${size[0].toUpperCase()}${size.slice(1)} dialog`}</Dialog.Title>
              <Dialog.Description>
                This dialog uses the {size} width.
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Footer>
              <Dialog.Close>Close</Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      ))}
    </div>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>
        <Button variant="secondary">Open styled dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content
        style={
          {
            '--notable-dialog-width': '40rem',
            backgroundColor: 'var(--notable-color-primary)',
            color: 'var(--notable-color-on-primary)',
          } as CSSProperties
        }
      >
        <Dialog.Header>
          <Dialog.Title>Custom styling</Dialog.Title>
          <Dialog.Description>
            Width and colors are set through Notable CSS custom properties.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
};

export const Controlled: Story = {
  render: () => <ControlledDialog />,
};
