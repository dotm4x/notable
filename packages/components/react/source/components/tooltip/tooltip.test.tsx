import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Tooltip } from './tooltip.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Tooltip', () => {
  it('describes its trigger with the tooltip content', () => {
    render(
      <Tooltip content="More information">
        <button type="button">Help</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Help' });
    const tooltip = screen.getByRole('tooltip');

    expect(tooltip).toHaveTextContent('More information');
    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id);
  });

  it('uses the default delay and allows it to be configured', () => {
    const { rerender } = render(
      <Tooltip content="More information">
        <button type="button">Help</button>
      </Tooltip>,
    );

    expect(
      screen
        .getByRole('tooltip')
        .style.getPropertyValue('--notable-tooltip-delay'),
    ).toBe('350ms');

    rerender(
      <Tooltip content="More information" delay={500}>
        <button type="button">Help</button>
      </Tooltip>,
    );

    expect(
      screen
        .getByRole('tooltip')
        .style.getPropertyValue('--notable-tooltip-delay'),
    ).toBe('500ms');
  });

  it('does not show or describe the tooltip when disabled', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="More information" disabled>
        <button type="button" aria-describedby="existing-description">
          Help
        </button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Help' });

    expect(trigger).toHaveAttribute('aria-describedby', 'existing-description');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await user.hover(trigger);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('preserves existing descriptions and supports placement', () => {
    render(
      <>
        <span id="existing-description">Existing description</span>
        <Tooltip content="More information" placement="bottom">
          <button type="button" aria-describedby="existing-description">
            Help
          </button>
        </Tooltip>
      </>,
    );

    const trigger = screen.getByRole('button', { name: 'Help' });
    const tooltip = screen.getByRole('tooltip');

    expect(trigger.getAttribute('aria-describedby')).toBe(
      `existing-description ${tooltip.id}`,
    );
    expect(tooltip).toHaveAttribute('data-placement', 'bottom');
  });

  it('keeps the trigger keyboard-focusable', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="More information">
        <button type="button">Help</button>
      </Tooltip>,
    );

    await user.tab();

    expect(screen.getByRole('button', { name: 'Help' })).toHaveFocus();
  });

  it('flips to the opposite side when the preferred placement does not fit', () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        if (this.classList.contains('notable-tooltip__content')) {
          return new DOMRect(0, 0, 120, 40);
        }

        return new DOMRect(50, 4, 60, 24);
      },
    );

    render(
      <Tooltip content="More information" placement="top">
        <button type="button">Help</button>
      </Tooltip>,
    );

    const tooltip = screen.getByRole('tooltip');

    expect(tooltip).toHaveAttribute('data-placement', 'bottom');
    expect(tooltip).toHaveStyle({ top: '36px' });
  });

  it('clamps to the viewport edge and repositions on resize', () => {
    let triggerRect = new DOMRect(970, 100, 40, 24);
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        return this.classList.contains('notable-tooltip__content')
          ? new DOMRect(0, 0, 120, 40)
          : triggerRect;
      },
    );

    render(
      <Tooltip content="More information">
        <button type="button">Help</button>
      </Tooltip>,
    );

    const tooltip = screen.getByRole('tooltip');

    expect(tooltip).toHaveStyle({ left: '896px' });

    triggerRect = new DOMRect(200, 100, 40, 24);
    fireEvent.resize(window);

    expect(tooltip).toHaveStyle({ left: '160px' });
  });

  it('positions against the trigger element and portals outside transformed ancestors', () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        if (this.classList.contains('notable-tooltip__content')) {
          return new DOMRect(0, 0, 120, 40);
        }

        if (this.tagName === 'BUTTON') {
          return new DOMRect(100, 120, 60, 24);
        }

        return new DOMRect(0, 0, 400, 100);
      },
    );

    render(
      <div style={{ transform: 'translateZ(0)', overflow: 'hidden' }}>
        <Tooltip content="More information" placement="bottom">
          <button type="button">Help</button>
        </Tooltip>
      </div>,
    );

    const tooltip = screen.getByRole('tooltip');

    expect(tooltip).toHaveStyle({ left: '70px', top: '152px' });
    expect(tooltip.parentElement).toBe(document.body);
  });

  it('tracks the hovered and focused trigger separately inside overlapping avatars', async () => {
    const user = userEvent.setup();
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        if (this.classList.contains('notable-tooltip__content')) {
          return new DOMRect(0, 0, 100, 40);
        }

        if (this.getAttribute('data-testid') === 'max-trigger') {
          return new DOMRect(100, 80, 48, 48);
        }

        if (this.getAttribute('data-testid') === 'alex-trigger') {
          return new DOMRect(132, 80, 48, 48);
        }

        return new DOMRect(0, 0, 200, 60);
      },
    );

    render(
      <div style={{ transform: 'translateZ(0)' }}>
        <Tooltip content="Max profile" placement="bottom">
          <a href="#max" data-testid="max-trigger">
            Max
          </a>
        </Tooltip>
        <Tooltip content="Alex profile" placement="bottom">
          <button type="button" data-testid="alex-trigger">
            Alex
          </button>
        </Tooltip>
      </div>,
    );

    const maxTrigger = screen.getByTestId('max-trigger');
    const alexTrigger = screen.getByTestId('alex-trigger');
    const maxTooltip = document.getElementById(
      maxTrigger.getAttribute('aria-describedby')!,
    )!;
    const alexTooltip = document.getElementById(
      alexTrigger.getAttribute('aria-describedby')!,
    )!;

    expect(maxTooltip).toHaveStyle({ left: '74px', top: '136px' });
    expect(alexTooltip).toHaveStyle({ left: '106px', top: '136px' });

    await user.hover(maxTrigger);
    expect(maxTooltip).toHaveAttribute('data-open', 'true');
    expect(alexTooltip).not.toHaveAttribute('data-open', 'true');

    await user.hover(alexTrigger);
    expect(maxTooltip).not.toHaveAttribute('data-open', 'true');
    expect(alexTooltip).toHaveAttribute('data-open', 'true');

    await user.tab();
    expect(maxTrigger).toHaveFocus();
    expect(maxTooltip).toHaveAttribute('data-open', 'true');
  });

  it('dismisses on Escape and shows again when focus returns', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="More information">
        <button type="button">Help</button>
      </Tooltip>,
    );
    const tooltip = screen.getByRole('tooltip');

    await user.tab();
    expect(tooltip).toHaveAttribute('data-open', 'true');

    await user.keyboard('{Escape}');
    expect(tooltip).not.toHaveAttribute('data-open');

    await user.tab({ shift: true });
    await user.tab();
    expect(tooltip).toHaveAttribute('data-open', 'true');
  });

  it('dismisses on Escape while hovered and reopens after the pointer re-enters', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="More information">
        <button type="button">Help</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Help' });
    const tooltip = screen.getByRole('tooltip');

    await user.hover(trigger);
    expect(tooltip).toHaveAttribute('data-open', 'true');

    await user.keyboard('{Escape}');
    expect(tooltip).not.toHaveAttribute('data-open');

    await user.unhover(trigger);
    await user.hover(trigger);
    expect(tooltip).toHaveAttribute('data-open', 'true');
  });

  it('lets Escape reach other document listeners and keeps disabled tooltips closed', async () => {
    const user = userEvent.setup();
    const onDocumentKeyDown = vi.fn();
    document.addEventListener('keydown', onDocumentKeyDown);

    render(
      <>
        <Tooltip content="Enabled help">
          <button type="button">Enabled</button>
        </Tooltip>
        <Tooltip content="Disabled help" disabled>
          <button type="button">Disabled</button>
        </Tooltip>
      </>,
    );

    try {
      await user.hover(screen.getByRole('button', { name: 'Enabled' }));
      await user.keyboard('{Escape}');
      expect(onDocumentKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'Escape' }),
      );

      await user.hover(screen.getByRole('button', { name: 'Disabled' }));
      expect(screen.getAllByRole('tooltip')).toHaveLength(1);
      expect(
        screen.getByRole('button', { name: 'Disabled' }),
      ).not.toHaveAttribute('aria-describedby');
    } finally {
      document.removeEventListener('keydown', onDocumentKeyDown);
    }
  });
});
