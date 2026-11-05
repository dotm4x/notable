import {
  forwardRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';
import { Icon, type TIconNode } from '../primitives/icon.js';

export interface ICreateIconOptions {
  name: string;
  iconNode: TIconNode;
}

/**
 * An icon component. `iconNode` exposes the source shapes so tools can render
 * previews or serialize standalone SVG without duplicating the icon data.
 */
export interface IIconComponent extends ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<SVGSVGElement>
> {
  iconNode: TIconNode;
}

/** Creates an icon component from a named icon node. */
export function createIcon({
  name,
  iconNode,
}: ICreateIconOptions): IIconComponent {
  const Component = Object.assign(
    forwardRef<SVGSVGElement, Record<string, unknown>>(({ ...props }, ref) => (
      <Icon ref={ref} iconNode={iconNode} {...props} />
    )),
    { iconNode },
  );
  Component.displayName = name;
  return Component;
}
