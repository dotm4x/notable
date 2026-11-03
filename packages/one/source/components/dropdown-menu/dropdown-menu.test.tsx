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

  describe('submenus', () => {
    function NestedDropdownMenu(props: { onSelect?: () => void }) {
      return (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Rename</DropdownMenu.Item>
            <DropdownMenu.Submenu>
              <DropdownMenu.SubmenuTrigger>Move to</DropdownMenu.SubmenuTrigger>
              <DropdownMenu.Content side="right">
                <DropdownMenu.Item onClick={props.onSelect}>
                  Archive
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={props.onSelect}>
                  Trash
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Submenu>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      );
    }

    it('opens the submenu when its trigger is clicked', async () => {
      // Arrange
      render(<NestedDropdownMenu />);
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));

      // Act
      await userEvent.click(
        await screen.findByRole('menuitem', { name: /Move to/ }),
      );

      // Assert
      expect(
        await screen.findByRole('menuitem', { name: 'Archive' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: 'Trash' }),
      ).toBeInTheDocument();
    });

    it('closes the whole menu when a submenu item is activated', async () => {
      // Arrange
      const onSelect = vi.fn();
      render(<NestedDropdownMenu onSelect={onSelect} />);
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      await userEvent.click(
        await screen.findByRole('menuitem', { name: /Move to/ }),
      );

      // Act
      await userEvent.click(
        await screen.findByRole('menuitem', { name: 'Archive' }),
      );

      // Assert
      expect(onSelect).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('does not open a disabled submenu', async () => {
      // Arrange
      render(
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Submenu>
              <DropdownMenu.SubmenuTrigger disabled>
                Move to
              </DropdownMenu.SubmenuTrigger>
              <DropdownMenu.Content side="right">
                <DropdownMenu.Item>Archive</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Submenu>
          </DropdownMenu.Content>
        </DropdownMenu.Root>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));

      // Act
      await userEvent.click(
        await screen.findByRole('menuitem', { name: /Move to/ }),
      );

      // Assert
      expect(
        screen.queryByRole('menuitem', { name: 'Archive' }),
      ).not.toBeInTheDocument();
    });

    it('reports submenu open changes through onOpenChange', async () => {
      // Arrange
      const onOpenChange = vi.fn();
      render(
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Submenu onOpenChange={onOpenChange}>
              <DropdownMenu.SubmenuTrigger>Move to</DropdownMenu.SubmenuTrigger>
              <DropdownMenu.Content side="right">
                <DropdownMenu.Item>Archive</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Submenu>
          </DropdownMenu.Content>
        </DropdownMenu.Root>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));

      // Act
      await userEvent.click(
        await screen.findByRole('menuitem', { name: /Move to/ }),
      );

      // Assert
      expect(
        await screen.findByRole('menuitem', { name: 'Archive' }),
      ).toBeInTheDocument();
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('checkbox and radio items', () => {
    it('toggles an uncontrolled checkbox item and keeps the menu open', async () => {
      const onCheckedChange = vi.fn();
      render(
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.CheckboxItem
              defaultChecked
              onCheckedChange={onCheckedChange}
            >
              Show hidden files
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      const item = await screen.findByRole('menuitemcheckbox', {
        name: 'Show hidden files',
      });
      expect(item).toHaveAttribute('aria-checked', 'true');

      await userEvent.click(item);

      expect(onCheckedChange).toHaveBeenCalledWith(false);
      expect(item).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('reflects the controlled checked state of a checkbox item', async () => {
      const onCheckedChange = vi.fn();
      render(
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.CheckboxItem
              checked={false}
              onCheckedChange={onCheckedChange}
            >
              Wrap lines
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      const item = await screen.findByRole('menuitemcheckbox', {
        name: 'Wrap lines',
      });

      await userEvent.click(item);

      expect(onCheckedChange).toHaveBeenCalledWith(true);
      expect(item).toHaveAttribute('aria-checked', 'false');
    });

    it('does not toggle a disabled checkbox item', async () => {
      const onCheckedChange = vi.fn();
      render(
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.CheckboxItem
              disabled
              onCheckedChange={onCheckedChange}
            >
              Locked option
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Root>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));

      await userEvent.click(
        await screen.findByRole('menuitemcheckbox', { name: 'Locked option' }),
      );

      expect(onCheckedChange).not.toHaveBeenCalled();
    });

    it('selects one radio item at a time and keeps the menu open', async () => {
      const onValueChange = vi.fn();
      render(
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>Sort</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.RadioGroup
              defaultValue="name"
              onValueChange={onValueChange}
            >
              <DropdownMenu.RadioItem value="name">Name</DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="date">Date</DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Root>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Sort' }));
      const nameItem = await screen.findByRole('menuitemradio', {
        name: 'Name',
      });
      const dateItem = screen.getByRole('menuitemradio', { name: 'Date' });
      expect(nameItem).toHaveAttribute('aria-checked', 'true');

      await userEvent.click(dateItem);

      expect(onValueChange).toHaveBeenCalledWith('date');
      expect(dateItem).toHaveAttribute('aria-checked', 'true');
      expect(nameItem).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('follows the controlled value of a radio group', async () => {
      function ControlledRadioMenu() {
        const [value, setValue] = useState('name');
        return (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>Sort</DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.RadioGroup value={value} onValueChange={setValue}>
                <DropdownMenu.RadioItem value="name">
                  Name
                </DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value="date">
                  Date
                </DropdownMenu.RadioItem>
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        );
      }
      render(<ControlledRadioMenu />);
      await userEvent.click(screen.getByRole('button', { name: 'Sort' }));

      await userEvent.click(
        await screen.findByRole('menuitemradio', { name: 'Date' }),
      );

      expect(
        screen.getByRole('menuitemradio', { name: 'Date' }),
      ).toHaveAttribute('aria-checked', 'true');
    });
  });
});
