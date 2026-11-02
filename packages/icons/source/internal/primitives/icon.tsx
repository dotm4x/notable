import {
  forwardRef,
  createElement,
  type ComponentPropsWithoutRef,
} from 'react';

export type TIconNode = Array<[string, Record<string, string | number>]>;

export interface IIconProps extends ComponentPropsWithoutRef<'svg'> {
  iconNode?: TIconNode;
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
}

const Icon = forwardRef<SVGSVGElement, IIconProps>(
  (
    {
      iconNode = [],
      size = 24,
      color = 'currentColor',
      strokeWidth = 2,
      absoluteStrokeWidth = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const width = size;
    const height = size;
    const sw = absoluteStrokeWidth
      ? (Number(strokeWidth) * 24) / Number(size)
      : strokeWidth;

    return createElement(
      'svg',
      {
        ref,
        xmlns: 'http://www.w3.org/2000/svg',
        width,
        height,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: color,
        strokeWidth: sw,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        className,
        ...rest,
      },
      [
        ...iconNode.map(([tag, attrs]) => createElement(tag, attrs)),
        ...(Array.isArray(children) ? children : children ? [children] : []),
      ],
    );
  },
);

Icon.displayName = 'Icon';

export { Icon };
export default Icon;
