import {
  FieldBox,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldRoot,
} from './parts/sections.js';
import './field.css';

export type {
  TFieldBoxProps,
  TFieldControlProps,
  TFieldDescriptionProps,
  TFieldErrorProps,
  TFieldLabelProps,
  TFieldRootProps,
} from './types.js';

/**
 * Field layout for a control with its label, description, and error message.
 * Built on Base UI Field; use `Field.Control` for the control or pass any
 * Base UI or One input to it with `render`.
 */
export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Box: FieldBox,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
};
