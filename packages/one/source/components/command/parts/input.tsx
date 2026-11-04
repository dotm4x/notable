import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { forwardRef } from 'react';
import { Search } from '../../../icons';
import { Input } from '../../input/input.js';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import type { CommandInputProps } from '../types.js';

export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(
  function CommandInput({ className, ...props }, ref) {
    return (
      <div className={joinClassNames('one-command__input', className)}>
        <BaseAutocomplete.Input
          ref={ref}
          aria-label="Search commands"
          placeholder="Search commands"
          render={
            <Input leadingIcon={<Search size={16} aria-hidden="true" />} />
          }
          {...props}
        />
      </div>
    );
  },
);
