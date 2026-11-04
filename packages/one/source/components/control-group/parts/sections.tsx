import { cloneElement } from 'react';
import { Separator } from '../../separator/separator.js';
import { useControlGroupOrientation } from '../context.js';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import type {
  ControlGroupSeparatorProps,
  ControlGroupTextProps,
} from '../types.js';

export function ControlGroupSeparator({
  className,
  orientation,
  ...props
}: ControlGroupSeparatorProps) {
  const groupOrientation = useControlGroupOrientation();
  const resolvedOrientation =
    orientation ??
    (groupOrientation === 'vertical' ? 'horizontal' : 'vertical');

  return (
    <Separator
      {...props}
      orientation={resolvedOrientation}
      className={className}
    />
  );
}

export function ControlGroupText({
  children,
  className,
  render,
  ...props
}: ControlGroupTextProps) {
  const classes = joinClassNames('one-control-group__text', className);

  if (render) {
    return cloneElement(render, {
      ...props,
      className: joinClassNames(render.props.className, classes),
      children,
    });
  }

  return (
    <span {...props} className={classes}>
      {children}
    </span>
  );
}
