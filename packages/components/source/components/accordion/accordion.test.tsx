import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Accordion,
  type AccordionMultipleProps,
  type AccordionSingleProps,
} from './accordion.js';

type SingleOptions = Omit<AccordionSingleProps, 'type' | 'children'>;
type MultipleOptions = Omit<AccordionMultipleProps, 'type' | 'children'>;

function renderSingle(options: SingleOptions = {}) {
  return render(
    <Accordion type="single" {...options}>
      <Accordion.Item value="shipping" title="Shipping">
        Ships within two business days.
      </Accordion.Item>
      <Accordion.Item value="returns" title="Returns">
        Returns accepted for thirty days.
      </Accordion.Item>
      <Accordion.Item value="warranty" title="Warranty" disabled>
        Covered for one year.
      </Accordion.Item>
    </Accordion>,
  );
}

function renderMultiple(options: MultipleOptions = {}) {
  return render(
    <Accordion type="multiple" {...options}>
      <Accordion.Item value="shipping" title="Shipping">
        Ships within two business days.
      </Accordion.Item>
      <Accordion.Item value="returns" title="Returns">
        Returns accepted for thirty days.
      </Accordion.Item>
      <Accordion.Item value="warranty" title="Warranty">
        Covered for one year.
      </Accordion.Item>
    </Accordion>,
  );
}

function getTrigger(name: string) {
  return screen.getByRole('button', { name });
}

function getPanel(triggerName: string) {
  // Base UI keeps closed panels mounted, so locate the panel through its item.
  const trigger = getTrigger(triggerName);
  const panel = trigger
    .closest('.notable-accordion__item')
    ?.querySelector<HTMLElement>('.notable-accordion__panel');

  if (!panel) {
    throw new Error(`Panel for trigger "${triggerName}" was not found.`);
  }

  return panel;
}

describe('Accordion', () => {
  it('renders every item title as a button with its content in a panel', () => {
    renderSingle();

    expect(
      screen.getByRole('button', { name: 'Shipping' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Returns' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Warranty' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Ships within two business days.'),
    ).toBeInTheDocument();
  });

  it('expands and collapses an item when its trigger is clicked', async () => {
    const user = userEvent.setup();
    renderSingle();

    await user.click(getTrigger('Shipping'));

    expect(getTrigger('Shipping')).toHaveAttribute('aria-expanded', 'true');
    expect(getPanel('Shipping')).not.toHaveAttribute('hidden');

    await user.click(getTrigger('Shipping'));

    expect(getTrigger('Shipping')).toHaveAttribute('aria-expanded', 'false');
    expect(getPanel('Shipping')).toHaveAttribute('hidden');
  });

  it('collapses the previously expanded item in single mode', async () => {
    const user = userEvent.setup();
    renderSingle();

    await user.click(getTrigger('Shipping'));
    await user.click(getTrigger('Returns'));

    expect(getTrigger('Shipping')).toHaveAttribute('aria-expanded', 'false');
    expect(getTrigger('Returns')).toHaveAttribute('aria-expanded', 'true');
  });

  it('collapses the expanded item in single mode when it is activated again', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderSingle({ onValueChange });

    await user.click(getTrigger('Shipping'));
    await user.click(getTrigger('Shipping'));

    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(getTrigger('Shipping')).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps several items expanded at once in multiple mode', async () => {
    const user = userEvent.setup();
    renderMultiple();

    await user.click(getTrigger('Shipping'));
    await user.click(getTrigger('Returns'));

    expect(getTrigger('Shipping')).toHaveAttribute('aria-expanded', 'true');
    expect(getTrigger('Returns')).toHaveAttribute('aria-expanded', 'true');
    expect(getTrigger('Warranty')).toHaveAttribute('aria-expanded', 'false');
  });

  it('reports every expanded value in multiple mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderMultiple({ onValueChange });

    await user.click(getTrigger('Shipping'));
    await user.click(getTrigger('Returns'));
    await user.click(getTrigger('Shipping'));

    expect(onValueChange).toHaveBeenNthCalledWith(1, ['shipping']);
    expect(onValueChange).toHaveBeenNthCalledWith(2, ['shipping', 'returns']);
    expect(onValueChange).toHaveBeenNthCalledWith(3, ['returns']);
  });

  it('reports the newly expanded value in single mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderSingle({ onValueChange });

    await user.click(getTrigger('Returns'));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('returns');
  });

  it('keeps the expanded item in controlled single mode until the parent updates value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Accordion type="single" value="shipping" onValueChange={onValueChange}>
        <Accordion.Item value="shipping" title="Shipping">
          Ships within two business days.
        </Accordion.Item>
        <Accordion.Item value="returns" title="Returns">
          Returns accepted for thirty days.
        </Accordion.Item>
      </Accordion>,
    );

    await user.click(getTrigger('Returns'));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('returns');
    expect(getTrigger('Shipping')).toHaveAttribute('aria-expanded', 'true');
    expect(getTrigger('Returns')).toHaveAttribute('aria-expanded', 'false');

    rerender(
      <Accordion type="single" value="returns" onValueChange={onValueChange}>
        <Accordion.Item value="shipping" title="Shipping">
          Ships within two business days.
        </Accordion.Item>
        <Accordion.Item value="returns" title="Returns">
          Returns accepted for thirty days.
        </Accordion.Item>
      </Accordion>,
    );

    expect(getTrigger('Returns')).toHaveAttribute('aria-expanded', 'true');
    expect(getTrigger('Shipping')).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps the expanded items in controlled multiple mode until the parent updates value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function ControlledAccordion() {
      const [expandedValues, setExpandedValues] = useState<string[]>([]);

      return (
        <Accordion
          type="multiple"
          value={expandedValues}
          onValueChange={(nextValues) => {
            onValueChange(nextValues);
            setExpandedValues(nextValues);
          }}
        >
          <Accordion.Item value="shipping" title="Shipping">
            Ships within two business days.
          </Accordion.Item>
          <Accordion.Item value="returns" title="Returns">
            Returns accepted for thirty days.
          </Accordion.Item>
        </Accordion>
      );
    }

    render(<ControlledAccordion />);

    await user.click(getTrigger('Shipping'));
    await user.click(getTrigger('Returns'));

    expect(onValueChange).toHaveBeenLastCalledWith(['shipping', 'returns']);
    expect(getTrigger('Shipping')).toHaveAttribute('aria-expanded', 'true');
    expect(getTrigger('Returns')).toHaveAttribute('aria-expanded', 'true');
  });

  it('does not change state in controlled mode when the parent ignores changes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Accordion type="multiple" value={[]} onValueChange={onValueChange}>
        <Accordion.Item value="shipping" title="Shipping">
          Ships within two business days.
        </Accordion.Item>
      </Accordion>,
    );

    await user.click(getTrigger('Shipping'));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(['shipping']);
    expect(getTrigger('Shipping')).toHaveAttribute('aria-expanded', 'false');
  });

  it('expands the defaultValue item in single mode', () => {
    renderSingle({ defaultValue: 'returns' });

    expect(getTrigger('Returns')).toHaveAttribute('aria-expanded', 'true');
    expect(getTrigger('Shipping')).toHaveAttribute('aria-expanded', 'false');
  });

  it('expands every defaultValue item in multiple mode', () => {
    renderMultiple({ defaultValue: ['shipping', 'warranty'] });

    expect(getTrigger('Shipping')).toHaveAttribute('aria-expanded', 'true');
    expect(getTrigger('Returns')).toHaveAttribute('aria-expanded', 'false');
    expect(getTrigger('Warranty')).toHaveAttribute('aria-expanded', 'true');
  });

  it('prevents interaction with every item when the accordion is disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderMultiple({ disabled: true, onValueChange });

    for (const name of ['Shipping', 'Returns', 'Warranty']) {
      expect(getTrigger(name)).toBeDisabled();
    }

    await user.click(getTrigger('Shipping'));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(getTrigger('Shipping')).toHaveAttribute('aria-expanded', 'false');
  });

  it('prevents interaction only with a disabled item', async () => {
    const user = userEvent.setup();
    renderSingle();

    expect(getTrigger('Warranty')).toBeDisabled();

    await user.click(getTrigger('Warranty'));

    expect(getTrigger('Warranty')).toHaveAttribute('aria-expanded', 'false');

    await user.click(getTrigger('Shipping'));

    expect(getTrigger('Shipping')).toHaveAttribute('aria-expanded', 'true');
  });

  it('links each trigger to its panel', async () => {
    const user = userEvent.setup();
    renderSingle();

    await user.click(getTrigger('Shipping'));

    const trigger = getTrigger('Shipping');
    const panel = document.getElementById(
      trigger.getAttribute('aria-controls') ?? '',
    );

    expect(panel).not.toBeNull();
    expect(
      within(panel as HTMLElement).getByText('Ships within two business days.'),
    ).toBeVisible();
    expect(panel).toHaveAccessibleName('Shipping');
  });

  it('exposes each title as a level 3 heading that wraps its trigger', () => {
    renderSingle();

    const heading = screen.getByRole('heading', { level: 3, name: 'Shipping' });

    expect(
      within(heading).getByRole('button', { name: 'Shipping' }),
    ).toBeInTheDocument();
  });

  it('generates unique trigger and panel IDs across accordions', () => {
    render(
      <>
        <Accordion type="single" defaultValue="shipping">
          <Accordion.Item value="shipping" title="Shipping">
            First content.
          </Accordion.Item>
        </Accordion>
        <Accordion type="single" defaultValue="shipping">
          <Accordion.Item value="shipping" title="Shipping">
            Second content.
          </Accordion.Item>
        </Accordion>
      </>,
    );

    const triggers = screen.getAllByRole('button', { name: 'Shipping' });
    const ids = triggers.map((trigger) => trigger.id);
    const panelIds = triggers.map((trigger) =>
      trigger.getAttribute('aria-controls'),
    );

    expect(new Set(ids).size).toBe(2);
    expect(new Set(panelIds).size).toBe(2);
  });

  it('activates a trigger with Enter and Space', async () => {
    const user = userEvent.setup();
    renderMultiple();

    getTrigger('Shipping').focus();
    await user.keyboard('{Enter}');

    expect(getTrigger('Shipping')).toHaveAttribute('aria-expanded', 'true');

    getTrigger('Returns').focus();
    await user.keyboard(' ');

    expect(getTrigger('Returns')).toHaveAttribute('aria-expanded', 'true');
  });

  it('moves focus between triggers with ArrowDown and ArrowUp, wrapping at the ends', async () => {
    const user = userEvent.setup();
    renderMultiple();

    getTrigger('Shipping').focus();
    await user.keyboard('{ArrowDown}');

    expect(getTrigger('Returns')).toHaveFocus();

    await user.keyboard('{ArrowDown}{ArrowDown}');

    expect(getTrigger('Shipping')).toHaveFocus();

    await user.keyboard('{ArrowUp}');

    expect(getTrigger('Warranty')).toHaveFocus();
  });

  it('moves focus to the first and last enabled triggers with Home and End', async () => {
    const user = userEvent.setup();
    renderSingle();

    getTrigger('Returns').focus();
    await user.keyboard('{End}');

    expect(getTrigger('Returns')).toHaveFocus();

    await user.keyboard('{Home}');

    expect(getTrigger('Shipping')).toHaveFocus();
  });

  it('skips disabled triggers during arrow-key navigation', async () => {
    const user = userEvent.setup();
    renderSingle();

    getTrigger('Returns').focus();
    await user.keyboard('{ArrowDown}');

    expect(getTrigger('Shipping')).toHaveFocus();
  });

  it('keeps arrow-key navigation within a nested accordion', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="multiple" defaultValue={['outer']}>
        <Accordion.Item value="outer" title="Outer">
          <Accordion type="single">
            <Accordion.Item value="inner-one" title="Inner one">
              First nested content.
            </Accordion.Item>
            <Accordion.Item value="inner-two" title="Inner two">
              Second nested content.
            </Accordion.Item>
          </Accordion>
        </Accordion.Item>
        <Accordion.Item value="other" title="Other">
          Other content.
        </Accordion.Item>
      </Accordion>,
    );

    getTrigger('Inner one').focus();
    await user.keyboard('{ArrowDown}');

    expect(getTrigger('Inner two')).toHaveFocus();

    await user.keyboard('{ArrowDown}');

    expect(getTrigger('Inner one')).toHaveFocus();
  });

  it('throws when an item is rendered outside an accordion', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() =>
      render(
        <Accordion.Item value="loose" title="Loose">
          Content
        </Accordion.Item>,
      ),
    ).toThrow('AccordionRootContext is missing');

    consoleError.mockRestore();
  });

  it('exposes Accordion.Root as the root component', () => {
    expect(Accordion.Root).toBe(Accordion);
  });
});
