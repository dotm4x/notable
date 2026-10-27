import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createToastController, toast, ToastProvider } from './toast.js';
import { toast as PublicToast } from '../../index.js';

describe('Toast', () => {
  it('names each viewport by its position so independent regions stay distinct', () => {
    render(
      <>
        <ToastProvider position="bottom-right">
          <span>First</span>
        </ToastProvider>
        <ToastProvider position="top-left" controller={createToastController()}>
          <span>Second</span>
        </ToastProvider>
      </>,
    );

    expect(
      screen.getByRole('region', { name: 'Notifications bottom right' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: 'Notifications top left' }),
    ).toBeInTheDocument();
  });

  it('supports shorthand and object notifications with all variants', async () => {
    render(
      <ToastProvider defaultDuration={0}>
        <button onClick={() => toast.success('Saved.')}>Show</button>
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(await screen.findByText('Saved.')).toBeInTheDocument();

    toast({
      title: 'Deployment complete',
      description: 'The app is available.',
      variant: 'info',
    });
    expect(await screen.findByText('Deployment complete')).toBeInTheDocument();
    expect(screen.getByText('The app is available.')).toBeInTheDocument();
  });

  it.each(['default', 'success', 'error', 'warning', 'info'] as const)(
    'renders the %s variant',
    async (variant) => {
      const controller = createToastController();
      render(
        <ToastProvider controller={controller} defaultDuration={0}>
          <button
            onClick={() => controller.toast({ description: variant, variant })}
          >
            Show variant
          </button>
        </ToastProvider>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Show variant' }));
      const notification = await screen.findByText(variant);
      expect(notification.closest('.notable-toast')).toHaveClass(
        `notable-toast--${variant}`,
      );
    },
  );

  it('returns stable ids for update and supports targeted and global dismissal', async () => {
    render(<ToastProvider defaultDuration={0} />);
    const id = toast.loading('Uploading files...');

    const loadingText = await screen.findByText('Uploading files...');
    const loadingToast = loadingText.closest('.notable-toast');
    toast.update(id, { title: 'Upload complete', variant: 'success' });
    const updatedTitle = await screen.findByText('Upload complete');
    expect(updatedTitle.closest('.notable-toast')).toBe(loadingToast);

    toast.dismiss(id);
    await waitFor(() =>
      expect(screen.queryByText('Upload complete')).not.toBeInTheDocument(),
    );

    toast('First');
    toast('Second');
    expect(await screen.findByText('First')).toBeInTheDocument();
    toast.dismiss();
    await waitFor(() => {
      expect(screen.queryByText('First')).not.toBeInTheDocument();
      expect(screen.queryByText('Second')).not.toBeInTheDocument();
    });
  });

  it('does not auto-dismiss notifications when the duration is zero', () => {
    vi.useFakeTimers();
    try {
      render(<ToastProvider defaultDuration={0} />);
      act(() => toast('Persistent notification'));
      expect(screen.getByText('Persistent notification')).toBeInTheDocument();

      vi.advanceTimersByTime(60_000);
      expect(screen.getByText('Persistent notification')).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('applies the provider maximum visible notification setting', async () => {
    const controller = createToastController();
    render(
      <ToastProvider
        controller={controller}
        defaultDuration={0}
        maxToasts={1}
      />,
    );

    controller.toast('Older notification');
    controller.toast('Newer notification');

    expect(await screen.findByText('Newer notification')).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.getByText('Older notification').closest('.notable-toast'),
      ).toHaveAttribute('data-limited'),
    );
  });

  it('updates stack indices so remaining toasts can animate into position', async () => {
    const controller = createToastController();
    render(
      <ToastProvider controller={controller} defaultDuration={0}>
        <button onClick={() => controller.toast('Second toast')}>
          Add toast
        </button>
      </ToastProvider>,
    );

    controller.toast('First toast');
    const first = (await screen.findByText('First toast')).closest(
      '.notable-toast',
    );
    expect(first).toHaveStyle('--toast-index: 0');

    fireEvent.click(screen.getByRole('button', { name: 'Add toast' }));
    const second = (await screen.findByText('Second toast')).closest(
      '.notable-toast',
    );
    await waitFor(() => expect(first).toHaveStyle('--toast-index: 1'));
    expect(second).toHaveStyle('--toast-index: 0');
  });

  it('renders custom content and handles actions', async () => {
    const action = vi.fn();
    render(<ToastProvider defaultDuration={0} />);

    toast({
      title: 'Review',
      description: 'Needs action',
      action: { label: 'Open', onClick: action },
    });
    fireEvent.click(await screen.findByRole('button', { name: 'Open' }));
    expect(action).toHaveBeenCalledOnce();

    toast.custom((id) => (
      <button onClick={() => toast.dismiss(id)}>Dismiss custom</button>
    ));
    fireEvent.click(
      await screen.findByRole('button', { name: 'Dismiss custom' }),
    );
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Dismiss custom' }),
      ).not.toBeInTheDocument(),
    );
  });

  it('updates a promise notification and returns the original result', async () => {
    render(<ToastProvider defaultDuration={0} />);
    let resolvePromise!: (value: string) => void;
    const originalPromise = new Promise<string>((resolve) => {
      resolvePromise = resolve;
    });

    const returnedPromise = toast.promise(originalPromise, {
      loading: 'Saving changes...',
      success: (value) => `${value} saved.`,
      error: 'Could not save.',
    });
    expect(await screen.findByText('Saving changes...')).toBeInTheDocument();

    resolvePromise('Document');
    await expect(returnedPromise).resolves.toBe('Document');
    expect(await screen.findByText('Document saved.')).toBeInTheDocument();
  });

  it('returns rejected promise errors without swallowing them', async () => {
    render(<ToastProvider defaultDuration={0} />);
    const error = new Error('Save failed');
    const originalPromise = Promise.reject(error);
    const returnedPromise = toast.promise(originalPromise, {
      loading: 'Saving...',
      success: 'Saved.',
      error: (reason) => (reason instanceof Error ? reason.message : 'Failed.'),
    });

    await expect(returnedPromise).rejects.toBe(error);
    expect(await screen.findByText('Save failed')).toBeInTheDocument();
  });

  it('uses an isolated manager for each controller', async () => {
    const first = createToastController();
    const second = createToastController();
    render(
      <>
        <ToastProvider controller={first} defaultDuration={0}>
          <button onClick={() => first.toast('First root')}>First</button>
        </ToastProvider>
        <ToastProvider controller={second} defaultDuration={0}>
          <button onClick={() => second.toast('Second root')}>Second</button>
        </ToastProvider>
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'First' }));
    fireEvent.click(screen.getByRole('button', { name: 'Second' }));
    expect(await screen.findByText('First root')).toBeInTheDocument();
    expect(await screen.findByText('Second root')).toBeInTheDocument();
    expect(PublicToast).toBe(toast);
  });
});
