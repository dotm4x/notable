import { Field as BaseField } from '@base-ui/react/field';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import type {
  TFieldBoxProps,
  TFieldControlProps,
  TFieldDescriptionProps,
  TFieldErrorProps,
  TFieldLabelProps,
  TFieldRootProps,
} from '../types.js';

export function FieldRoot({ className, ...props }: TFieldRootProps) {
  return (
    <BaseField.Root
      {...props}
      className={joinClassNames('one-field', className)}
    />
  );
}

export function FieldLabel({ className, ...props }: TFieldLabelProps) {
  return (
    <BaseField.Label
      {...props}
      className={joinClassNames('one-field__label', className)}
    />
  );
}

export function FieldControl({ className, ...props }: TFieldControlProps) {
  return (
    <BaseField.Control
      {...props}
      className={joinClassNames('one-field__control', className)}
    />
  );
}

export function FieldDescription({
  className,
  ...props
}: TFieldDescriptionProps) {
  return (
    <BaseField.Description
      {...props}
      className={joinClassNames('one-field__description', className)}
    />
  );
}

export function FieldError({ className, ...props }: TFieldErrorProps) {
  return (
    <BaseField.Error
      {...props}
      className={joinClassNames('one-field__error', className)}
    />
  );
}

export function FieldBox({ className, ...props }: TFieldBoxProps) {
  return (
    <span {...props} className={joinClassNames('one-field__box', className)} />
  );
}
