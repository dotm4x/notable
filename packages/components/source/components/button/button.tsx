import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import {
  Children,
  isValidElement,
  type ReactNode,
  type ElementType,
  type MouseEvent,
  type ReactElement,
} from 'react';
import { SPRING_INTERACTIVE } from '../../styles/motion.js';
import './button.css';

/** Visual appearance of the button. */
export type ButtonVariant =
  'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

/** Available button sizes, including icon-only sizes. */
export type ButtonSize =
  'small' | 'medium' | 'large' | 'icon' | 'icon-small' | 'icon-large';

/** Props for {@link Button}, including Motion props. */
export type ButtonProps = Omit<
  HTMLMotionProps<'button'>,
  'disabled' | 'children'
> & {
  /** Button content. Icon-only buttons need an accessible name. */
  children?: ReactNode;
  /** Visual appearance. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** Button size. Defaults to `medium`. */
  size?: ButtonSize;
  /** Disables the button and its interaction animations. Defaults to `false`. */
  disabled?: boolean;
  /** When true, renders the child element with button styles and interactions instead of a button element. */
  asChild?: boolean;
  [key: string]: unknown;
};

const customMotionCache = new Map<
  ElementType,
  ReturnType<typeof motion.create>
>();

function getMotionComponent(type: ElementType): ElementType {
  if (typeof type === 'string') {
    if (type in motion) {
      return (motion as unknown as Record<string, ElementType>)[type];
    }
  }
  let comp = customMotionCache.get(type);
  if (!comp) {
    comp = motion.create(type as Parameters<typeof motion.create>[0]);
    customMotionCache.set(type, comp);
  }
  return comp;
}

/**
 * Renders a native button with optional hover and press animations. Respects
 * reduced-motion preferences and defaults `type` to `button`.
 */
export function Button({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  asChild = false,
  className,
  children,
  whileHover,
  whileTap,
  transition,
  type = 'button',
  ...props
}: ButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const isMotionDisabled = disabled || shouldReduceMotion;

  const classes = [
    'notable-button',
    `notable-button--${variant}`,
    `notable-button--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (asChild && isValidElement(children)) {
    const child = Children.only(children) as ReactElement<
      Record<string, unknown>
    >;
    const MotionComponent = getMotionComponent(child.type as ElementType);
    const childProps = child.props;

    const mergedClassName = [
      classes,
      childProps.className as string | undefined,
    ]
      .filter(Boolean)
      .join(' ');

    const handleChildClick = childProps.onClick as
      ((event: MouseEvent) => void) | undefined;
    const handlePropsClick = (
      props as { onClick?: (event: MouseEvent) => void }
    ).onClick;

    const motionAndHtmlProps = { ...props };
    delete motionAndHtmlProps.variant;
    delete motionAndHtmlProps.size;
    delete motionAndHtmlProps.asChild;
    delete motionAndHtmlProps.disabled;
    delete motionAndHtmlProps.type;
    delete motionAndHtmlProps.children;
    delete motionAndHtmlProps.className;

    const Component = MotionComponent;

    return (
      <Component
        {...motionAndHtmlProps}
        {...childProps}
        aria-disabled={
          disabled ? true : (childProps['aria-disabled'] as boolean | undefined)
        }
        className={mergedClassName}
        whileHover={
          isMotionDisabled ? undefined : (whileHover ?? { scale: 1.03 })
        }
        whileTap={isMotionDisabled ? undefined : (whileTap ?? { scale: 0.97 })}
        transition={transition ?? SPRING_INTERACTIVE}
        onClick={(event: MouseEvent) => {
          handleChildClick?.(event);
          handlePropsClick?.(event);
        }}
      >
        <span className="notable-button__content">
          {childProps.children as ReactNode}
        </span>
      </Component>
    );
  }

  return (
    <motion.button
      {...props}
      type={type}
      disabled={disabled}
      className={classes}
      whileHover={
        isMotionDisabled ? undefined : (whileHover ?? { scale: 1.03 })
      }
      whileTap={isMotionDisabled ? undefined : (whileTap ?? { scale: 0.97 })}
      transition={transition ?? SPRING_INTERACTIVE}
    >
      <span className="notable-button__content">{children}</span>
    </motion.button>
  );
}
