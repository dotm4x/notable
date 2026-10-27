import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentProps } from 'react';
import './field.css';

type TBaseFieldProps<TPart extends keyof typeof BaseField> = Omit<
  ComponentProps<(typeof BaseField)[TPart]>,
  'className'
> & {
  className?: string;
};

export type TFieldRootProps = TBaseFieldProps<'Root'>;
export type TFieldLabelProps = TBaseFieldProps<'Label'>;
export type TFieldBoxProps = ComponentProps<'span'>;
export type TFieldControlProps = TBaseFieldProps<'Control'>;
export type TFieldDescriptionProps = TBaseFieldProps<'Description'>;
export type TFieldErrorProps = TBaseFieldProps<'Error'>;

/**
 * Root component that groups a label, a control, a description, and an error
 * message. Connects them through Base UI so the control is labelled and
 * described automatically.
 */
function FieldRoot({ className, ...props }: TFieldRootProps) {
  return (
    <BaseField.Root
      {...props}
      className={joinClassNames('notable-field', className)}
    />
  );
}

/** Visible label for the field's control. */
function FieldLabel({ className, ...props }: TFieldLabelProps) {
  return (
    <BaseField.Label
      {...props}
      className={joinClassNames('notable-field__label', className)}
    />
  );
}

/** The form control the field labels and validates. */
function FieldControl({ className, ...props }: TFieldControlProps) {
  return (
    <BaseField.Control
      {...props}
      className={joinClassNames('notable-field__control', className)}
    />
  );
}

/** Helper text associated with the field's control. */
function FieldDescription({ className, ...props }: TFieldDescriptionProps) {
  return (
    <BaseField.Description
      {...props}
      className={joinClassNames('notable-field__description', className)}
    />
  );
}

/**
 * Error message associated with the field's control. Shows according to the
 * control's validity unless `match` is set.
 */
function FieldError({ className, ...props }: TFieldErrorProps) {
  return (
    <BaseField.Error
      {...props}
      className={joinClassNames('notable-field__error', className)}
    />
  );
}

/** Bordered container for a control and its icons. Gives controls the Notable field appearance. */
function FieldBox({ className, ...props }: TFieldBoxProps) {
  return (
    <span
      {...props}
      className={joinClassNames('notable-field__box', className)}
    />
  );
}

function joinClassNames(...classNames: (string | undefined)[]) {
  return classNames.filter(Boolean).join(' ');
}

/**
 * Field layout for a control with its label, description, and error message.
 * Built on Base UI Field; use `Field.Control` for the control or pass any
 * Base UI or Notable input to it with `render`.
 */
export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Box: FieldBox,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
};
