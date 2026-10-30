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

export interface FieldsetComponent extends React.ForwardRefExoticComponent<
  TFieldsetRootProps & React.RefAttributes<HTMLFieldSetElement>
> {
  /** Root fieldset container grouping related controls. */
  Root: typeof FieldsetRoot;
  /** Accessible name/legend for the enclosing fieldset. */
  Legend: typeof FieldsetLegend;
}

export const Fieldset: FieldsetComponent = Object.assign(FieldsetRoot, {
  Root: FieldsetRoot,
  Legend: FieldsetLegend,
});

function joinClassNames(...classNames: (string | undefined)[]) {
  return classNames.filter(Boolean).join(' ');
}
