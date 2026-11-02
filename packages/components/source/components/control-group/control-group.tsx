import {
  cloneElement,
  createContext,
  forwardRef,
  useContext,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
} from 'react';
import {
  Separator,
  type SeparatorOrientation,
  type SeparatorProps,
} from '../separator/separator.js';
import './control-group.css';

/** Layout direction of the group. */
export type ControlGroupOrientation = 'horizontal' | 'vertical';

/** Props for the ControlGroup root. */
export type ControlGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'role'> & {
  /** Layout direction. Defaults to `horizontal`. */
  orientation?: ControlGroupOrientation;
};

/** Props for the ControlGroup separator. */
export type ControlGroupSeparatorProps = Omit<SeparatorProps, 'orientation'> & {
  /** Line direction. Defaults to the axis perpendicular to the group. */
  orientation?: SeparatorOrientation;
};

/** Props for the ControlGroup text part. */
export type ControlGroupTextProps = HTMLAttributes<HTMLSpanElement> & {
  /** Element to render instead of the default `span`. */
  render?: ReactElement<{
    className?: string;
    children?: ReactNode;
  }>;
};

const ControlGroupOrientationContext =
  createContext<ControlGroupOrientation | null>(null);

function joinClassNames(...classNames: (string | undefined)[]): string {
  return classNames.filter(Boolean).join(' ');
}

const ControlGroupRoot = forwardRef<HTMLDivElement, ControlGroupProps>(
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

function ControlGroupSeparator({
  className,
  orientation,
  ...props
}: ControlGroupSeparatorProps) {
  const groupOrientation = useContext(ControlGroupOrientationContext);
  const resolvedOrientation =
    orientation ??
    (groupOrientation === 'vertical' ? 'horizontal' : 'vertical');

  return (
    <Separator
      {...props}
      orientation={resolvedOrientation}
      className={joinClassNames('one-control-group__separator', className)}
    />
  );
}

function ControlGroupText({
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

export interface ControlGroupComponent extends ForwardRefExoticComponent<
  ControlGroupProps & RefAttributes<HTMLDivElement>
> {
  /** Renders a divider between grouped controls. */
  Separator: typeof ControlGroupSeparator;
  /** Renders supporting text as part of the group. */
  Text: typeof ControlGroupText;
}

/** Compound group for visually and semantically related actions and controls. */
export const ControlGroup: ControlGroupComponent = Object.assign(
  ControlGroupRoot,
  {
    Separator: ControlGroupSeparator,
    Text: ControlGroupText,
  },
);
