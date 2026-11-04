import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentProps } from 'react';

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
