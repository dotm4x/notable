import type { BaseUIEvent } from '@base-ui/react/types';
import type { MouseEvent, MouseEventHandler } from 'react';

type TConsumerClickEvent = MouseEvent<HTMLElement> &
  Partial<Pick<BaseUIEvent<MouseEvent<HTMLElement>>, 'preventBaseUIHandler'>>;

/**
 * Wraps a consumer `onClick` so a call to `preventDefault` also skips Base UI's
 * own click handling, matching the native `<dialog>` behavior.
 */
export function withConsumerClick(
  onClick: MouseEventHandler<HTMLElement> | undefined,
): MouseEventHandler<HTMLElement> {
  return (event: TConsumerClickEvent) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      event.preventBaseUIHandler?.();
    }
  };
}
