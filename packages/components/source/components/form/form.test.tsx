import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type FormEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../button/button.js';
import { CheckboxGroup } from '../checkbox/checkbox-group.js';
import { Field } from '../field/field.js';
import { Input } from '../input/input.js';
import { RadioGroup, RadioGroupItem } from '../radio-group/radio-group.js';
import { Form } from './form.js';

describe('Form', () => {
  it('renders a native form element with the Notable class name', () => {
    const { container } = render(
      <Form className="signup">
        <Input label="Email" />
      </Form>,
    );

    const form = container.querySelector('form');
    expect(form).toHaveClass('notable-form', 'signup');
  });

  it('passes native form attributes through', () => {
    const { container } = render(
      <Form
        id="signup"
        name="signup"
        method="post"
        action="/subscribe"
        autoComplete="off"
        noValidate
        aria-label="Sign up"
        data-testid="form"
      />,
    );

    const form = container.querySelector('form');
    expect(form).toHaveAttribute('id', 'signup');
    expect(form).toHaveAttribute('name', 'signup');
    expect(form).toHaveAttribute('method', 'post');
    expect(form).toHaveAttribute('action', '/subscribe');
    expect(form).toHaveAttribute('autocomplete', 'off');
    expect(form).toHaveAttribute('novalidate');
    expect(form).toHaveAttribute('aria-label', 'Sign up');
    expect(form).toHaveAttribute('data-testid', 'form');
  });

  it('forwards the ref to the form element', () => {
    const ref = createRef<HTMLFormElement>();
    render(<Form ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLFormElement);
  });

  it('calls onSubmit when a submit button is pressed', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });
    render(
      <Form onSubmit={onSubmit}>
        <Input label="Email" />
        <Button type="submit">Subscribe</Button>
      </Form>,
    );

    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when Enter is pressed in a text input', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });
    render(
      <Form onSubmit={onSubmit}>
        <Input label="Search" />
      </Form>,
    );

    await user.type(screen.getByLabelText('Search'), '{Enter}');

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('does not prevent the default submission', () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <Form onSubmit={onSubmit}>
        <Button type="submit">Send</Button>
      </Form>,
    );

    const notCanceled = fireEvent.submit(container.querySelector('form')!);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(notCanceled).toBe(true);
  });

  it('blocks submission when a native required field is empty', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <Form onSubmit={onSubmit}>
        <Input label="Email" type="email" required />
        <Button type="submit">Subscribe</Button>
      </Form>,
    );

    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Email')).toBeInvalid();
  });

  it('submits native FormData from composed controls', async () => {
    const user = userEvent.setup();
    const submitted: FormData[] = [];
    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      submitted.push(new FormData(event.currentTarget));
    });
    render(
      <Form onSubmit={onSubmit}>
        <Field.Root name="name">
          <Field.Label>Name</Field.Label>
          <Field.Box>
            <Field.Control defaultValue="Ana" />
          </Field.Box>
        </Field.Root>
        <CheckboxGroup label="Topics" defaultValue={['news']}>
          <CheckboxGroup.Item name="topics" value="news" label="News" />
          <CheckboxGroup.Item name="topics" value="tips" label="Tips" />
        </CheckboxGroup>
        <RadioGroup label="Frequency" name="frequency" defaultValue="daily">
          <RadioGroupItem value="daily" label="Daily" />
          <RadioGroupItem value="weekly" label="Weekly" />
        </RadioGroup>
        <Button type="submit">Save</Button>
      </Form>,
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));

    const formData = submitted[0];
    expect(formData.get('name')).toBe('Ana');
    expect(formData.getAll('topics')).toEqual(['news']);
    expect(formData.get('frequency')).toBe('daily');
  });

  it('resets controls when a reset button is pressed', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(
      <Form onReset={onReset}>
        <Input label="Email" defaultValue="ana@example.com" />
        <Button type="reset">Clear</Button>
      </Form>,
    );

    const input = screen.getByLabelText('Email');
    await user.clear(input);
    await user.type(input, 'other@example.com');
    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('ana@example.com');
  });

  it('keeps Field labels and descriptions associated with controls', () => {
    render(
      <Form>
        <Input
          label="Email"
          description="We never share it."
          error="Enter a valid email."
        />
      </Form>,
    );

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAccessibleDescription(
      'We never share it. Enter a valid email.',
    );
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
