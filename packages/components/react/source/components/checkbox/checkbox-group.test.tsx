import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './checkbox.js';
import { CheckboxGroup } from './checkbox-group.js';
import {
  Checkbox as PublicCheckbox,
  CheckboxGroup as PublicCheckboxGroup,
} from '../../index.js';

function NotificationGroup(props: {
  defaultValue?: readonly string[];
  disabled?: boolean;
  onValueChange?: (value: string[]) => void;
}) {
  return (
    <CheckboxGroup
      label="Notifications"
      description="Choose which notifications you want to receive."
      {...props}
    >
      <CheckboxGroup.Item value="email" label="Email notifications" />
      <CheckboxGroup.Item value="push" label="Push notifications" />
      <CheckboxGroup.Item value="marketing" label="Marketing updates" />
    </CheckboxGroup>
  );
}

function ControlledNotificationGroup({
  onValueChange,
}: {
  onValueChange: (value: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>(['email']);

  return (
    <CheckboxGroup
      label="Notifications"
      value={selected}
      onValueChange={(nextValue) => {
        setSelected(nextValue);
        onValueChange(nextValue);
      }}
    >
      <CheckboxGroup.Item value="email" label="Email notifications" />
      <CheckboxGroup.Item value="push" label="Push notifications" />
    </CheckboxGroup>
  );
}

describe('CheckboxGroup', () => {
  it('renders a named group with its description and options', () => {
    render(<NotificationGroup />);

    const group = screen.getByRole('group', { name: 'Notifications' });

    expect(group).toHaveAccessibleDescription(
      'Choose which notifications you want to receive.',
    );
    expect(
      screen.getByRole('checkbox', { name: 'Email notifications' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Push notifications' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Marketing updates' }),
    ).toBeInTheDocument();
  });

  it('selects and deselects multiple options in uncontrolled mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<NotificationGroup onValueChange={onValueChange} />);

    await user.click(screen.getByText('Email notifications'));
    await user.click(screen.getByText('Push notifications'));

    expect(
      screen.getByRole('checkbox', { name: 'Email notifications' }),
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Push notifications' }),
    ).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith(['email', 'push']);

    await user.click(screen.getByText('Email notifications'));

    expect(
      screen.getByRole('checkbox', { name: 'Email notifications' }),
    ).not.toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith(['push']);
  });

  it('initializes uncontrolled selection from defaultValue', () => {
    render(<NotificationGroup defaultValue={['push']} />);

    expect(
      screen.getByRole('checkbox', { name: 'Push notifications' }),
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Email notifications' }),
    ).not.toBeChecked();
  });

  it('starts with no selection when defaultValue is empty or omitted', () => {
    render(<NotificationGroup defaultValue={[]} />);

    screen.getAllByRole('checkbox').forEach((checkbox) => {
      expect(checkbox).not.toBeChecked();
    });
  });

  it('reflects controlled values and reports the next selection', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <CheckboxGroup
        label="Notifications"
        value={['email']}
        onValueChange={onValueChange}
      >
        <CheckboxGroup.Item value="email" label="Email notifications" />
        <CheckboxGroup.Item value="push" label="Push notifications" />
      </CheckboxGroup>,
    );

    await user.click(screen.getByText('Push notifications'));

    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith(['email', 'push']);
    expect(
      screen.getByRole('checkbox', { name: 'Push notifications' }),
    ).not.toBeChecked();
  });

  it('updates controlled selection through state', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<ControlledNotificationGroup onValueChange={onValueChange} />);

    await user.click(screen.getByText('Push notifications'));

    expect(onValueChange).toHaveBeenLastCalledWith(['email', 'push']);
    expect(
      screen.getByRole('checkbox', { name: 'Push notifications' }),
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Email notifications' }),
    ).toBeChecked();
  });

  it('disables every option when the group is disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <NotificationGroup
        disabled
        defaultValue={['email']}
        onValueChange={onValueChange}
      />,
    );

    const group = screen.getByRole('group', { name: 'Notifications' });
    const checkbox = screen.getByRole('checkbox', {
      name: 'Email notifications',
    });

    expect(group).toBeDisabled();
    expect(checkbox).toBeDisabled();
    expect(
      screen.getByRole('checkbox', { name: 'Push notifications' }),
    ).toBeDisabled();

    await user.click(screen.getByText('Push notifications'));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(
      screen.getByRole('checkbox', { name: 'Push notifications' }),
    ).not.toBeChecked();
  });

  it('disables only the items marked as disabled', () => {
    render(
      <CheckboxGroup label="Data sharing">
        <CheckboxGroup.Item value="analytics" label="Usage analytics" />
        <CheckboxGroup.Item value="ads" label="Personalized ads" disabled />
      </CheckboxGroup>,
    );

    expect(
      screen.getByRole('checkbox', { name: 'Usage analytics' }),
    ).toBeEnabled();
    expect(
      screen.getByRole('checkbox', { name: 'Personalized ads' }),
    ).toBeDisabled();
  });

  it('prevents a disabled item from changing the selection', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <CheckboxGroup
        label="Data sharing"
        defaultValue={['analytics']}
        onValueChange={onValueChange}
      >
        <CheckboxGroup.Item value="analytics" label="Usage analytics" />
        <CheckboxGroup.Item value="ads" label="Personalized ads" disabled />
      </CheckboxGroup>,
    );

    await user.click(screen.getByText('Personalized ads'));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(
      screen.getByRole('checkbox', { name: 'Personalized ads' }),
    ).not.toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Usage analytics' }),
    ).toBeChecked();
  });

  it('associates item descriptions with their checkboxes', () => {
    render(
      <CheckboxGroup label="Visibility">
        <CheckboxGroup.Item
          value="activity"
          label="Activity status"
          description="Let others see when you were last active."
        />
      </CheckboxGroup>,
    );

    expect(
      screen.getByRole('checkbox', { name: 'Activity status' }),
    ).toHaveAccessibleDescription('Let others see when you were last active.');
  });

  it('toggles options with the keyboard', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<NotificationGroup onValueChange={onValueChange} />);

    await user.tab();
    expect(
      screen.getByRole('checkbox', { name: 'Email notifications' }),
    ).toHaveFocus();

    await user.keyboard(' ');

    expect(onValueChange).toHaveBeenLastCalledWith(['email']);
    expect(
      screen.getByRole('checkbox', { name: 'Email notifications' }),
    ).toBeChecked();
  });

  it('forwards the item value to the native input', () => {
    render(
      <CheckboxGroup label="Notifications">
        <CheckboxGroup.Item value="email" label="Email notifications" />
      </CheckboxGroup>,
    );

    expect(
      screen.getByRole('checkbox', { name: 'Email notifications' }),
    ).toHaveAttribute('value', 'email');
  });

  it('throws when an item is rendered outside a group', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    expect(() =>
      render(<CheckboxGroup.Item value="email" label="Email" />),
    ).toThrow('CheckboxGroup.Item must be rendered inside a CheckboxGroup.');

    consoleError.mockRestore();
  });

  it('keeps the standalone Checkbox working alongside the group', async () => {
    const user = userEvent.setup();

    render(
      <>
        <Checkbox label="Standalone option" />
        <NotificationGroup />
      </>,
    );

    await user.click(screen.getByText('Standalone option'));

    expect(
      screen.getByRole('checkbox', { name: 'Standalone option' }),
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Email notifications' }),
    ).not.toBeChecked();
  });

  it('is exported from the package entry point', () => {
    expect(PublicCheckboxGroup).toBe(CheckboxGroup);
    expect(PublicCheckbox).toBe(Checkbox);
  });
});
