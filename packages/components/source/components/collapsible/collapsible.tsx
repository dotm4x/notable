import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import './collapsible.css';

/** Props for {@link Collapsible}, in addition to native `div` attributes. */
export type CollapsibleProps = HTMLAttributes<HTMLDivElement> & {
  /** Trigger and content of the collapsible. */
  children?: ReactNode;
  /** Expanded state for controlled use. Omit it to let the component manage its own state. */
  open?: boolean;
  /** Expanded state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the new expanded state whenever the trigger opens or closes the content. */
  onOpenChange?: (open: boolean) => void;
  /** Prevents the trigger from opening or closing the content. Defaults to `false`. */
  disabled?: boolean;
};

/** Props for {@link CollapsibleTrigger}, in addition to native `button` attributes. */
export type CollapsibleTriggerProps = ComponentPropsWithoutRef<'button'>;

/** Props for {@link CollapsibleContent}, in addition to native `div` attributes. */
export type CollapsibleContentProps = HTMLAttributes<HTMLDivElement>;

const CollapsibleRoot = forwardRef<HTMLDivElement, CollapsibleProps>(
  function CollapsibleRoot(
    { className, open, defaultOpen, onOpenChange, disabled = false, ...props },
    ref,
  ) {
    const classes = ['notable-collapsible', className]
      .filter(Boolean)
      .join(' ');

    return (
      <BaseCollapsible.Root
        {...props}
        ref={ref}
        className={classes}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
        disabled={disabled}
      />
    );
  },
);

const CollapsibleTrigger = forwardRef<
  HTMLButtonElement,
  CollapsibleTriggerProps
>(function CollapsibleTrigger({ className, type = 'button', ...props }, ref) {
  const classes = ['notable-collapsible__trigger', className]
    .filter(Boolean)
    .join(' ');

  return (
    <BaseCollapsible.Trigger
      {...props}
      ref={ref}
      type={type}
      className={classes}
    />
  );
});

const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
  function CollapsibleContent({ className, children, ...props }, ref) {
    const classes = ['notable-collapsible__content-inner', className]
      .filter(Boolean)
      .join(' ');

    return (
      <BaseCollapsible.Panel
        className="notable-collapsible__content"
        keepMounted
      >
        <div {...props} ref={ref} className={classes}>
          {children}
        </div>
      </BaseCollapsible.Panel>
    );
  },
);

export interface CollapsibleComponent extends React.ForwardRefExoticComponent<
  CollapsibleProps & React.RefAttributes<HTMLDivElement>
> {
  Root: typeof CollapsibleRoot;
  /** Button that toggles the content of its collapsible section. */
  Trigger: typeof CollapsibleTrigger;
  /** Region revealed by the collapsible trigger. */
  Content: typeof CollapsibleContent;
}

/** Shows and hides a section of content. Compound: `Collapsible.Trigger` toggles `Collapsible.Content`. */
export const Collapsible: CollapsibleComponent = Object.assign(
  CollapsibleRoot,
  {
    Root: CollapsibleRoot,
    Trigger: CollapsibleTrigger,
    Content: CollapsibleContent,
  },
);
