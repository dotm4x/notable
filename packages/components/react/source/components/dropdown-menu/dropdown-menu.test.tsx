import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Shortcut } from '../shortcut/shortcut.js';
import { DropdownMenu } from './dropdown-menu.js';

function BasicDropdownMenu(props: {
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <DropdownMenu.Root onOpenChange={props.onOpenChange}>
      <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.GroupLabel>File</DropdownMenu.GroupLabel>
          <DropdownMenu.Item onClick={props.onSelect}>
            Rename
            <Shortcut>F2</Shortcut>
          </DropdownMenu.Item>
          <DropdownMenu.Item disabled onClick={props.onSelect}>
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={props.onSelect}>
          Duplicate
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

function ControlledDropdownMenu({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open externally
      </button>
      <DropdownMenu.Root
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          onOpenChange(nextOpen);
        }}
      >
        <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Rename</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
}

afterEach(() => {
  cleanup();
});

describe('DropdownMenu', () => {
  it('opens the menu from a button trigger and lists its items', async () => {
    // Arrange
    render(<BasicDropdownMenu />);

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));

    // Assert
    const menu = await screen.findByRole('menu');
    expect(menu).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Rename/ })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toBeVisible();
  });

  it('renders the group label and separator as menu structure', async () => {
    // Arrange
    render(<BasicDropdownMenu />);

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));

    // Assert
    expect(await screen.findByRole('separator')).toBeInTheDocument();
    expect(screen.getByText('File')).toBeVisible();
  });

  it('calls the item handler and closes the menu when an item is activated', async () => {
    // Arrange
    const onSelect = vi.fn();
    render(<BasicDropdownMenu onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));

    // Act
    await userEvent.click(
      await screen.findByRole('menuitem', { name: /Rename/ }),
    );

    // Assert
    expect(onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('does not activate a disabled item', async () => {
    // Arrange
    const onSelect = vi.fn();
    render(<BasicDropdownMenu onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));

    // Act
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Delete' }),
    );

    // Assert
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('moves focus with arrow keys, keeping disabled items focusable', async () => {
    // Arrange
    render(<BasicDropdownMenu />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    const rename = await screen.findByRole('menuitem', { name: /Rename/ });
    rename.focus();

    // Act
    await userEvent.keyboard('{ArrowDown}');

    // Assert
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );

    // Act
    await userEvent.keyboard('{ArrowDown}');

    // Assert
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
  });

  it('moves focus to the first and last items with Home and End', async () => {
    // Arrange
    render(<BasicDropdownMenu />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    const duplicate = await screen.findByRole('menuitem', {
      name: 'Duplicate',
    });
    duplicate.focus();

    // Act
    await userEvent.keyboard('{Home}');

    // Assert
    expect(screen.getByRole('menuitem', { name: /Rename/ })).toHaveFocus();

    // Act
    await userEvent.keyboard('{End}');

    // Assert
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
  });

  it('closes on Escape and reports the change through onOpenChange', async () => {
    // Arrange
    const onOpenChange = vi.fn();
    render(<BasicDropdownMenu onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    await screen.findByRole('menu');

    // Act
    await userEvent.keyboard('{Escape}');

    // Assert
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('opens when the controlled open state changes externally', async () => {
    // Arrange
    const onOpenChange = vi.fn();
    render(<ControlledDropdownMenu onOpenChange={onOpenChange} />);

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Open externally' }),
    );

    // Assert
    expect(await screen.findByRole('menu')).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('uses a child element as the trigger instead of wrapping it in a button', async () => {
    // Arrange
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <span data-testid="custom-trigger">Custom</span>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Rename</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );

    // Act
    await userEvent.click(screen.getByTestId('custom-trigger'));

    // Assert
    expect(await screen.findByRole('menu')).toBeInTheDocument();
    expect(screen.getByTestId('custom-trigger').closest('button')).toBeNull();
  });
});
