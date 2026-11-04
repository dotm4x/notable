import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { forwardRef } from 'react';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import type {
  CommandEmptyProps,
  CommandGroupLabelProps,
  CommandGroupProps,
  CommandSeparatorProps,
} from '../types.js';

export const CommandEmpty = forwardRef<HTMLDivElement, CommandEmptyProps>(
  function CommandEmpty(
    { className, children = 'No results found', ...props },
    ref,
  ) {
    return (
      <BaseAutocomplete.Empty
        ref={ref}
        className={joinClassNames('one-command__empty', className)}
        {...props}
      >
        {children}
      </BaseAutocomplete.Empty>
    );
  },
);

export const CommandGroupPart = forwardRef<HTMLDivElement, CommandGroupProps>(
  function CommandGroupPart({ className, ...props }, ref) {
    return (
      <BaseAutocomplete.Group
        ref={ref}
        className={joinClassNames('one-command__group', className)}
        {...props}
      />
    );
  },
);

export const CommandGroupLabel = forwardRef<
  HTMLDivElement,
  CommandGroupLabelProps
>(function CommandGroupLabel({ className, ...props }, ref) {
  return (
    <BaseAutocomplete.GroupLabel
      ref={ref}
      className={joinClassNames('one-command__group-label', className)}
      {...props}
    />
  );
});

export const CommandSeparator = forwardRef<
  HTMLDivElement,
  CommandSeparatorProps
>(function CommandSeparator({ className, ...props }, ref) {
  return (
    <BaseAutocomplete.Separator
      ref={ref}
      className={joinClassNames('one-command__separator', className)}
      {...props}
    />
  );
});
