import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, FormEvent } from 'react';
import { useId, useState } from 'react';
import { Button } from '../button/button.js';
import { Input } from '../input/input.js';
import { Drawer, type DrawerSide, type DrawerSize } from './drawer.js';

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

const sides: readonly DrawerSide[] = ['right', 'left', 'top', 'bottom'];
const sizes: readonly DrawerSize[] = ['small', 'medium', 'large'];

const sideLabels: Record<DrawerSide, string> = {
  right: 'Right',
  left: 'Left',
  top: 'Top',
  bottom: 'Bottom',
};

const rowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  alignItems: 'center',
};

const stackStyle: CSSProperties = {
  display: 'grid',
  gap: '0.75rem',
  justifyItems: 'start',
  margin: 0,
};

const formStackStyle: CSSProperties = {
  display: 'grid',
  gap: '1rem',
  margin: 0,
};

const demoPanelStyle: CSSProperties = {
  display: 'grid',
  gap: '0.75rem',
};

function SideDrawer({ side }: { side: DrawerSide }) {
  return (
    <Drawer side={side}>
      <Drawer.Trigger>
        <Button variant="outline">{sideLabels[side]} drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>{sideLabels[side]} drawer</Drawer.Title>
          <Drawer.Description>
            This drawer slides in from the {side} edge of the viewport.
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Footer>
          <Drawer.Close>Done</Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
}

function SizeDrawer({ size }: { size: DrawerSize }) {
  return (
    <Drawer>
      <Drawer.Trigger>
        <Button variant="outline">{size} drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content size={size}>
        <Drawer.Header>
          <Drawer.Title>{size} drawer</Drawer.Title>
          <Drawer.Description>
            Sizes set the width of right and left drawers and the height of top
            and bottom drawers.
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Footer>
          <Drawer.Close>Done</Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
}

function ControlledDrawer() {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState(
    'The drawer has not been opened yet.',
  );

  return (
    <div style={stackStyle}>
      <p style={{ margin: 0 }}>{lastAction}</p>
      <Drawer
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          setLastAction(
            nextOpen
              ? 'The drawer was opened by the parent.'
              : 'The drawer was closed by the parent.',
          );
        }}
      >
        <Drawer.Trigger>
          <Button>Open controlled drawer</Button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Controlled drawer</Drawer.Title>
            <Drawer.Description>
              The parent owns the open state and reacts to every change request.
            </Drawer.Description>
          </Drawer.Header>
          <Drawer.Footer>
            <Drawer.Close>Close</Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </div>
  );
}

function FormDrawer() {
  const formId = useId();
  const [status, setStatus] = useState('No changes saved yet.');
  const [projectName, setProjectName] = useState('Notable');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(`Saved project "${projectName.trim() || 'Untitled'}".`);
  };

  return (
    <div style={stackStyle}>
      <p style={{ margin: 0 }}>{status}</p>
      <Drawer>
        <Drawer.Trigger>
          <Button>Edit project</Button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Edit project</Drawer.Title>
            <Drawer.Description>
              Rename the project and choose how it is shared.
            </Drawer.Description>
          </Drawer.Header>
          <form id={formId} onSubmit={handleSubmit} style={formStackStyle}>
            <Input
              label="Project name"
              name="projectName"
              value={projectName}
              onChange={(event) => {
                setProjectName(event.target.value);
              }}
              required
            />
            <Input
              label="Owner email"
              name="ownerEmail"
              type="email"
              placeholder="you@example.com"
            />
          </form>
          <Drawer.Footer>
            <Drawer.Close>Cancel</Drawer.Close>
            <Button type="submit" form={formId} variant="primary">
              Save changes
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </div>
  );
}

function NestedDrawers() {
  return (
    <Drawer>
      <Drawer.Trigger>
        <Button>Open project settings</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Project settings</Drawer.Title>
          <Drawer.Description>
            Review access for this project. Each level opens above the one
            before it.
          </Drawer.Description>
        </Drawer.Header>
        <div style={demoPanelStyle}>
          <p style={{ margin: 0 }}>Visibility: private to the workspace.</p>
          <Drawer side="right">
            <Drawer.Trigger>
              <Button variant="outline">Manage members</Button>
            </Drawer.Trigger>
            <Drawer.Content size="small">
              <Drawer.Header>
                <Drawer.Title>Members</Drawer.Title>
                <Drawer.Description>
                  Three people can edit this project.
                </Drawer.Description>
              </Drawer.Header>
              <div style={demoPanelStyle}>
                <p style={{ margin: 0 }}>Ada Lovelace, owner</p>
                <p style={{ margin: 0 }}>Grace Hopper, editor</p>
                <p style={{ margin: 0 }}>Katherine Johnson, viewer</p>
                <Drawer side="bottom">
                  <Drawer.Trigger>
                    <Button variant="secondary">Invite someone</Button>
                  </Drawer.Trigger>
                  <Drawer.Content>
                    <Drawer.Header>
                      <Drawer.Title>Invite a member</Drawer.Title>
                      <Drawer.Description>
                        Invitations expire after seven days.
                      </Drawer.Description>
                    </Drawer.Header>
                    <Input
                      label="Email address"
                      name="inviteEmail"
                      type="email"
                      placeholder="you@example.com"
                    />
                    <Drawer.Footer>
                      <Drawer.Close>Cancel</Drawer.Close>
                      <Drawer.Close variant="primary">Send invite</Drawer.Close>
                    </Drawer.Footer>
                  </Drawer.Content>
                </Drawer>
              </div>
              <Drawer.Footer>
                <Drawer.Close>Done</Drawer.Close>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer>
        </div>
        <Drawer.Footer>
          <Drawer.Close>Close settings</Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
}

export const Default: Story = {
  render: () => (
    <Drawer>
      <Drawer.Trigger>
        <Button>Open drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Share project</Drawer.Title>
          <Drawer.Description>
            Anyone with the link can view this project. You can revoke access at
            any time.
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Footer>
          <Drawer.Close>Done</Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  ),
};

export const Sides: Story = {
  render: () => (
    <div style={rowStyle}>
      {sides.map((side) => (
        <SideDrawer key={side} side={side} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={rowStyle}>
      {sizes.map((size) => (
        <SizeDrawer key={size} size={size} />
      ))}
    </div>
  ),
};

export const Scrollable: Story = {
  render: () => (
    <Drawer>
      <Drawer.Trigger>
        <Button variant="outline">Read terms</Button>
      </Drawer.Trigger>
      <Drawer.Content size="large">
        <Drawer.Header>
          <Drawer.Title>Terms of service</Drawer.Title>
          <Drawer.Description>
            The header and footer stay in view while the sections scroll.
          </Drawer.Description>
        </Drawer.Header>
        {Array.from({ length: 16 }, (_, index) => (
          <p key={index} style={{ margin: 0 }}>
            Section {index + 1}: Access to the service is granted for the
            duration of your subscription. You are responsible for keeping your
            credentials secure and for all activity that occurs under your
            account.
          </p>
        ))}
        <Drawer.Footer>
          <Drawer.Close>Decline</Drawer.Close>
          <Button variant="primary">Accept</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  ),
};

export const Form: Story = {
  render: () => <FormDrawer />,
};

export const Nested: Story = {
  render: () => <NestedDrawers />,
};

export const Controlled: Story = {
  render: () => <ControlledDrawer />,
};

export const CustomContent: Story = {
  render: () => (
    <Drawer side="left">
      <Drawer.Trigger>
        <Button variant="secondary">Open activity</Button>
      </Drawer.Trigger>
      <Drawer.Content size="small" closeOnBackdropClick={false}>
        <Drawer.Header>
          <Drawer.Title>Recent activity</Drawer.Title>
          <Drawer.Description>
            Backdrop clicks are disabled for this drawer. Use Escape or a button
            to dismiss it.
          </Drawer.Description>
        </Drawer.Header>
        <div style={demoPanelStyle}>
          <p style={{ margin: 0 }}>Project renamed to Notable.</p>
          <p style={{ margin: 0 }}>Design tokens updated.</p>
          <p style={{ margin: 0 }}>Drawer component added.</p>
        </div>
        <Drawer.Footer>
          <Drawer.Close variant="outline">Dismiss</Drawer.Close>
          <Button variant="primary">View all</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  ),
};
