import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRoot,
  MenuSeparator,
  MenuSubmenuRoot,
  MenuSubmenuTrigger,
  MenuTrigger,
} from './menu.js';

type RootMenuProps = {
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
};

function RootMenu({ onSelect, onOpenChange }: RootMenuProps) {
  return (
    <MenuRoot onOpenChange={onOpenChange}>
      <MenuTrigger render={<button type="button">Actions</button>} />
      <MenuPopup>
        <MenuGroup>
          <MenuGroupLabel>File</MenuGroupLabel>
          <MenuItem onClick={onSelect}>Rename</MenuItem>
          <MenuItem disabled onClick={onSelect}>
            Delete
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem onClick={onSelect}>Duplicate</MenuItem>
      </MenuPopup>
    </MenuRoot>
  );
}

type SubmenuMenuProps = {
  onSubmenuOpenChange?: (open: boolean) => void;
  submenuDisabled?: boolean;
  side?: 'left' | 'right';
};

function SubmenuMenu({
  onSubmenuOpenChange,
  submenuDisabled = false,
  side,
}: SubmenuMenuProps) {
  return (
    <MenuRoot>
      <MenuTrigger render={<button type="button">Actions</button>} />
      <MenuPopup>
        <MenuSubmenuRoot onOpenChange={onSubmenuOpenChange}>
          <MenuSubmenuTrigger disabled={submenuDisabled}>
            Move to
          </MenuSubmenuTrigger>
          <MenuPopup side={side}>
            <MenuItem>Inbox</MenuItem>
            <MenuItem>Archive</MenuItem>
          </MenuPopup>
        </MenuSubmenuRoot>
        <MenuItem>Duplicate</MenuItem>
      </MenuPopup>
    </MenuRoot>
  );
}

afterEach(() => {
  cleanup();
});

describe('Menu primitive', () => {
  describe('root menu', () => {
    it('opens from the trigger and renders items, groups, and separators', async () => {
      render(<RootMenu />);

      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));

      expect(await screen.findByRole('menu')).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeVisible();
      expect(screen.getByText('File')).toBeVisible();
      expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('calls the item handler and closes the menu when an enabled item is activated', async () => {
      const onSelect = vi.fn();
      render(<RootMenu onSelect={onSelect} />);
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));

      await userEvent.click(
        await screen.findByRole('menuitem', { name: 'Rename' }),
      );

      expect(onSelect).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('does not activate a disabled item', async () => {
      const onSelect = vi.fn();
      render(<RootMenu onSelect={onSelect} />);
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));

      await userEvent.click(
        await screen.findByRole('menuitem', { name: 'Delete' }),
      );

      expect(onSelect).not.toHaveBeenCalled();
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('closes on Escape and reports the open change', async () => {
      const onOpenChange = vi.fn();
      render(<RootMenu onOpenChange={onOpenChange} />);
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      await screen.findByRole('menu');

      await userEvent.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });

    it('moves focus through items with arrow keys, including disabled items', async () => {
      render(<RootMenu />);
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      const rename = await screen.findByRole('menuitem', { name: 'Rename' });
      rename.focus();

      await userEvent.keyboard('{ArrowDown}');
      expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();

      await userEvent.keyboard('{ArrowDown}');
      expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
    });

    it('moves focus to the first and last enabled items with Home and End', async () => {
      render(<RootMenu />);
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      const duplicate = await screen.findByRole('menuitem', {
        name: 'Duplicate',
      });
      duplicate.focus();

      await userEvent.keyboard('{Home}');
      expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();

      await userEvent.keyboard('{End}');
      expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
    });

    it('places the root popup at the bottom edge by default', async () => {
      render(<RootMenu />);
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));

      const menu = await screen.findByRole('menu');

      expect(menu.closest('[data-side]')).toHaveAttribute(
        'data-side',
        'bottom',
      );
    });
  });

  describe('submenu interaction', () => {
    it('opens the submenu when its trigger is clicked', async () => {
      render(<SubmenuMenu />);
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));

      await userEvent.click(
        await screen.findByRole('menuitem', { name: 'Move to' }),
      );

      expect(
        await screen.findByRole('menuitem', { name: 'Inbox' }),
      ).toBeVisible();
    });

    it('opens the submenu with ArrowRight and focuses its first item', async () => {
      render(<SubmenuMenu />);
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      const trigger = await screen.findByRole('menuitem', { name: 'Move to' });
      trigger.focus();

      await userEvent.keyboard('{ArrowRight}');

      expect(
        await screen.findByRole('menuitem', { name: 'Inbox' }),
      ).toHaveFocus();
    });

    it('closes the whole menu when a submenu item is activated', async () => {
      render(<SubmenuMenu />);
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      await userEvent.click(
        await screen.findByRole('menuitem', { name: 'Move to' }),
      );

      await userEvent.click(
        await screen.findByRole('menuitem', { name: 'Inbox' }),
      );

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('does not open a disabled submenu trigger', async () => {
      render(<SubmenuMenu submenuDisabled />);
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));

      await userEvent.click(
        await screen.findByRole('menuitem', { name: 'Move to' }),
      );

      expect(
        screen.queryByRole('menuitem', { name: 'Inbox' }),
      ).not.toBeInTheDocument();
    });

    it('reports submenu open changes through onOpenChange', async () => {
      const onSubmenuOpenChange = vi.fn();
      render(<SubmenuMenu onSubmenuOpenChange={onSubmenuOpenChange} />);
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      await userEvent.click(
        await screen.findByRole('menuitem', { name: 'Move to' }),
      );

      await screen.findByRole('menuitem', { name: 'Inbox' });

      expect(onSubmenuOpenChange).toHaveBeenLastCalledWith(true);
    });
  });

  describe('submenu placement', () => {
    it('opens to the inline end by default', async () => {
      render(<SubmenuMenu />);
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      await userEvent.click(
        await screen.findByRole('menuitem', { name: 'Move to' }),
      );
      const inbox = await screen.findByRole('menuitem', { name: 'Inbox' });

      expect(inbox.closest('[data-side]')).toHaveAttribute(
        'data-side',
        'inline-end',
      );
    });
  });

  describe('selectable items', () => {
    function SelectableMenu({
      onCheckedChange,
      onValueChange,
    }: {
      onCheckedChange?: (checked: boolean) => void;
      onValueChange?: (value: string) => void;
    }) {
      return (
        <MenuRoot>
          <MenuTrigger render={<button type="button">View</button>} />
          <MenuPopup>
            <MenuCheckboxItem defaultChecked onCheckedChange={onCheckedChange}>
              Show hidden
            </MenuCheckboxItem>
            <MenuRadioGroup defaultValue="list" onValueChange={onValueChange}>
              <MenuRadioItem value="list">List</MenuRadioItem>
              <MenuRadioItem value="grid">Grid</MenuRadioItem>
            </MenuRadioGroup>
          </MenuPopup>
        </MenuRoot>
      );
    }

    it('exposes checkbox items with their checked state', async () => {
      render(<SelectableMenu />);
      await userEvent.click(screen.getByRole('button', { name: 'View' }));

      const checkbox = await screen.findByRole('menuitemcheckbox', {
        name: 'Show hidden',
      });

      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });

    it('toggles a checkbox item and reports the new state', async () => {
      const onCheckedChange = vi.fn();
      render(<SelectableMenu onCheckedChange={onCheckedChange} />);
      await userEvent.click(screen.getByRole('button', { name: 'View' }));

      await userEvent.click(
        await screen.findByRole('menuitemcheckbox', { name: 'Show hidden' }),
      );

      expect(onCheckedChange).toHaveBeenCalledWith(false, expect.anything());
    });

    it('selects a radio item and reports the new value', async () => {
      const onValueChange = vi.fn();
      render(<SelectableMenu onValueChange={onValueChange} />);
      await userEvent.click(screen.getByRole('button', { name: 'View' }));

      await userEvent.click(
        await screen.findByRole('menuitemradio', { name: 'Grid' }),
      );

      expect(onValueChange).toHaveBeenCalledWith('grid', expect.anything());
    });

    it('keeps the checkbox indicator mounted so its state change can animate', async () => {
      render(<SelectableMenu />);
      await userEvent.click(screen.getByRole('button', { name: 'View' }));
      const checkbox = await screen.findByRole('menuitemcheckbox', {
        name: 'Show hidden',
      });
      const indicator = checkbox.querySelector('.notable-menu__item-indicator');

      await userEvent.click(checkbox);

      expect(indicator).toHaveAttribute('data-unchecked');
      expect(checkbox.querySelector('.notable-menu__item-indicator')).toBe(
        indicator,
      );
    });

    it('marks only the current radio item as checked', async () => {
      render(<SelectableMenu />);
      await userEvent.click(screen.getByRole('button', { name: 'View' }));

      const list = await screen.findByRole('menuitemradio', { name: 'List' });
      const grid = screen.getByRole('menuitemradio', { name: 'Grid' });

      expect(list).toHaveAttribute('aria-checked', 'true');
      expect(grid).toHaveAttribute('aria-checked', 'false');
    });
  });
});
