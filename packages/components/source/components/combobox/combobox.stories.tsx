import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, FormEvent } from 'react';
import { useState } from 'react';
import { Button } from '../button/button.js';
import {
  Combobox,
  type ComboboxOption,
  type ComboboxOptionGroup,
  type ComboboxProps,
} from './combobox.js';

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<Partial<ComboboxProps>>;

const fruitOptions: readonly ComboboxOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
  { value: 'blackberry', label: 'Blackberry' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'kiwi', label: 'Kiwi' },
  { value: 'lemon', label: 'Lemon' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
  { value: 'papaya', label: 'Papaya' },
];

const fruitOptionsWithDisabled: readonly ComboboxOption[] = fruitOptions.map(
  (option) => ({
    ...option,
    disabled: option.value === 'blackberry' || option.value === 'papaya',
  }),
);

const groupedOptions: readonly ComboboxOptionGroup[] = [
  {
    label: 'Frontend',
    items: [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
      { value: 'svelte', label: 'Svelte' },
    ],
  },
  {
    label: 'Backend',
    items: [
      { value: 'node', label: 'Node.js' },
      { value: 'go', label: 'Go' },
      { value: 'rust', label: 'Rust' },
    ],
  },
];

const longOptions: readonly ComboboxOption[] = Array.from(
  { length: 200 },
  (_, index) => ({
    value: `item-${index + 1}`,
    label: `Option ${index + 1}`,
  }),
);

const stackStyle: CSSProperties = {
  display: 'grid',
  gap: '1rem',
  width: 'min(100%, 22rem)',
};

const narrowStyle: CSSProperties = {
  display: 'grid',
  gap: '1rem',
  width: '12rem',
};

const formStyle: CSSProperties = {
  display: 'grid',
  gap: '1rem',
  width: 'min(100%, 22rem)',
  margin: 0,
};

function ControlledCombobox() {
  const [value, setValue] = useState<string | null>('banana');

  return (
    <div style={stackStyle}>
      <Combobox items={fruitOptions} value={value} onValueChange={setValue}>
        <Combobox.Input label="Fruit" placeholder="Search fruit" />
        <Combobox.Content>
          <Combobox.List />
        </Combobox.Content>
      </Combobox>
      <p>Selected value: {value ?? 'none'}</p>
      <Button variant="secondary" onClick={() => setValue(null)}>
        Reset selection
      </Button>
    </div>
  );
}

function RequiredFormCombobox() {
  const [submitted, setSubmitted] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitted(String(formData.get('fruit') ?? ''));
  }

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <Combobox items={fruitOptions} name="fruit" required>
        <Combobox.Input
          label="Favorite fruit"
          description="Required. Choose one option."
          placeholder="Search fruit"
        />
        <Combobox.Content>
          <Combobox.List />
          <Combobox.Empty>No fruit found.</Combobox.Empty>
        </Combobox.Content>
      </Combobox>
      <Button type="submit" variant="primary">
        Save preference
      </Button>
      {submitted !== null && <p>Saved value: {submitted}</p>}
    </form>
  );
}

function RealisticFormExample() {
  const [submitted, setSubmitted] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitted(
      [formData.get('framework'), formData.get('language')]
        .map(String)
        .join(' / '),
    );
  }

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <Combobox items={groupedOptions} name="framework">
        <Combobox.Input
          label="Framework"
          placeholder="Search frameworks"
          description="Grouped by layer."
        />
        <Combobox.Content>
          <Combobox.List />
          <Combobox.Empty>No frameworks match your search.</Combobox.Empty>
        </Combobox.Content>
      </Combobox>
      <Combobox items={fruitOptions} name="language">
        <Combobox.Input label="Preferred language" placeholder="Search" />
        <Combobox.Content>
          <Combobox.List />
        </Combobox.Content>
      </Combobox>
      <Button type="submit" variant="primary">
        Create project
      </Button>
      {submitted !== null && <p>Submitted: {submitted}</p>}
    </form>
  );
}

/** Single-select combobox with a searchable list of options. */
export const Default: Story = {
  render: () => (
    <div style={stackStyle}>
      <Combobox items={fruitOptions}>
        <Combobox.Input label="Fruit" placeholder="Search fruit" />
        <Combobox.Content>
          <Combobox.List />
          <Combobox.Empty>No fruit found.</Combobox.Empty>
        </Combobox.Content>
      </Combobox>
    </div>
  ),
};

/** Typing filters the list. Press Arrow keys to move through the matches. */
export const Searchable: Story = {
  render: () => (
    <div style={stackStyle}>
      <Combobox items={fruitOptions}>
        <Combobox.Input label="Search fruit" placeholder="Type to filter" />
        <Combobox.Content>
          <Combobox.List />
          <Combobox.Empty>No fruit found.</Combobox.Empty>
        </Combobox.Content>
      </Combobox>
    </div>
  ),
};

/** The combobox starts with a selected value shown in the input. */
export const Preselected: Story = {
  render: () => (
    <div style={stackStyle}>
      <Combobox items={fruitOptions} defaultValue="mango">
        <Combobox.Input label="Fruit" />
        <Combobox.Content>
          <Combobox.List />
        </Combobox.Content>
      </Combobox>
    </div>
  ),
};

/** A clear button removes the selection and returns focus to the input. */
export const Clearable: Story = {
  render: () => (
    <div style={stackStyle}>
      <Combobox items={fruitOptions} defaultValue="kiwi">
        <Combobox.Input label="Fruit">
          <Combobox.Clear />
          <Combobox.Trigger />
        </Combobox.Input>
        <Combobox.Content>
          <Combobox.List />
          <Combobox.Empty>No fruit found.</Combobox.Empty>
        </Combobox.Content>
      </Combobox>
    </div>
  ),
};

/** The whole combobox is disabled and cannot be focused or opened. */
export const Disabled: Story = {
  render: () => (
    <div style={stackStyle}>
      <Combobox items={fruitOptions} disabled defaultValue="lemon">
        <Combobox.Input label="Fruit" />
        <Combobox.Trigger />
        <Combobox.Content>
          <Combobox.List />
        </Combobox.Content>
      </Combobox>
    </div>
  ),
};

/** Individual options can be disabled. They can be highlighted but cannot be selected. */
export const DisabledOptions: Story = {
  render: () => (
    <div style={stackStyle}>
      <Combobox items={fruitOptionsWithDisabled}>
        <Combobox.Input label="Fruit" placeholder="Search fruit" />
        <Combobox.Content>
          <Combobox.List />
        </Combobox.Content>
      </Combobox>
    </div>
  ),
};

/** Options grouped under labeled headings. Filtering keeps the groups intact. */
export const Grouped: Story = {
  render: () => (
    <div style={stackStyle}>
      <Combobox items={groupedOptions}>
        <Combobox.Input label="Technology" placeholder="Search technologies" />
        <Combobox.Content>
          <Combobox.List />
          <Combobox.Empty>No technology found.</Combobox.Empty>
        </Combobox.Content>
      </Combobox>
    </div>
  ),
};

/** A custom option renderer that adds a secondary line to each item. */
export const CustomContent: Story = {
  render: () => {
    const people: readonly ComboboxOption[] = [
      { value: 'ada', label: 'Ada Lovelace' },
      { value: 'grace', label: 'Grace Hopper' },
      { value: 'linus', label: 'Linus Torvalds' },
    ];

    return (
      <div style={stackStyle}>
        <Combobox items={people}>
          <Combobox.Input label="Maintainer" placeholder="Search people" />
          <Combobox.Content>
            <Combobox.List>
              {(option) => (
                <Combobox.Item value={option.value}>
                  <span>
                    <strong>{option.label}</strong>
                    <br />
                    <small>Role: {option.value}</small>
                  </span>
                </Combobox.Item>
              )}
            </Combobox.List>
            <Combobox.Empty>No people found.</Combobox.Empty>
          </Combobox.Content>
        </Combobox>
      </div>
    );
  },
};

/** The empty state appears when no option matches the query. */
export const EmptyResults: Story = {
  render: () => (
    <div style={stackStyle}>
      <Combobox items={fruitOptions}>
        <Combobox.Input label="Fruit" placeholder="Try typing “zzz”" />
        <Combobox.Content>
          <Combobox.List />
          <Combobox.Empty>No fruit matches your search.</Combobox.Empty>
        </Combobox.Content>
      </Combobox>
    </div>
  ),
};

/** A long list scrolls inside the popup while the popup height stays bounded. */
export const LongList: Story = {
  render: () => (
    <div style={stackStyle}>
      <Combobox items={longOptions}>
        <Combobox.Input label="Option" placeholder="Search 200 options" />
        <Combobox.Content>
          <Combobox.List />
          <Combobox.Empty>No option found.</Combobox.Empty>
        </Combobox.Content>
      </Combobox>
    </div>
  ),
};

/** Controlled value and open state managed by the consumer. */
export const Controlled: Story = {
  render: () => <ControlledCombobox />,
};

/** A required combobox submitted inside a native form. */
export const RequiredForm: Story = {
  render: () => <RequiredFormCombobox />,
};

/** A narrow container. The popup matches the input width and flips when there is no space. */
export const NarrowContainerAndPlacement: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', justifyItems: 'start' }}>
      <div style={narrowStyle}>
        <Combobox items={fruitOptions}>
          <Combobox.Input label="Fruit" placeholder="Search" />
          <Combobox.Content>
            <Combobox.List />
            <Combobox.Empty>No fruit found.</Combobox.Empty>
          </Combobox.Content>
        </Combobox>
      </div>
      <div style={{ ...narrowStyle, marginTop: 'auto' }}>
        <Combobox items={fruitOptions}>
          <Combobox.Input label="Opens upward" placeholder="Search" />
          <Combobox.Content side="top" align="end">
            <Combobox.List />
          </Combobox.Content>
        </Combobox>
      </div>
    </div>
  ),
};

/** Several comboboxes in a realistic form with groups and a submit action. */
export const RealisticForm: Story = {
  render: () => <RealisticFormExample />,
};
