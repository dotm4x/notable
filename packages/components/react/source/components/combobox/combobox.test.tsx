import { useState } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  Combobox,
  type ComboboxOption,
  type ComboboxOptionGroup,
} from './combobox.js';

afterEach(() => {
  cleanup();
});

const fruits: readonly ComboboxOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
];

const groups: readonly ComboboxOptionGroup[] = [
  {
    label: 'Frontend',
    items: [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
    ],
  },
  {
    label: 'Backend',
    items: [{ value: 'go', label: 'Go' }],
  },
];

function renderCombobox(
  props: Partial<React.ComponentProps<typeof Combobox>> = {},
  options: {
    readonly items?: readonly ComboboxOption[] | readonly ComboboxOptionGroup[];
  } = {},
) {
  return render(
    <Combobox items={options.items ?? fruits} {...props}>
      <Combobox.Input label="Fruit" placeholder="Search fruit" />
      <Combobox.Content>
        <Combobox.List />
        <Combobox.Empty>No fruit found.</Combobox.Empty>
      </Combobox.Content>
    </Combobox>,
  );
}

describe('Combobox rendering', () => {
  it('renders an accessible labeled input', () => {
    // Arrange
    renderCombobox();

    // Act
    const input = screen.getByRole('combobox', { name: 'Fruit' });

    // Assert
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input).toHaveAttribute('placeholder', 'Search fruit');
  });

  it('does not show the list until the input is opened', () => {
    // Arrange
    renderCombobox();

    // Act & Assert
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('propagates the disabled state to the input', () => {
    // Arrange
    renderCombobox({ disabled: true });

    // Act
    const input = screen.getByRole('combobox', { name: 'Fruit' });

    // Assert
    expect(input).toBeDisabled();
  });
});

describe('Combobox opening and filtering', () => {
  it('opens the list when the user types into the input', async () => {
    // Arrange
    const user = userEvent.setup();
    renderCombobox();

    const input = screen.getByRole('combobox', { name: 'Fruit' });

    // Act
    await user.click(input);
    await user.type(input, 'b');

    // Assert
    expect(await screen.findByRole('option', { name: 'Banana' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Blueberry' })).toBeVisible();
    expect(
      screen.queryByRole('option', { name: 'Apple' }),
    ).not.toBeInTheDocument();
  });

  it('shows the empty state when no option matches the query', async () => {
    // Arrange
    const user = userEvent.setup();
    renderCombobox();
    const input = screen.getByRole('combobox', { name: 'Fruit' });
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant');

    // Act
    await user.type(input, 'zzz');

    // Assert
    expect(await screen.findByText('No fruit found.')).toBeInTheDocument();
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(input).not.toHaveAttribute('aria-activedescendant');
  });

  it('keeps group headings when filtering grouped items', async () => {
    // Arrange
    const user = userEvent.setup();
    renderCombobox({}, { items: groups });
    const input = screen.getByRole('combobox', { name: 'Fruit' });

    // Act
    await user.click(input);
    await user.type(input, 're');

    // Assert
    expect(await screen.findByRole('option', { name: 'React' })).toBeVisible();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.queryByText('Backend')).not.toBeInTheDocument();
  });
});

describe('Combobox selection', () => {
  it('selects an option with the keyboard and reports the value', async () => {
    // Arrange
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderCombobox({ onValueChange });
    const input = screen.getByRole('combobox', { name: 'Fruit' });

    // Act
    await user.click(input);
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    // Assert
    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith('banana');
    });
    expect(input).toHaveValue('Banana');
  });

  it('selects an option with a pointer click', async () => {
    // Arrange
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderCombobox({ onValueChange });

    // Act
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await user.click(await screen.findByRole('option', { name: 'Cherry' }));

    // Assert
    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith('cherry');
    });
  });

  it('closes the list on Escape without changing the value', async () => {
    // Arrange
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderCombobox({ onValueChange });
    const input = screen.getByRole('combobox', { name: 'Fruit' });
    await user.click(input);
    await screen.findByRole('option', { name: 'Apple' });

    // Act
    await user.keyboard('{Escape}');

    // Assert
    await waitFor(() => {
      expect(
        screen.queryByRole('option', { name: 'Apple' }),
      ).not.toBeInTheDocument();
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('starts with the provided default value', () => {
    // Arrange & Act
    renderCombobox({ defaultValue: 'blueberry' });

    // Assert
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveValue(
      'Blueberry',
    );
  });
});

describe('Combobox clearing', () => {
  it('clears the selection with the clear button', async () => {
    // Arrange
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Combobox
        items={fruits}
        defaultValue="apple"
        onValueChange={onValueChange}
      >
        <Combobox.Input label="Fruit">
          <Combobox.Clear />
        </Combobox.Input>
        <Combobox.Content>
          <Combobox.List />
        </Combobox.Content>
      </Combobox>,
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Clear selection' }));

    // Assert
    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith(null);
    });
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveValue('');
  });
});

describe('Combobox disabled and readOnly states', () => {
  it('does not open when the whole combobox is disabled', async () => {
    // Arrange
    const user = userEvent.setup();
    renderCombobox({ disabled: true });

    // Act
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));

    // Assert
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('does not let a read-only combobox change its value', async () => {
    // Arrange
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderCombobox({ readOnly: true, defaultValue: 'apple', onValueChange });
    const input = screen.getByRole('combobox', { name: 'Fruit' });

    // Act
    await user.click(input);
    await user.keyboard('{ArrowDown}{Enter}');

    // Assert
    expect(onValueChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('Apple');
  });

  it('highlights but does not select a disabled option', async () => {
    // Arrange
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const options: readonly ComboboxOption[] = [
      { value: 'apple', label: 'Apple', disabled: true },
      { value: 'banana', label: 'Banana' },
    ];
    renderCombobox({ onValueChange }, { items: options });
    const input = screen.getByRole('combobox', { name: 'Fruit' });

    // Act
    await user.click(input);
    await user.keyboard('{ArrowDown}{Enter}');

    // Assert
    expect(input).toHaveAttribute(
      'aria-activedescendant',
      expect.stringContaining('-0'),
    );
    expect(onValueChange).not.toHaveBeenCalled();

    // Act
    await user.keyboard('{ArrowDown}{Enter}');

    // Assert
    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith('banana');
    });
  });
});

describe('Combobox controlled state', () => {
  it('reflects the controlled value and reports changes', async () => {
    // Arrange
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState<string | null>('apple');
      return (
        <>
          <Combobox items={fruits} value={value} onValueChange={setValue}>
            <Combobox.Input label="Fruit" />
            <Combobox.Content>
              <Combobox.List />
            </Combobox.Content>
          </Combobox>
          <output aria-label="Current value">{value ?? 'none'}</output>
        </>
      );
    }
    render(<Controlled />);

    // Act
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await user.click(await screen.findByRole('option', { name: 'Cherry' }));

    // Assert
    await waitFor(() => {
      expect(screen.getByLabelText('Current value')).toHaveTextContent(
        'cherry',
      );
    });
  });
});

describe('Combobox form integration', () => {
  it('submits the selected value under the provided name', async () => {
    // Arrange
    const { container } = render(
      <form>
        <Combobox items={fruits} name="fruit" defaultValue="banana">
          <Combobox.Input label="Fruit" />
          <Combobox.Content>
            <Combobox.List />
          </Combobox.Content>
        </Combobox>
      </form>,
    );

    // Act
    const hidden = container.querySelector<HTMLInputElement>(
      'input[name="fruit"]',
    );

    // Assert
    expect(hidden).not.toBeNull();
    expect(hidden?.value).toBe('banana');
  });

  it('marks the input as required when the required prop is set', () => {
    // Arrange & Act
    renderCombobox({ required: true });

    // Assert
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toBeRequired();
  });
});

describe('Combobox groups', () => {
  it('renders group labels with their items', async () => {
    // Arrange
    const user = userEvent.setup();
    renderCombobox({}, { items: groups });

    // Act
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));

    // Assert
    expect(await screen.findByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Go' })).toBeInTheDocument();
  });
});

describe('Combobox animated highlight', () => {
  it('renders a single hidden highlight surface inside the popup', async () => {
    // Arrange
    const user = userEvent.setup();
    renderCombobox();

    // Act
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));

    // Assert
    const listbox = await screen.findByRole('listbox');
    const popup = listbox.closest<HTMLElement>('.notable-combobox__popup');
    const surfaces = popup?.querySelectorAll('.notable-animated-highlight');
    expect(surfaces).toHaveLength(1);
    expect(surfaces?.[0]).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps one highlight surface when the filtered options change', async () => {
    // Arrange
    const user = userEvent.setup();
    renderCombobox();
    const input = screen.getByRole('combobox', { name: 'Fruit' });

    // Act
    await user.type(input, 'ber');

    // Assert
    const listbox = await screen.findByRole('listbox');
    const popup = listbox.closest<HTMLElement>('.notable-combobox__popup');
    expect(popup?.querySelectorAll('.notable-animated-highlight')).toHaveLength(
      1,
    );
    expect(
      screen.queryByRole('option', { name: 'Apple' }),
    ).not.toBeInTheDocument();
  });
});
