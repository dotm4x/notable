import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Tooltip } from './tooltip.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Tooltip', () => {
  it('describes its trigger with the tooltip content', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="More information">
        <button type="button">Help</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Help' });
    await user.hover(trigger);

    const tooltip = await screen.findByRole('tooltip');

    expect(tooltip).toHaveTextContent('More information');
    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id);
  });

  it('waits for the configured delay before showing', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="More information" delay={300}>
        <button type="button">Help</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole('button', { name: 'Help' }));

    expect(
      document.querySelector('.notable-tooltip__content[data-open]'),
    ).toBeNull();

    await waitFor(() =>
      expect(
        document.querySelector('.notable-tooltip__content[data-open]'),
      ).not.toBeNull(),
    );
  });

  it('does not show or describe the tooltip when disabled', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="More information" disabled>
        <button type="button">Help</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Help' });
    await user.hover(trigger);
    await user.tab();

    expect(trigger).toHaveFocus();
    expect(trigger).not.toHaveAttribute('aria-describedby');
    expect(
      document.querySelector('.notable-tooltip__content[data-open]'),
    ).toBeNull();
  });

  it('shows the tooltip on keyboard focus', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="More information">
        <button type="button">Help</button>
      </Tooltip>,
    );

    await user.tab();

    expect(screen.getByRole('button', { name: 'Help' })).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'More information',
    );
  });

  it('preserves existing descriptions of the trigger', async () => {
    const user = userEvent.setup();

    render(
      <>
        <span id="existing-description">Existing description</span>
        <Tooltip content="More information">
          <button type="button" aria-describedby="existing-description">
            Help
          </button>
        </Tooltip>
      </>,
    );

    const trigger = screen.getByRole('button', { name: 'Help' });
    await user.hover(trigger);
    const tooltip = await screen.findByRole('tooltip');

    expect(trigger.getAttribute('aria-describedby')).toContain(
      'existing-description',
    );
    expect(trigger.getAttribute('aria-describedby')).toContain(tooltip.id);
  });

  it('applies the preferred placement to the popup', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="More information" placement="bottom">
        <button type="button">Help</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole('button', { name: 'Help' }));

    expect(await screen.findByRole('tooltip')).toHaveAttribute(
      'data-side',
      'bottom',
    );
  });

  it('dismisses on Escape', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="More information">
        <button type="button">Help</button>
      </Tooltip>,
    );

    await user.tab();
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() =>
      expect(
        document.querySelector('.notable-tooltip__content[data-open]'),
      ).toBeNull(),
    );
  });
});
