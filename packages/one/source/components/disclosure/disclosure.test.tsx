import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Disclosure as PublicDisclosure } from '../../components/index.js';
import { Disclosure } from './disclosure.js';

describe('Disclosure', () => {
  it('is exported from the components entry point', () => {
    expect(PublicDisclosure).toBe(Disclosure);
  });

  it('renders the title as the trigger name and keeps content hidden', () => {
    render(
      <Disclosure title="SVG markup">
        <code>&lt;svg /&gt;</code>
      </Disclosure>,
    );

    const trigger = screen.getByRole('button', { name: 'SVG markup' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveClass('one-disclosure__trigger');
    expect(trigger.closest('.one-disclosure')).not.toBeNull();
    expect(screen.getByText('<svg />')).not.toBeVisible();
  });

  it('marks the decorative chevron as hidden', () => {
    const { container } = render(
      <Disclosure title="SVG markup">Markup</Disclosure>,
    );

    const chevron = container.querySelector('.one-disclosure__chevron');

    expect(chevron).toHaveAttribute('aria-hidden', 'true');
  });

  it('opens and closes the content through the trigger', async () => {
    const user = userEvent.setup();
    render(
      <Disclosure title="SVG markup">
        <code>&lt;svg /&gt;</code>
      </Disclosure>,
    );
    const trigger = screen.getByRole('button', { name: 'SVG markup' });

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('<svg />')).toBeVisible();

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('<svg />')).not.toBeVisible();
  });

  it('shows the content initially when defaultOpen is set', () => {
    render(
      <Disclosure defaultOpen title="SVG markup">
        <code>&lt;svg /&gt;</code>
      </Disclosure>,
    );

    expect(screen.getByRole('button', { name: 'SVG markup' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByText('<svg />')).toBeVisible();
  });

  it('reports the next expanded state and follows the open prop', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    function Controlled() {
      const [open, setOpen] = useState(false);

      return (
        <Disclosure
          onOpenChange={(nextOpen) => {
            onOpenChange(nextOpen);
            setOpen(nextOpen);
          }}
          open={open}
          title="SVG markup"
        >
          Markup
        </Disclosure>
      );
    }

    render(<Controlled />);
    const trigger = screen.getByRole('button', { name: 'SVG markup' });

    await user.click(trigger);

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Disclosure disabled onOpenChange={onOpenChange} title="SVG markup">
        Markup
      </Disclosure>,
    );
    const trigger = screen.getByRole('button', { name: 'SVG markup' });

    await user.click(trigger);

    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('forwards the ref and merges custom classes', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Disclosure className="custom" ref={ref} title="SVG markup">
        Markup
      </Disclosure>,
    );

    expect(ref.current).toBe(container.querySelector('.one-disclosure'));
    expect(ref.current).toHaveClass('one-disclosure', 'custom');
  });
});
