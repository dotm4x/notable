import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Checkbox } from '../checkbox/checkbox.js';
import { CheckboxGroup } from '../checkbox/checkbox-group.js';
import { Field } from '../field/field.js';
import { Input } from '../input/input.js';
import { RadioGroup, RadioGroupItem } from '../radio-group/radio-group.js';
import { Fieldset } from './fieldset.js';

describe('Fieldset', () => {
  it('names the group with its legend', () => {
    render(
      <Fieldset.Root>
        <Fieldset.Legend>Contact</Fieldset.Legend>
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Field.Control />
        </Field.Root>
      </Fieldset.Root>,
    );

    const group = screen.getByRole('group', { name: 'Contact' });
    expect(group.tagName).toBe('FIELDSET');
    expect(screen.getByRole('group', { name: 'Contact' })).toContainElement(
      screen.getByLabelText('Email'),
    );
  });

  it('renders the legend as a native legend element', () => {
    render(
      <Fieldset.Root>
        <Fieldset.Legend>Contact</Fieldset.Legend>
      </Fieldset.Root>,
    );

    expect(screen.getByText('Contact').tagName).toBe('LEGEND');
  });

  it('disables native controls and nested fields when disabled', () => {
    const { container } = render(
      <Fieldset.Root disabled>
        <Fieldset.Legend>Notifications</Fieldset.Legend>
        <Checkbox label="Email" />
        <Field.Root>
          <Field.Label>Name</Field.Label>
          <Field.Control />
        </Field.Root>
      </Fieldset.Root>,
    );

    expect(screen.getByRole('checkbox', { name: 'Email' })).toBeDisabled();
    expect(screen.getByLabelText('Name')).toBeDisabled();
    expect(container.querySelector('.notable-field')).toHaveAttribute(
      'data-disabled',
    );
  });

  it('disables an Input nested in a disabled fieldset', () => {
    const { container } = render(
      <Fieldset.Root disabled>
        <Fieldset.Legend>Profile</Fieldset.Legend>
        <Input label="Display name" />
      </Fieldset.Root>,
    );

    expect(screen.getByLabelText('Display name')).toBeDisabled();
    expect(container.querySelector('.notable-field')).toHaveAttribute(
      'data-disabled',
    );
  });

  it('keeps controls enabled when the fieldset is not disabled', () => {
    render(
      <Fieldset.Root>
        <Fieldset.Legend>Notifications</Fieldset.Legend>
        <Checkbox label="Email" />
      </Fieldset.Root>,
    );

    expect(screen.getByRole('checkbox', { name: 'Email' })).toBeEnabled();
  });

  it('disables only an individually disabled control', () => {
    render(
      <Fieldset.Root>
        <Fieldset.Legend>Notifications</Fieldset.Legend>
        <Checkbox label="Email" disabled />
        <Checkbox label="Push" />
      </Fieldset.Root>,
    );

    expect(screen.getByRole('checkbox', { name: 'Email' })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: 'Push' })).toBeEnabled();
  });

  it('contains nested checkbox and radio groups', () => {
    render(
      <Fieldset.Root>
        <Fieldset.Legend>Preferences</Fieldset.Legend>
        <CheckboxGroup label="Channels">
          <CheckboxGroup.Item value="email" label="Email" />
        </CheckboxGroup>
        <RadioGroup label="Digest">
          <RadioGroupItem value="daily" label="Daily" />
        </RadioGroup>
      </Fieldset.Root>,
    );

    expect(
      screen.getByRole('group', { name: 'Preferences' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Channels' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Daily' })).toBeInTheDocument();
  });

  it('forwards the ref to the fieldset element', () => {
    const ref = createRef<HTMLFieldSetElement>();
    render(
      <Fieldset.Root ref={ref}>
        <Fieldset.Legend>Contact</Fieldset.Legend>
      </Fieldset.Root>,
    );

    expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
    expect(ref.current).toBe(screen.getByRole('group', { name: 'Contact' }));
  });

  it('forwards the ref to the legend element', () => {
    const ref = createRef<HTMLLegendElement>();
    render(
      <Fieldset.Root>
        <Fieldset.Legend ref={ref}>Contact</Fieldset.Legend>
      </Fieldset.Root>,
    );

    expect(ref.current).toBeInstanceOf(HTMLLegendElement);
  });

  it('passes native attributes and class names through', () => {
    const { container } = render(
      <Fieldset.Root
        name="contact"
        className="custom"
        data-testid="contact-fieldset"
      >
        <Fieldset.Legend className="custom-legend">Contact</Fieldset.Legend>
      </Fieldset.Root>,
    );

    const fieldset = screen.getByTestId('contact-fieldset');
    expect(fieldset).toHaveAttribute('name', 'contact');
    expect(fieldset).toHaveClass('notable-fieldset', 'custom');
    expect(container.querySelector('legend')).toHaveClass(
      'notable-fieldset__legend',
      'custom-legend',
    );
  });
});
