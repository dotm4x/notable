import { createRef, useState, type RefAttributes } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from '../button/button.js';
import { Input } from '../input/input.js';
import {
  Popover,
  type PopoverContentProps,
  type PopoverProps,
} from './popover.js';

afterEach(() => {
  cleanup();
});

function renderPopover(
  props: Partial<PopoverProps> = {},
  contentProps: Partial<
    PopoverContentProps & RefAttributes<HTMLDivElement>
  > = {},
) {
  return render(
    <Popover {...props}>
      <Popover.Trigger>
        <Button>Open popover</Button>
      </Popover.Trigger>
      <Popover.Content {...contentProps}>
        <Popover.Header>
          <Popover.Title>Filters</Popover.Title>
          <Popover.Description>Choose what to show.</Popover.Description>
        </Popover.Header>
        <p>Body text</p>
        <Popover.Close>Done</Popover.Close>
      </Popover.Content>
    </Popover>,
  );
}

function ControlledPopover({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange?.(nextOpen);
        setOpen(nextOpen);
      }}
    >
      <Popover.Trigger>
        <Button>Toggle</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Title>Controlled</Popover.Title>
      </Popover.Content>
    </Popover>
  );
}

describe('Popover', () => {
  it('exposes every compound part', () => {
    // Arrange
    const expectedParts = [
      'Trigger',
      'Content',
      'Header',
      'Title',
      'Description',
      'Close',
    ];

    // Act
    const exposedParts = Object.keys(Popover);

    // Assert
    expect(exposedParts).toEqual(expect.arrayContaining(expectedParts));
  });

  it('keeps the popup closed until the trigger is activated', async () => {
    // Arrange
    const user = userEvent.setup();
    renderPopover();

    // Act
    await user.click(screen.getByRole('button', { name: 'Open popover' }));

    // Assert
    expect(
      await screen.findByRole('dialog', { name: 'Filters' }),
    ).toBeInTheDocument();
  });

  it('starts open when defaultOpen is true', () => {
    // Arrange & Act
    renderPopover({ defaultOpen: true });

    // Assert
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument();
  });

  it('links the trigger, popup title, and description with ARIA', async () => {
    // Arrange
    const user = userEvent.setup();
    renderPopover();

    // Act
    const trigger = screen.getByRole('button', { name: 'Open popover' });
    await user.click(trigger);
    const popup = await screen.findByRole('dialog', { name: 'Filters' });

    // Assert
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(popup).toHaveAccessibleDescription('Choose what to show.');
  });

  it('closes when Escape is pressed', async () => {
    // Arrange
    const user = userEvent.setup();
    renderPopover({ defaultOpen: true });
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument();

    // Act
    await user.keyboard('{Escape}');

    // Assert
    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: 'Filters' }),
      ).not.toBeInTheDocument();
    });
  });

  it('closes when a press lands outside the popup', async () => {
    // Arrange
    const user = userEvent.setup();
    renderPopover({ defaultOpen: true });

    // Act
    await user.click(document.body);

    // Assert
    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: 'Filters' }),
      ).not.toBeInTheDocument();
    });
  });

  it('closes when Popover.Close is activated', async () => {
    // Arrange
    const user = userEvent.setup();
    renderPopover({ defaultOpen: true });

    // Act
    await user.click(screen.getByRole('button', { name: 'Done' }));

    // Assert
    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: 'Filters' }),
      ).not.toBeInTheDocument();
    });
  });

  it('renders Popover.Close with type="button"', () => {
    // Arrange & Act
    renderPopover({ defaultOpen: true });

    // Assert
    expect(screen.getByRole('button', { name: 'Done' })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('does not open when the trigger is disabled', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Popover>
        <Popover.Trigger>
          <Button disabled>Unavailable</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Title>Hidden</Popover.Title>
        </Popover.Content>
      </Popover>,
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Unavailable' }));

    // Assert
    expect(
      screen.queryByRole('dialog', { name: 'Hidden' }),
    ).not.toBeInTheDocument();
  });

  it('renders the popup in a portal outside its container', () => {
    // Arrange & Act
    const { container } = renderPopover({ defaultOpen: true });

    // Assert
    const popup = screen.getByRole('dialog', { name: 'Filters' });
    expect(container).not.toContainElement(popup);
    expect(document.body).toContainElement(popup);
  });

  it('forwards ref to the popup element', () => {
    // Arrange
    const ref = createRef<HTMLDivElement>();

    // Act
    renderPopover({ defaultOpen: true }, { ref });

    // Assert
    expect(ref.current).toBe(screen.getByRole('dialog', { name: 'Filters' }));
  });

  it('applies placement and merges className on the popup', () => {
    // Arrange & Act
    renderPopover(
      { defaultOpen: true },
      { side: 'top', align: 'end', className: 'custom-popover' },
    );

    // Assert
    const popup = screen.getByRole('dialog', { name: 'Filters' });
    expect(popup).toHaveAttribute('data-side', 'top');
    expect(popup).toHaveAttribute('data-align', 'end');
    expect(popup).toHaveClass('notable-popover', 'custom-popover');
  });

  it('moves focus into a popover with interactive content on open', async () => {
    // Arrange
    render(
      <Popover defaultOpen>
        <Popover.Content>
          <Input aria-label="Search" />
        </Popover.Content>
      </Popover>,
    );
    const search = screen.getByRole('textbox', { name: 'Search' });

    // Act
    await waitFor(() => {
      expect(search).toHaveFocus();
    });

    // Assert
    expect(search).toHaveFocus();
  });

  it('follows the open prop in controlled mode', async () => {
    // Arrange
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<ControlledPopover onOpenChange={onOpenChange} />);

    // Act
    await user.click(screen.getByRole('button', { name: 'Toggle' }));

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(
      await screen.findByRole('dialog', { name: 'Controlled' }),
    ).toBeInTheDocument();
  });

  it('stays closed in controlled mode when open is not updated', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Popover open={false} onOpenChange={() => undefined}>
        <Popover.Trigger>
          <Button>Locked</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Title>Locked content</Popover.Title>
        </Popover.Content>
      </Popover>,
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Locked' }));

    // Assert
    expect(
      screen.queryByRole('dialog', { name: 'Locked content' }),
    ).not.toBeInTheDocument();
  });

  it('reports the requested open state when closed with Escape', async () => {
    // Arrange
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    renderPopover({ defaultOpen: true, onOpenChange });

    // Act
    await user.keyboard('{Escape}');

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
