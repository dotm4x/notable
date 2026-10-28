import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChevronDown } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { Collapsible, type CollapsibleProps } from './collapsible.js';

type RenderOptions = Omit<CollapsibleProps, 'children'>;

function renderCollapsible(options: RenderOptions = {}) {
  return render(
    <Collapsible {...options}>
      <Collapsible.Trigger>Shipping details</Collapsible.Trigger>
      <Collapsible.Content>Ships within two business days.</Collapsible.Content>
    </Collapsible>,
  );
}

describe('Collapsible', () => {
  it('keeps the content hidden by default', () => {
    renderCollapsible();

    expect(
      screen.getByRole('button', { name: 'Shipping details' }),
    ).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.getByText('Ships within two business days.'),
    ).not.toBeVisible();
  });

  it('shows the content initially when defaultOpen is set', () => {
    renderCollapsible({ defaultOpen: true });

    expect(
      screen.getByRole('button', { name: 'Shipping details' }),
    ).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Ships within two business days.')).toBeVisible();
  });

  it('opens and closes the content through the trigger', async () => {
    const user = userEvent.setup();
    renderCollapsible();
    const trigger = screen.getByRole('button', { name: 'Shipping details' });
    const content = screen.getByText('Ships within two business days.');

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(content).toBeVisible();

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(content).not.toBeVisible();
  });

  it('follows the open prop without changing its own state when controlled', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Collapsible open={false} onOpenChange={onOpenChange}>
        <Collapsible.Trigger>Shipping details</Collapsible.Trigger>
        <Collapsible.Content>
          Ships within two business days.
        </Collapsible.Content>
      </Collapsible>,
    );
    const trigger = screen.getByRole('button', { name: 'Shipping details' });

    await user.click(trigger);

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.getByText('Ships within two business days.'),
    ).not.toBeVisible();

    rerender(
      <Collapsible open onOpenChange={onOpenChange}>
        <Collapsible.Trigger>Shipping details</Collapsible.Trigger>
        <Collapsible.Content>
          Ships within two business days.
        </Collapsible.Content>
      </Collapsible>,
    );

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Ships within two business days.')).toBeVisible();
  });

  it('notifies onOpenChange with the next expanded state', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderCollapsible({ onOpenChange });
    const trigger = screen.getByRole('button', { name: 'Shipping details' });

    await user.click(trigger);
    await user.click(trigger);

    expect(onOpenChange).toHaveBeenNthCalledWith(1, true);
    expect(onOpenChange).toHaveBeenNthCalledWith(2, false);
    expect(onOpenChange).toHaveBeenCalledTimes(2);
  });

  it('prevents the trigger from changing state when disabled', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderCollapsible({ disabled: true, onOpenChange });
    const trigger = screen.getByRole('button', { name: 'Shipping details' });

    await user.click(trigger);

    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.getByText('Ships within two business days.'),
    ).not.toBeVisible();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('associates the expanded trigger with the content region', async () => {
    const user = userEvent.setup();
    renderCollapsible();
    const trigger = screen.getByRole('button', { name: 'Shipping details' });

    await user.click(trigger);

    const controlledId = trigger.getAttribute('aria-controls');
    expect(controlledId).toBeTruthy();
    expect(document.getElementById(controlledId ?? '')).toContainElement(
      screen.getByText('Ships within two business days.'),
    );
  });

  it('toggles with the keyboard using Enter and Space', async () => {
    const user = userEvent.setup();
    renderCollapsible();
    const trigger = screen.getByRole('button', { name: 'Shipping details' });

    await user.tab();
    expect(trigger).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard(' ');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps focus on the trigger after the content closes', async () => {
    const user = userEvent.setup();
    renderCollapsible({ defaultOpen: true });
    const trigger = screen.getByRole('button', { name: 'Shipping details' });

    await user.click(trigger);

    expect(trigger).toHaveFocus();
  });

  it('keeps multiple independent instances in their own state', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Collapsible>
          <Collapsible.Trigger>First</Collapsible.Trigger>
          <Collapsible.Content>First content</Collapsible.Content>
        </Collapsible>
        <Collapsible>
          <Collapsible.Trigger>Second</Collapsible.Trigger>
          <Collapsible.Content>Second content</Collapsible.Content>
        </Collapsible>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'First' }));

    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByText('First content')).toBeVisible();
    expect(screen.getByText('Second content')).not.toBeVisible();
  });

  it('lets nested instances open and close independently', async () => {
    const user = userEvent.setup();
    render(
      <Collapsible defaultOpen>
        <Collapsible.Trigger>Outer</Collapsible.Trigger>
        <Collapsible.Content>
          <Collapsible>
            <Collapsible.Trigger>Inner</Collapsible.Trigger>
            <Collapsible.Content>Inner content</Collapsible.Content>
          </Collapsible>
        </Collapsible.Content>
      </Collapsible>,
    );
    const outer = screen.getByRole('button', { name: 'Outer' });
    const inner = screen.getByRole('button', { name: 'Inner' });

    await user.click(inner);

    expect(inner).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Inner content')).toBeVisible();
    expect(outer).toHaveAttribute('aria-expanded', 'true');

    await user.click(outer);

    expect(outer).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Inner content')).not.toBeVisible();

    await user.click(outer);

    expect(inner).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders custom trigger content and icons', () => {
    render(
      <Collapsible>
        <Collapsible.Trigger>
          <span>Advanced options</span>
          <ChevronDown aria-hidden="true" data-testid="icon" />
        </Collapsible.Trigger>
        <Collapsible.Content>Options</Collapsible.Content>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Advanced options' });

    expect(trigger).toContainElement(screen.getByTestId('icon'));
    expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders React children and applies custom classes', () => {
    render(
      <Collapsible className="custom-root" defaultOpen>
        <Collapsible.Trigger className="custom-trigger">
          Details
        </Collapsible.Trigger>
        <Collapsible.Content className="custom-content">
          <p>Paragraph</p>
          <strong>Emphasis</strong>
        </Collapsible.Content>
      </Collapsible>,
    );

    expect(document.querySelector('.notable-collapsible')).toHaveClass(
      'custom-root',
    );
    expect(screen.getByRole('button', { name: 'Details' })).toHaveClass(
      'notable-collapsible__trigger',
      'custom-trigger',
    );
    expect(screen.getByText('Paragraph').parentElement).toHaveClass(
      'notable-collapsible__content-inner',
      'custom-content',
    );
    expect(screen.getByText('Emphasis')).toBeVisible();
  });

  it('renders the trigger as a button of type button by default', () => {
    renderCollapsible();

    expect(
      screen.getByRole('button', { name: 'Shipping details' }),
    ).toHaveAttribute('type', 'button');
  });

  it('keeps content mounted so its state survives closing and reopening', async () => {
    const user = userEvent.setup();
    function Stateful() {
      const [value, setValue] = useState('');

      return (
        <Collapsible>
          <Collapsible.Trigger>Notes</Collapsible.Trigger>
          <Collapsible.Content>
            <label>
              Note
              <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />
            </label>
          </Collapsible.Content>
        </Collapsible>
      );
    }
    render(<Stateful />);
    const trigger = screen.getByRole('button', { name: 'Notes' });

    await user.click(trigger);
    await user.type(screen.getByRole('textbox', { name: 'Note' }), 'Draft');
    await user.click(trigger);
    await user.click(trigger);

    expect(screen.getByRole('textbox', { name: 'Note' })).toHaveValue('Draft');
  });
});
