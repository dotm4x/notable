import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from '../button/button.js';
import { DropdownMenu } from '../dropdown-menu/dropdown-menu.js';
import { Input } from '../input/input.js';
import { Popover } from '../popover/popover.js';
import { Select } from '../select/select.js';
import { ControlGroup } from './control-group.js';

afterEach(() => {
  cleanup();
});

describe('ControlGroup', () => {
  it('renders an accessible horizontal group by default', () => {
    render(
      <ControlGroup aria-label="Text formatting" data-testid="group">
        <Button>Bold</Button>
      </ControlGroup>,
    );

    const group = screen.getByRole('group', { name: 'Text formatting' });

    expect(group).toHaveAttribute('data-orientation', 'horizontal');
    expect(group).toHaveAttribute('data-testid', 'group');
    expect(group).toHaveClass('one-control-group');
  });

  it('supports vertical orientation and nested groups', () => {
    render(
      <ControlGroup orientation="vertical" aria-label="Editor actions">
        <Button>Undo</Button>
        <ControlGroup aria-label="Text formatting">
          <Button>Bold</Button>
          <Button>Italic</Button>
        </ControlGroup>
      </ControlGroup>,
    );

    expect(
      screen.getByRole('group', { name: 'Editor actions' }),
    ).toHaveAttribute('data-orientation', 'vertical');
    expect(
      screen.getByRole('group', { name: 'Text formatting' }),
    ).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('orients its separator across the group axis by default', () => {
    const { rerender } = render(
      <ControlGroup aria-label="Split action">
        <Button>Save</Button>
        <ControlGroup.Separator />
        <Button>More</Button>
      </ControlGroup>,
    );

    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );

    rerender(
      <ControlGroup orientation="vertical" aria-label="Split action">
        <Button>Save</Button>
        <ControlGroup.Separator />
        <Button>More</Button>
      </ControlGroup>,
    );

    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'horizontal',
    );
  });

  it('allows an explicit separator orientation', () => {
    render(
      <ControlGroup aria-label="Split action">
        <Button>Save</Button>
        <ControlGroup.Separator orientation="horizontal" />
      </ControlGroup>,
    );

    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'horizontal',
    );
  });

  it('renders styled text and supports a custom render element', () => {
    render(
      <ControlGroup aria-label="Search">
        <ControlGroup.Text
          render={<label htmlFor="query" data-testid="group-label" />}
        >
          Query
        </ControlGroup.Text>
        <Input id="query" aria-label="Search query" />
      </ControlGroup>,
    );

    const label = screen.getByTestId('group-label');
    expect(label).toHaveTextContent('Query');
    expect(label).toHaveClass('one-control-group__text');
    expect(label.tagName).toBe('LABEL');
    expect(screen.getByLabelText('Query')).toHaveAttribute('id', 'query');
  });

  it('preserves button click and disabled behavior', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <ControlGroup aria-label="Actions">
        <Button onClick={onClick}>Save</Button>
        <Button disabled onClick={onClick}>
          Unavailable
        </Button>
      </ControlGroup>,
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));
    await user.click(screen.getByRole('button', { name: 'Unavailable' }));

    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
  });

  it('composes with Input without changing its accessible behavior', async () => {
    const user = userEvent.setup();

    render(
      <ControlGroup aria-label="Search controls">
        <Input aria-label="Search query" placeholder="Search" />
        <Button>Submit</Button>
      </ControlGroup>,
    );

    const input = screen.getByRole('textbox', { name: 'Search query' });
    await user.type(input, 'one');

    expect(input).toHaveValue('one');
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('composes with Select and preserves its popup behavior', async () => {
    const user = userEvent.setup();

    render(
      <ControlGroup aria-label="Filters">
        <Select.Root>
          <Select.Trigger aria-label="Fruit">
            <Select.Value placeholder="Pick a fruit" />
          </Select.Trigger>
          <Select.Content>
            <Select.List>
              <Select.Item value="apple">Apple</Select.Item>
            </Select.List>
          </Select.Content>
        </Select.Root>
      </ControlGroup>,
    );

    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));

    expect(await screen.findByRole('listbox')).toBeInTheDocument();
  });

  it('composes with DropdownMenu and preserves its trigger behavior', async () => {
    const user = userEvent.setup();

    render(
      <ControlGroup aria-label="Document actions">
        <Button>Save</Button>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>More actions</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Rename</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </ControlGroup>,
    );

    await user.click(screen.getByRole('button', { name: 'More actions' }));

    expect(
      await screen.findByRole('menuitem', { name: 'Rename' }),
    ).toBeVisible();
  });

  it('composes with Popover and preserves its trigger behavior', async () => {
    const user = userEvent.setup();

    render(
      <ControlGroup aria-label="Display actions">
        <Button>Save</Button>
        <Popover>
          <Popover.Trigger>
            <Button>Display options</Button>
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Title>Display options</Popover.Title>
          </Popover.Content>
        </Popover>
      </ControlGroup>,
    );

    await user.click(screen.getByRole('button', { name: 'Display options' }));

    expect(
      await screen.findByRole('dialog', { name: 'Display options' }),
    ).toBeInTheDocument();
  });
});
