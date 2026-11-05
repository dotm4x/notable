import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CopyButton as PublicCopyButton } from '../../components/index.js';
import { CopyButton } from './copy-button.js';

const writeText = vi.fn();

function installClipboardMock() {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
}

beforeEach(() => {
  writeText.mockReset();
  writeText.mockResolvedValue(undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CopyButton', () => {
  it('copies the value and confirms the action', async () => {
    const user = userEvent.setup();
    installClipboardMock();
    const onCopy = vi.fn();
    render(<CopyButton onCopy={onCopy} value="hello" />);

    const button = screen.getByRole('button', { name: 'Copy' });
    await user.click(button);

    await waitFor(() => expect(writeText).toHaveBeenCalledWith('hello'));
    expect(onCopy).toHaveBeenCalledWith('hello');
    await waitFor(() => expect(button).toHaveAccessibleName('Copied'));
    expect(button).toHaveTextContent('Copied');
  });

  it('returns to the copy label after the timeout', async () => {
    const user = userEvent.setup();
    installClipboardMock();
    render(<CopyButton timeout={50} value="hello" />);

    const button = screen.getByRole('button', { name: 'Copy' });
    await user.click(button);
    expect(button).toHaveAccessibleName('Copied');

    await waitFor(() => expect(button).toHaveAccessibleName('Copy'));
  });

  it('supports an icon-only presentation with an accessible name', async () => {
    const user = userEvent.setup();
    installClipboardMock();
    render(<CopyButton showLabel={false} value="hello" />);

    const button = screen.getByRole('button', { name: 'Copy' });
    await user.click(button);

    expect(button).toHaveAccessibleName('Copied');
    expect(screen.queryByText('Copy')).not.toBeInTheDocument();
  });

  it('supports custom labels', () => {
    render(
      <CopyButton
        copiedLabel="Listo"
        label="Copiar"
        showLabel={false}
        value="hola"
      />,
    );

    expect(screen.getByRole('button', { name: 'Copiar' })).toBeInTheDocument();
  });

  it('calls onError when copying fails', async () => {
    const user = userEvent.setup();
    installClipboardMock();
    const onError = vi.fn();
    writeText.mockRejectedValueOnce(new Error('denied'));
    render(<CopyButton onError={onError} value="hello" />);

    await user.click(screen.getByRole('button', { name: 'Copy' }));

    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('uses a button type by default', () => {
    render(<CopyButton value="hello" />);

    expect(screen.getByRole('button', { name: 'Copy' })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('is exported from the package entry point', () => {
    expect(PublicCopyButton).toBe(CopyButton);
  });
});
