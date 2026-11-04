import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { forwardRef } from 'react';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import type { TFieldsetLegendProps, TFieldsetRootProps } from '../types.js';

export const FieldsetRoot = forwardRef<HTMLFieldSetElement, TFieldsetRootProps>(
  function FieldsetRoot({ className, ...props }, ref) {
    return (
      <BaseFieldset.Root
        {...props}
        ref={ref}
        className={joinClassNames('one-fieldset', className)}
      />
    );
  },
);

export const FieldsetLegend = forwardRef<
  HTMLLegendElement,
  TFieldsetLegendProps
>(function FieldsetLegend({ className, ...props }, ref) {
  return (
    <legend
      {...props}
      ref={ref}
      className={joinClassNames('one-fieldset__legend', className)}
    />
  );
});
