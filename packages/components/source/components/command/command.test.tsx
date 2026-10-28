import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Command, type CommandItem } from './command.js';

function createItems(onSelect: () => void = () => {}): CommandItem[] {
  return [
    {
      value: 'new-note',
      label: 'New note',
      description: 'Create a blank note',
      keywords: ['create'],
      shortcut: ['Mod', 'N'],
      onSelect,
    },
    { value: 'open-settings', label: 'Open settings', onSelect },
    { value: 'archive', label: 'Archive note', disabled: true, onSelect },
  ];
}

function openWithShortcut(
  options: { metaKey?: boolean; ctrlKey?: boolean } = {},
) {
  fireEvent.keyDown(document, { key: 'k', ...options });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Command.Dialog', () => {
  it('opens with the default Mod+K shortcut and closes with Escape', async () => {
    // Arrange
    render(<Command.Dialog items={createItems()} />);
    expect(screen.queryByRole('dialog')).toBeNull();

    // Act
    openWithShortcut({ ctrlKey: true });

    // Assert
    expect(
      await screen.findByRole('dialog', { name: 'Command palette' }),
    ).toBeTruthy();

    // Act
    await userEvent.keyboard('{Escape}');

    // Assert
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('toggles closed when the shortcut is pressed again while open', async () => {
    // Arrange
    render(<Command.Dialog items={createItems()} />);
    openWithShortcut({ ctrlKey: true });
    await screen.findByRole('dialog');

    // Act
    openWithShortcut({ ctrlKey: true });

    // Assert
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('uses Meta+K instead of Ctrl+K for the Mod modifier on Apple platforms', async () => {
    // Arrange
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)',
    );
    render(<Command.Dialog items={createItems()} />);

    // Act
    openWithShortcut({ ctrlKey: true });

    // Assert
    expect(screen.queryByRole('dialog')).toBeNull();

    // Act
    openWithShortcut({ metaKey: true });

    // Assert
    expect(await screen.findByRole('dialog')).toBeTruthy();
  });

  it('does not open from the shortcut when shortcut is null', () => {
    // Arrange
    render(<Command.Dialog items={createItems()} shortcut={null} />);

    // Act
    openWithShortcut({ ctrlKey: true });

    // Assert
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('responds only to the most recently mounted instance for the same shortcut', async () => {
    // Arrange
    render(
      <>
        <Command.Dialog items={createItems()} label="First palette" />
        <Command.Dialog items={createItems()} label="Second palette" />
      </>,
    );

    // Act
    openWithShortcut({ ctrlKey: true });

    // Assert
    const dialog = await screen.findByRole('dialog');
    expect(dialog.getAttribute('aria-label')).toBe('Second palette');
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
  });

  it('removes the shortcut listener when unmounted', () => {
    // Arrange
    const { unmount } = render(<Command.Dialog items={createItems()} />);

    // Act
    unmount();
    openWithShortcut({ ctrlKey: true });

    // Assert
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('calls onOpenChange and respects a controlled open prop', async () => {
    // Arrange
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Command.Dialog
        items={createItems()}
        open={false}
        onOpenChange={onOpenChange}
      />,
    );

    // Act
    openWithShortcut({ ctrlKey: true });

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('dialog')).toBeNull();

    // Act
    rerender(
      <Command.Dialog items={createItems()} open onOpenChange={onOpenChange} />,
    );

    // Assert
    expect(await screen.findByRole('dialog')).toBeTruthy();
  });

  it('closes the dialog before running the selected item and invokes it exactly once', async () => {
    // Arrange
    const order: string[] = [];
    const items: CommandItem[] = [
      {
        value: 'a',
        label: 'Alpha',
        onSelect: () => {
          order.push('select');
        },
      },
    ];
    render(
      <Command.Dialog
        items={items}
        defaultOpen
        onOpenChange={(open) => {
          order.push(open ? 'open' : 'close');
        }}
      />,
    );

    // Act
    await userEvent.click(await screen.findByRole('option', { name: 'Alpha' }));

    // Assert
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(order.filter((step) => step === 'select')).toHaveLength(1);
    expect(order.indexOf('close')).toBeLessThan(order.indexOf('select'));
  });
});

describe('Command filtering and navigation', () => {
  it('filters items by label, description, and keywords with every term required', async () => {
    // Arrange
    render(<Command items={createItems()} />);
    const input = screen.getByRole('combobox', { name: 'Search commands' });

    // Act
    await userEvent.type(input, 'create blank');

    // Assert
    expect(screen.getByRole('option', { name: /New note/ })).toBeTruthy();
    expect(screen.queryByRole('option', { name: /Open settings/ })).toBeNull();
  });

  it('uses a custom filter when provided', async () => {
    // Arrange
    const filter = vi.fn(
      (item: CommandItem, query: string) => item.value === query,
    );
    render(<Command items={createItems()} filter={filter} />);

    // Act
    await userEvent.type(screen.getByRole('combobox'), 'archive');

    // Assert
    expect(filter).toHaveBeenCalled();
    expect(screen.queryByRole('option', { name: /New note/ })).toBeNull();
  });

  it('shows the empty state when nothing matches', async () => {
    // Arrange
    render(<Command items={createItems()} />);

    // Act
    await userEvent.type(screen.getByRole('combobox'), 'zzzz');

    // Assert
    expect(await screen.findByText('No results found')).toBeTruthy();
  });

  it('keeps focus in the input while the results resize to the empty state', async () => {
    // Arrange
    render(<Command items={createItems()} />);
    const input = screen.getByRole('combobox');

    // Act
    await userEvent.type(input, 'zzzz');

    // Assert
    expect(await screen.findByText('No results found')).toBeTruthy();
    expect(input).toHaveFocus();
  });

  it('does not select disabled items', async () => {
    // Arrange
    const onSelect = vi.fn();
    render(<Command items={createItems(onSelect)} />);

    // Act
    await userEvent.click(screen.getByRole('option', { name: /Archive note/ }));

    // Assert
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('selects the highlighted item with Enter exactly once', async () => {
    // Arrange
    const onSelect = vi.fn();
    render(<Command items={createItems(onSelect)} />);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'new');

    // Act
    await userEvent.keyboard('{ArrowDown}{Enter}');

    // Assert
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('renders grouped items with group labels', () => {
    // Arrange
    const groups = [
      { label: 'Notes', items: [createItems()[0]!] },
      { label: 'App', items: [createItems()[1]!] },
    ];

    // Act
    render(<Command items={groups} />);

    // Assert
    const groupsList = screen.getAllByRole('group');
    expect(groupsList).toHaveLength(2);
    expect(within(groupsList[0]!).getByText('Notes')).toBeTruthy();
    expect(within(groupsList[1]!).getByText('App')).toBeTruthy();
  });

  it('renders item shortcuts as keyboard hints', () => {
    // Arrange & Act
    render(<Command items={createItems()} />);

    // Assert
    const option = screen.getByRole('option', { name: /New note/ });
    expect(within(option).getByText('Mod')).toBeTruthy();
    expect(within(option).getByText('N')).toBeTruthy();
  });
});
