import { forwardRef } from 'react';
import { Icon, type TIconNode } from '../primitives/icon.js';

export interface ICreateIconOptions {
  name: string;
  iconNode: TIconNode;
}

export function createIcon({ name, iconNode }: ICreateIconOptions) {
  const Component = forwardRef<SVGSVGElement, Record<string, unknown>>(
    ({ ...props }, ref) => <Icon ref={ref} iconNode={iconNode} {...props} />,
  );
  Component.displayName = name;
  return Component;
}
