import { forwardRef } from 'react';
import { ControlGroupOrientationContext } from '../context.js';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import type { ControlGroupProps } from '../types.js';

export const ControlGroupRoot = forwardRef<HTMLDivElement, ControlGroupProps>(
  function ControlGroupRoot(
    { orientation = 'horizontal', className, ...props },
    ref,
  ) {
    return (
      <ControlGroupOrientationContext.Provider value={orientation}>
        <div
          {...props}
          ref={ref}
          role="group"
          data-orientation={orientation}
          className={joinClassNames('one-control-group', className)}
        />
      </ControlGroupOrientationContext.Provider>
    );
  },
);
