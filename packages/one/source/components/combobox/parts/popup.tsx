import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { Fragment, forwardRef } from 'react';
import { AnimatedHighlight } from '../../../internal/primitives/animated-highlight/animated-highlight.js';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import { isOptionGroup } from '../helpers/items.js';
import type {
  ComboboxContentProps,
  ComboboxEmptyProps,
  ComboboxListProps,
  ComboboxOption,
  ComboboxOptionGroup,
} from '../types.js';
import { ComboboxItem } from './item.js';

export const ComboboxContent = forwardRef<HTMLDivElement, ComboboxContentProps>(
  function ComboboxContent(
    {
      side = 'bottom',
      align = 'start',
      sideOffset = 4,
      alignOffset,
      className,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <BaseCombobox.Portal>
        <BaseCombobox.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          className="one-combobox__positioner"
        >
          <BaseCombobox.Popup
            ref={ref}
            className={joinClassNames(
              'one-combobox__popup one-floating-surface',
              className,
            )}
            {...props}
          >
            <AnimatedHighlight />
            {children}
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    );
  },
);

export const ComboboxList = forwardRef<HTMLDivElement, ComboboxListProps>(
  function ComboboxList({ className, children, ...props }, ref) {
    const renderOption =
      children ??
      ((option: ComboboxOption) => (
        <ComboboxItem value={option.value} disabled={option.disabled}>
          {option.label}
        </ComboboxItem>
      ));

    return (
      <BaseCombobox.List
        ref={ref}
        className={joinClassNames('one-combobox__list', className)}
        {...props}
      >
        {(entry: ComboboxOption | ComboboxOptionGroup, index: number) =>
          isOptionGroup(entry) ? (
            <BaseCombobox.Group
              key={entry.label}
              items={entry.items}
              className="one-combobox__group"
            >
              <BaseCombobox.GroupLabel className="one-combobox__group-label">
                {entry.label}
              </BaseCombobox.GroupLabel>
              <BaseCombobox.Collection>
                {(option: ComboboxOption, optionIndex: number) => (
                  <Fragment key={option.value}>
                    {renderOption(option, optionIndex)}
                  </Fragment>
                )}
              </BaseCombobox.Collection>
            </BaseCombobox.Group>
          ) : (
            <Fragment key={entry.value}>{renderOption(entry, index)}</Fragment>
          )
        }
      </BaseCombobox.List>
    );
  },
);

export const ComboboxEmpty = forwardRef<HTMLDivElement, ComboboxEmptyProps>(
  function ComboboxEmpty({ className, ...props }, ref) {
    return (
      <BaseCombobox.Empty
        ref={ref}
        className={joinClassNames('one-combobox__empty', className)}
        {...props}
      />
    );
  },
);
