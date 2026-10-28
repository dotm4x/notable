import { createRef, useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup, RadioGroupItem } from './radio-group.js';

function renderPlanGroup(
  groupProps: Partial<Parameters<typeof RadioGroup>[0]> = {},
) {
  return render(
    <RadioGroup label="Plan" {...groupProps}>
      <RadioGroupItem value="free" label="Free" />
      <RadioGroupItem value="pro" label="Pro" />
      <RadioGroupItem value="team" label="Team" />
    </RadioGroup>,
  );
}

describe('RadioGroup', () => {
  it('renders a named group with one native radio per option', () => {
    renderPlanGroup();

    const group = screen.getByRole('group', { name: 'Plan' });
    const radios = within(group).getAllByRole('radio');

    expect(radios.map((radio) => radio.getAttribute('value'))).toEqual([
      'free',
      'pro',
      'team',
    ]);
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute(
      'type',
      'radio',
    );
  });

  it('shares one generated form name across every option', () => {
    renderPlanGroup();

    const names = screen
      .getAllByRole('radio')
      .map((radio) => radio.getAttribute('name'));

    expect(names[0]).toBeTruthy();
    expect(new Set(names).size).toBe(1);
  });

  it('uses the provided name for every option', () => {
    renderPlanGroup({ name: 'plan' });

    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toHaveAttribute('name', 'plan');
    }
  });

  it('selects the defaultValue on initial render', () => {
    renderPlanGroup({ defaultValue: 'pro' });

    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Free' })).not.toBeChecked();
  });

  it('supports uncontrolled selection and reports changes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderPlanGroup({ onValueChange });

    await user.click(screen.getByText('Team'));

    expect(screen.getByRole('radio', { name: 'Team' })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('team');
  });

  it('keeps the selection controlled by the value prop', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderPlanGroup({ value: 'free', onValueChange });

    await user.click(screen.getByText('Pro'));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('pro');
    expect(screen.getByRole('radio', { name: 'Free' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Pro' })).not.toBeChecked();
  });

  it('updates the checked option when the controlled value changes', () => {
    const { rerender } = renderPlanGroup({ value: 'free' });

    rerender(
      <RadioGroup label="Plan" value="team">
        <RadioGroupItem value="free" label="Free" />
        <RadioGroupItem value="pro" label="Pro" />
        <RadioGroupItem value="team" label="Team" />
      </RadioGroup>,
    );

    expect(screen.getByRole('radio', { name: 'Team' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Free' })).not.toBeChecked();
  });

  it('supports a parent component that owns the selection state', async () => {
    const user = userEvent.setup();

    function ControlledPlan() {
      const [plan, setPlan] = useState('free');
      return (
        <>
          <output>{`Selected: ${plan}`}</output>
          <RadioGroup label="Plan" value={plan} onValueChange={setPlan}>
            <RadioGroupItem value="free" label="Free" />
            <RadioGroupItem value="pro" label="Pro" />
          </RadioGroup>
        </>
      );
    }

    render(<ControlledPlan />);

    await user.click(screen.getByText('Pro'));

    expect(screen.getByText('Selected: pro')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
  });

  it('forwards native change handlers on options', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <RadioGroup label="Plan">
        <RadioGroupItem value="free" label="Free" onChange={onChange} />
        <RadioGroupItem value="pro" label="Pro" />
      </RadioGroup>,
    );

    await user.click(screen.getByText('Free'));

    expect(onChange).toHaveBeenCalledOnce();
  });

  it('disables every option when the group is disabled', () => {
    renderPlanGroup({ disabled: true });

    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeDisabled();
    }
    expect(screen.getByRole('group', { name: 'Plan' })).toBeDisabled();
  });

  it('does not select an option when the group is disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderPlanGroup({ disabled: true, onValueChange });

    await user.click(screen.getByText('Pro'));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: 'Pro' })).not.toBeChecked();
  });

  it('disables only the individual option marked as disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <RadioGroup label="Plan" onValueChange={onValueChange}>
        <RadioGroupItem value="free" label="Free" />
        <RadioGroupItem value="pro" label="Pro" disabled />
      </RadioGroup>,
    );

    expect(screen.getByRole('radio', { name: 'Free' })).toBeEnabled();
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeDisabled();

    await user.click(screen.getByText('Pro'));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('marks every option as required and blocks submission until one is selected', () => {
    const { container } = render(
      <form>
        <RadioGroup label="Plan" name="plan" required>
          <RadioGroupItem value="free" label="Free" />
          <RadioGroupItem value="pro" label="Pro" />
        </RadioGroup>
      </form>,
    );
    const form = container.querySelector('form');

    if (!form) {
      throw new Error('Expected the radio group to be rendered inside a form.');
    }

    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeRequired();
    }
    expect(form.checkValidity()).toBe(false);

    fireEvent.click(screen.getByRole('radio', { name: 'Pro' }));

    expect(form.checkValidity()).toBe(true);
  });

  it('moves selection and focus with arrow keys', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderPlanGroup({ defaultValue: 'free', onValueChange });

    await user.tab();
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveFocus();

    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('pro');
  });

  it('moves selection to the first and last enabled options with Home and End', async () => {
    // Arrange
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup label="Plan" defaultValue="pro" onValueChange={onValueChange}>
        <RadioGroupItem value="free" label="Free" disabled />
        <RadioGroupItem value="pro" label="Pro" />
        <RadioGroupItem value="team" label="Team" />
        <RadioGroupItem value="legacy" label="Legacy" disabled />
      </RadioGroup>,
    );
    await user.tab();

    // Act
    await user.keyboard('{End}');

    // Assert
    expect(screen.getByRole('radio', { name: 'Team' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Team' })).toHaveFocus();

    // Act
    await user.keyboard('{Home}');

    // Assert
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveFocus();
    expect(onValueChange).toHaveBeenNthCalledWith(1, 'team');
    expect(onValueChange).toHaveBeenNthCalledWith(2, 'pro');
  });

  it('exposes the selected option as the only Tab stop', async () => {
    const user = userEvent.setup();

    renderPlanGroup({ defaultValue: 'pro' });

    await user.tab();

    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveFocus();

    await user.tab();

    expect(screen.getByRole('radio', { name: 'Pro' })).not.toHaveFocus();
  });

  it('submits the selected value with the form', () => {
    const { container } = render(
      <form>
        <RadioGroup label="Plan" name="plan" defaultValue="team">
          <RadioGroupItem value="free" label="Free" />
          <RadioGroupItem value="team" label="Team" />
        </RadioGroup>
      </form>,
    );
    const form = container.querySelector('form');

    if (!form) {
      throw new Error('Expected the radio group to be rendered inside a form.');
    }

    expect(new FormData(form).get('plan')).toBe('team');

    fireEvent.click(screen.getByRole('radio', { name: 'Free' }));

    expect(new FormData(form).get('plan')).toBe('free');
  });

  it('labels the group through its legend and aria-labelledby', () => {
    render(
      <>
        <span id="plan-heading">Subscription plan</span>
        <RadioGroup aria-labelledby="plan-heading">
          <RadioGroupItem value="free" label="Free" />
        </RadioGroup>
      </>,
    );

    expect(
      screen.getByRole('group', { name: 'Subscription plan' }),
    ).toBeInTheDocument();
  });

  it('associates the group description with the fieldset', () => {
    renderPlanGroup({ description: 'You can change your plan at any time.' });

    const group = screen.getByRole('group', { name: 'Plan' });
    const description = screen.getByText(
      'You can change your plan at any time.',
    );

    expect(group).toHaveAttribute('aria-describedby', description.id);
  });

  it('associates option descriptions and preserves existing described-by IDs', () => {
    render(
      <RadioGroup label="Plan">
        <span id="external-help">Prices include tax.</span>
        <RadioGroupItem
          value="pro"
          label="Pro"
          aria-describedby="external-help"
          description="Advanced features for teams."
        />
      </RadioGroup>,
    );

    const radio = screen.getByRole('radio', { name: 'Pro' });
    const description = screen.getByText('Advanced features for teams.');

    expect(radio.getAttribute('aria-describedby')).toBe(
      `external-help ${description.id}`,
    );
    expect(radio).toHaveAccessibleDescription(
      'Prices include tax. Advanced features for teams.',
    );
  });

  it('keeps option descriptions out of the option accessible name', () => {
    render(
      <RadioGroup label="Plan">
        <RadioGroupItem
          value="pro"
          label="Pro"
          description="Advanced features for teams."
        />
      </RadioGroup>,
    );

    expect(screen.getByRole('radio')).toHaveAccessibleName('Pro');
  });

  it('forwards refs to the fieldset and to each native option', () => {
    const groupRef = createRef<HTMLFieldSetElement>();
    const itemRef = createRef<HTMLInputElement>();

    render(
      <RadioGroup ref={groupRef} label="Plan">
        <RadioGroupItem ref={itemRef} value="free" label="Free" />
      </RadioGroup>,
    );

    expect(groupRef.current).toBe(screen.getByRole('group', { name: 'Plan' }));
    expect(itemRef.current).toBe(screen.getByRole('radio', { name: 'Free' }));
  });

  it('applies the orientation and size classes to the group', () => {
    renderPlanGroup({ orientation: 'horizontal', size: 'large' });

    const group = screen.getByRole('group', { name: 'Plan' });

    expect(group).toHaveClass('notable-radio-group--horizontal');
    expect(group).toHaveClass('notable-radio-group--large');
  });

  it('exposes RadioGroup.Item as the same component as RadioGroupItem', () => {
    expect(RadioGroup.Item).toBe(RadioGroupItem);
  });
});
