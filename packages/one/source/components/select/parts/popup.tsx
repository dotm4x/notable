import { Select as BaseSelect } from '@base-ui/react/select';
import { forwardRef } from 'react';
import { AnimatedHighlight } from '../../../internal/primitives/animated-highlight/animated-highlight.js';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import { focusLastEnabledOptionOnEnd } from '../helpers/keyboard.js';
import type { SelectContentProps, SelectListProps } from '../types.js';

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  function SelectContent(
    {
      side = 'bottom',
      align = 'start',
      sideOffset = 4,
      alignOffset,
      className,
      children,
      onKeyDownCapture,
      ...props
    },
    ref,
  ) {
    return (
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          alignItemWithTrigger={false}
          className="one-select__positioner"
        >
          <BaseSelect.Popup
            ref={ref}
            className={joinClassNames(
              'one-select__popup one-floating-surface',
              className,
            )}
            onKeyDownCapture={(event) => {
              focusLastEnabledOptionOnEnd(event);
              onKeyDownCapture?.(event);
            }}
            {...props}
          >
            <AnimatedHighlight />
            {children}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    );
  },
);

export const SelectList = forwardRef<HTMLDivElement, SelectListProps>(
  function SelectList({ className, ...props }, ref) {
    return (
      <BaseSelect.List
        ref={ref}
        className={joinClassNames('one-select__list', className)}
        {...props}
      />
    );
  },
);
