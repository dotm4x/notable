import { useState, type FormEvent, type SyntheticEvent } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Button } from '../button/button.js';
import { Dialog, type DialogProps } from './dialog.js';

const originalShowModal = HTMLDialogElement.prototype.showModal;
const originalClose = HTMLDialogElement.prototype.close;

// jsdom does not implement the modal dialog API. The mock mirrors the browser
// behavior that matters here: `open` state and a `close` event on closing.
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (
    this: HTMLDialogElement,
  ) {
    this.open = true;
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    if (!this.open) {
      return;
    }

    this.open = false;
    this.dispatchEvent(new Event('close'));
  });
});

afterEach(() => {
  cleanup();
  HTMLDialogElement.prototype.showModal = originalShowModal;
  HTMLDialogElement.prototype.close = originalClose;
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

describe('Dialog', () => {
  describe('state', () => {
    it('opens from the trigger and closes from Close in uncontrolled mode', async () => {
      // Arrange
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      renderDialog({ onOpenChange });
      const dialog = screen.getByRole('dialog', { hidden: true });

      // Act
      await user.click(screen.getByRole('button', { name: 'Open dialog' }));

      // Assert
      expect(dialog).toHaveAttribute('open');
      expect(onOpenChange).toHaveBeenLastCalledWith(true);

      // Act
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      // Assert
      expect(dialog).not.toHaveAttribute('open');
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
      expect(onOpenChange).toHaveBeenCalledTimes(2);
    });

    it('opens on mount when defaultOpen is set', () => {
      // Arrange & Act
      renderDialog({ defaultOpen: true });

      // Assert
      expect(screen.getByRole('dialog')).toHaveAttribute('open');
      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
    });

    it('keeps the dialog closed when a controlled parent ignores onOpenChange', async () => {
      // Arrange
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      renderDialog({ open: false, onOpenChange });
      const dialog = screen.getByRole('dialog', { hidden: true });

      // Act
      await user.click(screen.getByRole('button', { name: 'Open dialog' }));

      // Assert
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(dialog).not.toHaveAttribute('open');
      expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
    });

    it('follows the open prop when a controlled parent updates it', () => {
      // Arrange
      const renderControlled = (open: boolean) => (
        <Dialog open={open}>
          <Dialog.Content>
            <Dialog.Title>Delete project?</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      const { rerender } = render(renderControlled(false));

      // Act
      rerender(renderControlled(true));

      // Assert
      expect(screen.getByRole('dialog')).toHaveAttribute('open');

      // Act
      rerender(renderControlled(false));

      // Assert
      expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute(
        'open',
      );
    });

    it('does not call showModal again when the dialog is already open', () => {
      // Arrange
      const { rerender } = renderDialog({ defaultOpen: true });

      // Act
      rerender(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Delete project?</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      // Assert
      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
    });

    it('works with controlled state managed by a parent component', async () => {
      // Arrange
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<ControlledDialog onOpenChange={onOpenChange} />);

      // Act
      await user.click(screen.getByRole('button', { name: 'Open dialog' }));

      // Assert
      expect(screen.getByRole('dialog')).toHaveAttribute('open');

      // Act
      await user.click(screen.getByRole('button', { name: 'Close' }));

      // Assert
      expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute(
        'open',
      );
      expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
    });
  });

  describe('keyboard and native close', () => {
    it('closes on Escape, prevents the native close, and reports once', () => {
      // Arrange
      const onOpenChange = vi.fn();
      renderDialog({ defaultOpen: true, onOpenChange });
      const dialog = screen.getByRole('dialog');

      // Act
      const isNotCancelled = fireEvent(
        dialog,
        new Event('cancel', { cancelable: true }),
      );

      // Assert
      expect(isNotCancelled).toBe(false);
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(dialog).not.toHaveAttribute('open');
    });

    it('keeps a controlled dialog open on Escape when the parent ignores the request', () => {
      // Arrange
      const onOpenChange = vi.fn();
      renderDialog({ open: true, onOpenChange });
      const dialog = screen.getByRole('dialog');

      // Act
      fireEvent(dialog, new Event('cancel', { cancelable: true }));

      // Assert
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(dialog).toHaveAttribute('open');
    });

    it('calls the consumer cancel handler and skips closing when it prevents default', () => {
      // Arrange
      const onOpenChange = vi.fn();
      const onCancel = vi.fn((event: SyntheticEvent) => {
        event.preventDefault();
      });
      render(
        <Dialog defaultOpen onOpenChange={onOpenChange}>
          <Dialog.Content onCancel={onCancel}>
            <Dialog.Title>Unsaved changes</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      // Act
      fireEvent(
        screen.getByRole('dialog'),
        new Event('cancel', { cancelable: true }),
      );

      // Assert
      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(screen.getByRole('dialog')).toHaveAttribute('open');
    });

    it('syncs state when the native dialog closes without going through Close', () => {
      // Arrange
      const onOpenChange = vi.fn();
      renderDialog({ defaultOpen: true, onOpenChange });
      const dialog = screen.getByRole('dialog') as HTMLDialogElement;

      // Act
      dialog.close();

      // Assert
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('calls the consumer close handler when the native dialog closes', () => {
      // Arrange
      const onClose = vi.fn();
      render(
        <Dialog defaultOpen>
          <Dialog.Content onClose={onClose}>
            <Dialog.Title>Notice</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      // Act
      (screen.getByRole('dialog') as HTMLDialogElement).close();

      // Assert
      expect(onClose).toHaveBeenCalledTimes(1);
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

      // Assert
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
            <Button id="open-button" onClick={onClick}>
              Open
            </Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Notice</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      // Act
      await user.click(screen.getByRole('button', { name: 'Open' }));

      // Assert
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute(
        'id',
        'open-button',
      );
      expect(screen.getByRole('dialog')).toHaveAttribute('open');
    });

    it('does not open when the child onClick calls preventDefault', async () => {
      // Arrange
      const user = userEvent.setup();
      render(
        <Dialog>
          <Dialog.Trigger>
            <Button
              onClick={(event) => {
                event.preventDefault();
              }}
            >
              Open
            </Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Notice</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );

      // Act
      await user.click(screen.getByRole('button', { name: 'Open' }));

      // Assert
      expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute(
        'open',
      );
    });
  });

  describe('Dialog.Close', () => {
    it('renders as type="button" so it never submits a surrounding form', async () => {
      // Arrange
      const user = userEvent.setup();
      const onSubmit = vi.fn((event: FormEvent) => {
        event.preventDefault();
      });
      const onOpenChange = vi.fn();
      render(
        <Dialog defaultOpen onOpenChange={onOpenChange}>
          <Dialog.Content>
            <Dialog.Title>Form</Dialog.Title>
            <form onSubmit={onSubmit}>
              <Dialog.Close type="submit">Cancel</Dialog.Close>
            </form>
          </Dialog.Content>
        </Dialog>,
      );

      // Act
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      expect(cancelButton).toHaveAttribute('type', 'button');
      await user.click(cancelButton);

      // Assert
      expect(onSubmit).not.toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('renders custom children and forwards the outline variant by default', () => {
      // Arrange & Act
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Notice</Dialog.Title>
            <Dialog.Close>
              <span>Dismiss</span>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog>,
      );

      // Assert
      const closeButton = screen.getByRole('button', { name: 'Dismiss' });
      expect(closeButton).toHaveClass('notable-button--outline');
    });

    it('skips closing when its onClick calls preventDefault', async () => {
      // Arrange
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <Dialog defaultOpen onOpenChange={onOpenChange}>
          <Dialog.Content>
            <Dialog.Title>Notice</Dialog.Title>
            <Dialog.Close
              onClick={(event) => {
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
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(screen.getByRole('dialog')).toHaveAttribute('open');
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
      expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute(
        'open',
      );
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
    it('closes when the backdrop is clicked', () => {
      // Arrange
      renderDialog({ defaultOpen: true });
      const dialog = screen.getByRole('dialog');

      // Act
      fireEvent.pointerDown(dialog);
      fireEvent.click(dialog);

      // Assert
      expect(dialog).not.toHaveAttribute('open');
    });

    it('does not close when clicking inside the content', () => {
      // Arrange
      renderDialog({ defaultOpen: true });
      const dialog = screen.getByRole('dialog');

      // Act
      fireEvent.pointerDown(screen.getByText('Body text'));
      fireEvent.click(screen.getByText('Body text'));

      // Assert
      expect(dialog).toHaveAttribute('open');
    });

    it('does not close when a text selection drag ends on the backdrop', () => {
      // Arrange
      renderDialog({ defaultOpen: true });
      const dialog = screen.getByRole('dialog');

      // Act
      fireEvent.pointerDown(screen.getByText('Body text'));
      fireEvent.click(dialog);

      // Assert
      expect(dialog).toHaveAttribute('open');
    });

    it('does not close on backdrop click when closeOnBackdropClick is false', () => {
      // Arrange
      render(
        <Dialog defaultOpen>
          <Dialog.Content closeOnBackdropClick={false}>
            <Dialog.Title>Notice</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
      );
      const dialog = screen.getByRole('dialog');

      // Act
      fireEvent.pointerDown(dialog);
      fireEvent.click(dialog);

      // Assert
      expect(dialog).toHaveAttribute('open');
    });
  });

  describe('accessibility', () => {
    it('names the dialog from Dialog.Title and describes it from Dialog.Description', () => {
      // Arrange & Act
      renderDialog({ defaultOpen: true });

      // Assert
      const dialog = screen.getByRole('dialog', {
        name: 'Delete project?',
      });
      expect(dialog).toHaveAccessibleDescription(
        'This action cannot be undone.',
      );
    });

    it('omits aria-describedby when no Dialog.Description is rendered', () => {
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

    it('removes the description reference when Dialog.Description unmounts', () => {
      // Arrange
      const renderContent = (showDescription: boolean) => (
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Notice</Dialog.Title>
            {showDescription && (
              <Dialog.Description>Details</Dialog.Description>
            )}
          </Dialog.Content>
        </Dialog>
      );
      const { rerender } = render(renderContent(true));
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-describedby');

      // Act
      rerender(renderContent(false));

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

    it('merges className and forwards HTML attributes to the dialog element', () => {
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
      expect(dialog.tagName).toBe('DIALOG');
      expect(dialog).toHaveClass('notable-dialog', 'custom-dialog');
      expect(dialog).toHaveAttribute('id', 'delete-dialog');
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
