import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { type ComponentProps, forwardRef } from 'react';
import './fieldset.css';

export type TFieldsetRootProps = Omit<
  ComponentProps<'fieldset'>,
  'className'
> & {
  className?: string;
};

export type TFieldsetLegendProps = ComponentProps<'legend'>;

/**
 * Groups related controls under a shared name. Renders a native `fieldset`
 * so assistive technologies announce the group, and disables its contents
 * when `disabled` is set.
 */
const FieldsetRoot = forwardRef<HTMLFieldSetElement, TFieldsetRootProps>(
  function FieldsetRoot({ className, ...props }, ref) {
    return (
      <BaseFieldset.Root
        {...props}
        ref={ref}
        className={joinClassNames('notable-fieldset', className)}
      />
    );
  },
);

/**
 * Accessible name for the enclosing fieldset. Uses a native `legend` so the
 * group is named without extra ARIA wiring.
 */
const FieldsetLegend = forwardRef<HTMLLegendElement, TFieldsetLegendProps>(
  function FieldsetLegend({ className, ...props }, ref) {
    return (
      <legend
        {...props}
        ref={ref}
        className={joinClassNames('notable-fieldset__legend', className)}
      />
    );
  },
);

export const Fieldset = Object.assign(FieldsetRoot, {
  Root: FieldsetRoot,
  Legend: FieldsetLegend,
});

function joinClassNames(...classNames: (string | undefined)[]) {
  return classNames.filter(Boolean).join(' ');
}
