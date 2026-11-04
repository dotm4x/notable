import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { Button } from '../../button/button.js';
import { useDrawerContext } from '../context.js';
import { withConsumerClick } from '../../../internal/helpers/with-consumer-click.js';
import type {
  DrawerCloseProps,
  DrawerDescriptionProps,
  DrawerFooterProps,
  DrawerHeaderProps,
  DrawerTitleProps,
} from '../types.js';

export function DrawerHeader({ className, ...props }: DrawerHeaderProps) {
  return (
    <div
      {...props}
      className={['one-drawer__header', className].filter(Boolean).join(' ')}
    />
  );
}

export function DrawerTitle({ className, ...props }: DrawerTitleProps) {
  useDrawerContext('Drawer.Title');

  return (
    <BaseDrawer.Title
      {...props}
      className={['one-drawer__title', className].filter(Boolean).join(' ')}
    />
  );
}

export function DrawerDescription({
  className,
  ...props
}: DrawerDescriptionProps) {
  useDrawerContext('Drawer.Description');

  return (
    <BaseDrawer.Description
      {...props}
      className={['one-drawer__description', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

export function DrawerFooter({ className, ...props }: DrawerFooterProps) {
  return (
    <div
      {...props}
      className={['one-drawer__footer', className].filter(Boolean).join(' ')}
    />
  );
}

export function DrawerClose({ onClick, ...props }: DrawerCloseProps) {
  useDrawerContext('Drawer.Close');

  return (
    <BaseDrawer.Close
      render={
        <Button
          variant="outline"
          {...props}
          type="button"
          onClick={withConsumerClick(onClick)}
        />
      }
    />
  );
}
