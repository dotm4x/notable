import { createRef, useState, type FormEvent, type MouseEvent } from 'react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from '../button/button.js';
import { Dialog, type DialogProps } from './dialog.js';

afterEach(() => {
  cleanup();
});

function renderDialog(props: Partial<DialogProps> = {}) {
  return render(
    <Dialog {...props}>
      <Dialog.Trigger>
        <Button>Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Delete project?</Dialog.Title>
          <Dialog.Description>This action cannot be undone.</Dialog.Description>
        </Dialog.Header>
        <p>Body text</p>
        <Dialog.Footer>
          <Dialog.Close>Cancel</Dialog.Close>
          <Button variant="danger">Delete</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>,
  );
}

function ControlledDialog({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange?.(nextOpen);
        setOpen(nextOpen);
      }}
    >
      <Dialog.Trigger>
        <Button>Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Controlled</Dialog.Title>
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Content>
    </Dialog>
  );
}

function getBackdrop(): HTMLElement {
  const backdrop = document.querySelector<HTMLElement>(
    '.notable-dialog__backdrop',
  );

  if (!backdrop) {
    throw new Error('Expected the dialog backdrop to be rendered.');
  }

  return backdrop;
}

describe('Dialog', () => {
  it('forwards its ref to the dialog popup element', async () => {
    const user = userEvent.setup();
    const contentRef = createRef<HTMLDivElement>();

    render(
      <Dialog>
        <Dialog.Trigger>
          <Button>Open dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content ref={contentRef}>
          <Dialog.Title>Ref check</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    );

    await user.click(screen.getByRole('button', { name: 'Open dialog' }));

    expect(await screen.findByRole('dialog')).toBe(contentRef.current);
  });

  describe('state', () => {
    it('opens from the trigger and closes from Close in uncontrolled mode', async () => {
      // Arrange
      const user = userEvent.setup();
      renderDialog();

      // Act
      await user.click(screen.getByRole('button', { name: 'Open dialog' }));

      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Act
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('renders open on mount when defaultOpen is set', () => {
      // Arrange & Act
      renderDialog({ defaultOpen: true });

      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('calls onOpenChange with the requested state in uncontrolled mode', async () => {
      // Arrange
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      renderDialog({ onOpenChange });

      // Act
      await user.click(screen.getByRole('button', { name: 'Open dialog' }));

      // Assert
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenLastCalledWith(true);

      // Act
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      // Assert
      expect(onOpenChange).toHaveBeenCalledTimes(2);
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });

    it('keeps the dialog closed when a controlled parent ignores onOpenChange', async () => {
      // Arrange
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <Dialog open={false} onOpenChange={onOpenChange}>
          <Dialog.Trigger>
            <Button>Open dialog</Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Controlled</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      // Act
      await user.click(screen.getByRole('button', { name: 'Open dialog' }));

      // Assert
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('follows the open prop when a controlled parent updates it', async () => {
      // Arrange
      const { rerender } = render(
        <Dialog open={false}>
          <Dialog.Content>
            <Dialog.Title>Controlled</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      // Act
      rerender(
        <Dialog open>
          <Dialog.Content>
            <Dialog.Title>Controlled</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Act
      rerender(
        <Dialog open={false}>
          <Dialog.Content>
            <Dialog.Title>Controlled</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('works with controlled state managed by a parent component', async () => {
      // Arrange
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<ControlledDialog onOpenChange={onOpenChange} />);

      // Act
      await user.click(screen.getByRole('button', { name: 'Open dialog' }));

      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(onOpenChange).toHaveBeenLastCalledWith(true);

      // Act
      await user.click(screen.getByRole('button', { name: 'Close' }));

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });
  });

  describe('keyboard', () => {
    it('closes on Escape and reports the close once', async () => {
      // Arrange
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      renderDialog({ defaultOpen: true, onOpenChange });

      // Act
      await user.keyboard('{Escape}');

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('keeps a controlled dialog open on Escape when the parent ignores the request', async () => {
      // Arrange
      const user = userEvent.setup();
      render(
        <Dialog open onOpenChange={vi.fn()}>
          <Dialog.Content>
            <Dialog.Title>Controlled</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      // Act
      await user.keyboard('{Escape}');

      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('moves focus into the dialog when it opens and restores it on close', async () => {
      // Arrange
      const user = userEvent.setup();
      renderDialog();
      const trigger = screen.getByRole('button', { name: 'Open dialog' });

      // Act
      await user.click(trigger);

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toContainElement(
          document.activeElement as HTMLElement,
        );
      });

      // Act
      await user.keyboard('{Escape}');

      // Assert
      await waitFor(() => {
        expect(trigger).toHaveFocus();
      });
    });
  });

  describe('Dialog.Trigger', () => {
    it('wraps non-element children in a Button and exposes dialog ARIA state', async () => {
      // Arrange
      const user = userEvent.setup();
      render(
        <Dialog>
          <Dialog.Trigger>Open text</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Notice</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );
      const trigger = screen.getByRole('button', { name: 'Open text' });

      // Act & Assert
      expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      // Act
      await user.click(trigger);

      // Assert
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('preserves the child element attributes and onClick handler', async () => {
      // Arrange
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Dialog>
          <Dialog.Trigger>
            <Button className="open-button" onClick={onClick}>
              Open
            </Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Notice</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );
      const trigger = screen.getByRole('button', { name: 'Open' });

      // Act
      await user.click(trigger);

      // Assert
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(trigger).toHaveClass('open-button');
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('does not open when the child onClick calls preventDefault', async () => {
      // Arrange
      const user = userEvent.setup();
      render(
        <Dialog>
          <Dialog.Trigger>
            <Button
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
              }}
            >
              Blocked
            </Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Notice</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      // Act
      await user.click(screen.getByRole('button', { name: 'Blocked' }));

      // Assert
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Dialog.Close', () => {
    it('renders as type="button" so it never submits a surrounding form', async () => {
      // Arrange
      const user = userEvent.setup();
      const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
      });
      render(
        <form onSubmit={onSubmit}>
          <Dialog defaultOpen>
            <Dialog.Content>
              <Dialog.Title>Form</Dialog.Title>
              <Dialog.Close>Dismiss</Dialog.Close>
            </Dialog.Content>
          </Dialog>
        </form>,
      );

      // Arrange
      const dismiss = screen.getByRole('button', { name: 'Dismiss' });

      // Assert
      expect(dismiss).toHaveAttribute('type', 'button');

      // Act
      await user.click(dismiss);

      // Assert
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('renders custom children and uses the outline variant by default', () => {
      // Arrange & Act
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Notice</Dialog.Title>
            <Dialog.Close>Not now</Dialog.Close>
          </Dialog.Content>
        </Dialog>,
      );

      // Assert
      expect(screen.getByRole('button', { name: 'Not now' })).toHaveClass(
        'notable-button--outline',
      );
    });

    it('does not close when its onClick calls preventDefault', async () => {
      // Arrange
      const user = userEvent.setup();
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Notice</Dialog.Title>
            <Dialog.Close
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
              }}
            >
              Stay
            </Dialog.Close>
          </Dialog.Content>
        </Dialog>,
      );

      // Act
      await user.click(screen.getByRole('button', { name: 'Stay' }));

      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Dialog.Content close button', () => {
    it('renders an accessible close button by default that closes the dialog', async () => {
      // Arrange
      const user = userEvent.setup();
      renderDialog({ defaultOpen: true });

      // Act
      await user.click(screen.getByRole('button', { name: 'Close dialog' }));

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('hides the close button when showCloseButton is false', () => {
      // Arrange & Act
      render(
        <Dialog defaultOpen>
          <Dialog.Content showCloseButton={false}>
            <Dialog.Title>Notice</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      // Assert
      expect(
        screen.queryByRole('button', { name: 'Close dialog' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('backdrop dismissal', () => {
    it('closes when the backdrop is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      renderDialog({ defaultOpen: true });

      // Act
      await user.click(getBackdrop());

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('does not close when clicking inside the content', async () => {
      // Arrange
      const user = userEvent.setup();
      renderDialog({ defaultOpen: true });

      // Act
      await user.click(screen.getByText('Body text'));

      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('does not close on backdrop click when closeOnBackdropClick is false', async () => {
      // Arrange
      const user = userEvent.setup();
      render(
        <Dialog defaultOpen>
          <Dialog.Content closeOnBackdropClick={false}>
            <Dialog.Title>Notice</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      // Act
      await user.click(getBackdrop());

      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('still closes with Escape when closeOnBackdropClick is false', async () => {
      // Arrange
      const user = userEvent.setup();
      render(
        <Dialog defaultOpen>
          <Dialog.Content closeOnBackdropClick={false}>
            <Dialog.Title>Notice</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      // Act
      await user.keyboard('{Escape}');

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('does not close when a pointer press starts inside the content and ends on the backdrop', () => {
      // Arrange
      renderDialog({ defaultOpen: true });
      const body = screen.getByText('Body text');

      // Act
      fireEvent.pointerDown(body);
      fireEvent.pointerUp(getBackdrop());
      fireEvent.click(getBackdrop());

      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('names the dialog from Dialog.Title and describes it from Dialog.Description', () => {
      // Arrange & Act
      renderDialog({ defaultOpen: true });

      // Assert
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAccessibleName('Delete project?');
      expect(dialog).toHaveAccessibleDescription(
        'This action cannot be undone.',
      );
    });

    it('omits the description reference when no Dialog.Description is rendered', () => {
      // Arrange & Act
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Notice</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      // Assert
      expect(screen.getByRole('dialog')).not.toHaveAttribute(
        'aria-describedby',
      );
    });

    it('labels the close button and leaves its icon hidden from assistive technology', () => {
      // Arrange & Act
      renderDialog({ defaultOpen: true });

      // Assert
      const closeButton = screen.getByRole('button', { name: 'Close dialog' });
      expect(closeButton.querySelector('svg')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    });
  });

  describe('Dialog.Content props', () => {
    it.each([
      ['small', 'notable-dialog--small'],
      ['medium', 'notable-dialog--medium'],
      ['large', 'notable-dialog--large'],
    ] as const)('applies the %s size class', (size, className) => {
      // Arrange & Act
      render(
        <Dialog defaultOpen>
          <Dialog.Content size={size}>
            <Dialog.Title>Notice</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      // Assert
      expect(screen.getByRole('dialog')).toHaveClass(
        'notable-dialog',
        className,
      );
    });

    it('defaults to the medium size', () => {
      // Arrange & Act
      renderDialog({ defaultOpen: true });

      // Assert
      expect(screen.getByRole('dialog')).toHaveClass('notable-dialog--medium');
    });

    it('merges className and forwards HTML attributes to the popup element', () => {
      // Arrange & Act
      render(
        <Dialog defaultOpen>
          <Dialog.Content
            className="custom-dialog"
            id="delete-dialog"
            data-testid="delete-dialog"
            aria-label="Delete confirmation"
          >
            <Dialog.Title>Notice</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      // Assert
      const dialog = screen.getByTestId('delete-dialog');
      expect(dialog).toHaveClass('notable-dialog', 'custom-dialog');
      expect(dialog).toHaveAttribute('id', 'delete-dialog');
      expect(dialog).toHaveAttribute('aria-label', 'Delete confirmation');
      expect(dialog).toHaveAccessibleName('Notice');
    });
  });

  describe('layout parts', () => {
    it('forwards className and HTML attributes from Header, Title, Description, and Footer', () => {
      // Arrange & Act
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Header className="header" data-testid="header">
              <Dialog.Title className="title" data-testid="title">
                Notice
              </Dialog.Title>
              <Dialog.Description
                className="description"
                data-testid="description"
              >
                Details
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Footer className="footer" data-testid="footer">
              <Dialog.Close>Done</Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>,
      );

      // Assert
      expect(screen.getByTestId('header')).toHaveClass(
        'notable-dialog__header',
        'header',
      );
      expect(screen.getByTestId('title').tagName).toBe('H2');
      expect(screen.getByTestId('title')).toHaveClass(
        'notable-dialog__title',
        'title',
      );
      expect(screen.getByTestId('description').tagName).toBe('P');
      expect(screen.getByTestId('description')).toHaveClass(
        'notable-dialog__description',
        'description',
      );
      expect(screen.getByTestId('footer')).toHaveClass(
        'notable-dialog__footer',
        'footer',
      );
    });
  });

  describe('compound component context', () => {
    it.each([
      ['Dialog.Trigger', () => <Dialog.Trigger>Open</Dialog.Trigger>],
      [
        'Dialog.Content',
        () => (
          <Dialog.Content>
            <p>Body</p>
          </Dialog.Content>
        ),
      ],
      ['Dialog.Title', () => <Dialog.Title>Title</Dialog.Title>],
      [
        'Dialog.Description',
        () => <Dialog.Description>Description</Dialog.Description>,
      ],
      ['Dialog.Close', () => <Dialog.Close>Close</Dialog.Close>],
    ])('throws when %s is used outside Dialog', (name, renderPart) => {
      // Arrange
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      // Act & Assert
      expect(() => render(renderPart())).toThrow(
        `${name} must be used within Dialog.`,
      );

      consoleError.mockRestore();
    });
  });
});
