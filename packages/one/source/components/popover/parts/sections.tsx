import { Popover as BasePopover } from '@base-ui/react/popover';
import type {
  PopoverDescriptionProps,
  PopoverHeaderProps,
  PopoverTitleProps,
} from '../types.js';

export function PopoverHeader({ className, ...props }: PopoverHeaderProps) {
  return (
    <div
      {...props}
      className={['one-popover__header', className].filter(Boolean).join(' ')}
    />
  );
}

export function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return (
    <BasePopover.Title
      {...props}
      className={['one-popover__title', className].filter(Boolean).join(' ')}
    />
  );
}

export function PopoverDescription({
  className,
  ...props
}: PopoverDescriptionProps) {
  return (
    <BasePopover.Description
      {...props}
      className={['one-popover__description', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
