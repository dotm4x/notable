import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { Search } from 'lucide-react';
import {
  createContext,
  forwardRef,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { Dialog, type DialogSize } from '../dialog/dialog.js';
import { Input, type InputProps } from '../input/input.js';
import { Shortcut } from '../shortcut/shortcut.js';
import { AnimatedHighlight } from '../../internal/primitives/animated-highlight/animated-highlight.js';
import { AutoSize } from '../../internal/primitives/auto-size/auto-size.js';
import './command.css';

/** A runnable command. `value` identifies it; `label` is shown and matched against the query. */
export type CommandItem = {
  value: string;
  label: string;
  /** Secondary text shown below the label and matched against the query. */
  description?: string;
  /** Extra search terms that match the query without being displayed. */
  keywords?: readonly string[];
  /** Icon shown before the label. Decorative, so it is hidden from assistive technology. */
  icon?: ReactNode;
  /** Key labels shown after the item, for example `['⌘', 'S']`. */
  shortcut?: readonly string[];
  disabled?: boolean;
  /** Runs when the item is chosen. Chosen items close a `Command.Dialog` before this runs. */
  onSelect?: () => void | Promise<void>;
};

/** A labeled set of commands rendered under a group heading. */
export type CommandGroup = {
  label: string;
  items: readonly CommandItem[];
};

/** Decides whether an item matches the current query. Return `true` to show the item. */
export type CommandFilter = (item: CommandItem, query: string) => boolean;

/** Props for the inline `Command` root. `items` is either a flat list or a list of groups. */
export type CommandProps = {
  items: readonly CommandItem[] | readonly CommandGroup[];
  /** Replaces the default filter, which requires every whitespace-separated term to match. */
  filter?: CommandFilter;
  children?: ReactNode;
};

/** Props for `Command.Dialog`, a modal command palette. */
export type CommandDialogProps = CommandProps & {
  /** Controlled open state. Omit to let the palette manage its own state. */
  open?: boolean;
  /** Initial open state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the requested open state when the palette opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Keyboard shortcut that toggles the palette, such as `'Mod+K'`. `Mod` is Command on
   * macOS and Control elsewhere. Pass `null` to disable it. Defaults to `'Mod+K'`.
   */
  shortcut?: string | null;
  /** Accessible name of the palette. Defaults to `'Command palette'`. */
  label?: string;
  /** Width of the palette. Defaults to `medium`. */
  size?: DialogSize;
};

export type CommandInputProps = Omit<
  InputProps,
  | 'children'
  | 'label'
  | 'description'
  | 'error'
  | 'invalid'
  | 'leadingIcon'
  | 'trailingIcon'
  | 'trailingIconInteractive'
>;

/** Base UI props with `className` narrowed to a string, since Notable composes class names directly. */
type WithStringClassName<TProps extends { className?: unknown }> = Omit<
  TProps,
  'className'
> & { className?: string };

export type CommandListProps = Omit<
  WithStringClassName<ComponentPropsWithoutRef<typeof BaseAutocomplete.List>>,
  'children'
> & {
  /** Renders each item. Defaults to a `Command.Item` per command. */
  children?: (item: CommandItem, index: number) => ReactNode;
};

export type CommandItemProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'onClick'
> & {
  item: CommandItem;
};

export type CommandEmptyProps = ComponentPropsWithoutRef<'div'>;

export type CommandGroupProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseAutocomplete.Group>
>;

export type CommandGroupLabelProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseAutocomplete.GroupLabel>
>;

export type CommandSeparatorProps = WithStringClassName<
  ComponentPropsWithoutRef<typeof BaseAutocomplete.Separator>
>;

type CommandContextValue = {
  selectItem: (item: CommandItem) => void;
};

const CommandContext = createContext<CommandContextValue | null>(null);

function useCommandContext(componentName: string): CommandContextValue {
  const context = useContext(CommandContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Command.`);
  }

  return context;
}

function isCommandGroup(
  entry: CommandItem | CommandGroup,
): entry is CommandGroup {
  return 'items' in entry;
}

function isGroupedCommandList(
  items: CommandProps['items'],
): items is readonly CommandGroup[] {
  return items.length > 0 && isCommandGroup(items[0]);
}

function joinClassNames(...classNames: (string | undefined)[]): string {
  return classNames.filter(Boolean).join(' ');
}

/**
 * Default filter. Every whitespace-separated term of the query must appear in the
 * label, description, or keywords, ignoring case.
 */
function matchesCommandQuery(item: CommandItem, query: string): boolean {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  if (terms.length === 0) {
    return true;
  }

  const searchableText = [
    item.label,
    item.description,
    ...(item.keywords ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return terms.every((term) => searchableText.includes(term));
}

function isApplePlatform(): boolean {
  return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
}

type ParsedShortcut = {
  key: string;
  mod: boolean;
  ctrl: boolean;
  meta: boolean;
  alt: boolean;
  shift: boolean;
};

function parseShortcut(shortcut: string): ParsedShortcut {
  const parts = shortcut.split('+').map((part) => part.trim().toLowerCase());
  const key = parts.pop() ?? '';

  return {
    key,
    mod: parts.includes('mod'),
    ctrl: parts.includes('ctrl'),
    meta: parts.includes('meta'),
    alt: parts.includes('alt'),
    shift: parts.includes('shift'),
  };
}

function matchesShortcut(event: KeyboardEvent, shortcut: string): boolean {
  const parsed = parseShortcut(shortcut);
  const isApple = isApplePlatform();
  const expectedCtrl = parsed.ctrl || (parsed.mod && !isApple);
  const expectedMeta = parsed.meta || (parsed.mod && isApple);

  return (
    event.key.toLowerCase() === parsed.key &&
    event.ctrlKey === expectedCtrl &&
    event.metaKey === expectedMeta &&
    event.altKey === parsed.alt &&
    event.shiftKey === parsed.shift
  );
}

type ShortcutRegistration = {
  shortcut: string;
};

/**
 * Palettes that are mounted at the same time register here in mount order. Only
 * the most recently mounted palette for a shortcut responds to it.
 */
const shortcutRegistrations: ShortcutRegistration[] = [];

/**
 * Calls `onTrigger` when the shortcut is pressed. Chords are handled even while an
 * editable field has focus, and events that another handler already prevented are
 * ignored.
 */
function useCommandShortcut(shortcut: string | null, onTrigger: () => void) {
  const onTriggerRef = useRef(onTrigger);

  useEffect(() => {
    onTriggerRef.current = onTrigger;
  });

  useEffect(() => {
    if (shortcut === null) {
      return;
    }

    const registration: ShortcutRegistration = { shortcut };
    shortcutRegistrations.push(registration);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.repeat ||
        event.isComposing ||
        event.defaultPrevented ||
        !matchesShortcut(event, shortcut)
      ) {
        return;
      }

      const owner = shortcutRegistrations
        .filter((entry) => entry.shortcut === shortcut)
        .at(-1);

      if (owner !== registration) {
        return;
      }

      event.preventDefault();
      onTriggerRef.current();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      shortcutRegistrations.splice(
        shortcutRegistrations.indexOf(registration),
        1,
      );
    };
  }, [shortcut]);
}

function CommandRoot({
  items,
  filter = matchesCommandQuery,
  onItemSelect,
  children,
}: CommandProps & { onItemSelect?: () => void }) {
  const contextValue = useMemo<CommandContextValue>(
    () => ({
      selectItem: (item) => {
        onItemSelect?.();
        item.onSelect?.();
      },
    }),
    [onItemSelect],
  );

  // Base UI types its `items` as either a flat or a grouped array, not a union, so
  // each shape gets its own root.
  // Without explicit children, the data-driven default is input, list, and empty state.
  const content = (
    <AutoSize>
      {children ?? (
        <>
          <CommandInput />
          <CommandList />
          <CommandEmpty />
        </>
      )}
    </AutoSize>
  );

  const root = isGroupedCommandList(items) ? (
    <BaseAutocomplete.Root items={items} filter={filter}>
      {content}
    </BaseAutocomplete.Root>
  ) : (
    <BaseAutocomplete.Root items={items} filter={filter}>
      {content}
    </BaseAutocomplete.Root>
  );

  return (
    <CommandContext.Provider value={contextValue}>
      {root}
    </CommandContext.Provider>
  );
}

/**
 * Modal command palette. It owns open state and the keyboard shortcut, and closes
 * itself when a command is chosen.
 */
function CommandDialog({
  open,
  defaultOpen = false,
  onOpenChange,
  shortcut = 'Mod+K',
  label = 'Command palette',
  size = 'medium',
  items,
  filter,
  children,
}: CommandDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = open ?? uncontrolledOpen;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  useCommandShortcut(shortcut, () => setOpen(!isOpen));

  const closePalette = useCallback(() => setOpen(false), [setOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <Dialog.Content
        size={size}
        showCloseButton={false}
        aria-label={label}
        className="notable-command__dialog"
      >
        <CommandRoot items={items} filter={filter} onItemSelect={closePalette}>
          {children}
        </CommandRoot>
      </Dialog.Content>
    </Dialog>
  );
}

const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(
  function CommandInput({ className, ...props }, ref) {
    return (
      <div className={joinClassNames('notable-command__input', className)}>
        <BaseAutocomplete.Input
          ref={ref}
          aria-label="Search commands"
          placeholder="Search commands"
          render={
            <Input leadingIcon={<Search size={16} aria-hidden="true" />} />
          }
          {...props}
        />
      </div>
    );
  },
);

const CommandItemPart = forwardRef<HTMLDivElement, CommandItemProps>(
  function CommandItemPart({ item, className, ...props }, ref) {
    const { selectItem } = useCommandContext('Command.Item');

    return (
      <BaseAutocomplete.Item
        ref={ref}
        value={item}
        disabled={item.disabled}
        className={joinClassNames('notable-command__item', className)}
        {...props}
        onClick={() => selectItem(item)}
      >
        {item.icon && (
          <span className="notable-command__item-icon" aria-hidden="true">
            {item.icon}
          </span>
        )}
        <span className="notable-command__item-text">
          <span className="notable-command__item-label">{item.label}</span>
          {item.description && (
            <span className="notable-command__item-description">
              {item.description}
            </span>
          )}
        </span>
        {item.shortcut && item.shortcut.length > 0 && (
          <span className="notable-command__item-shortcut">
            {item.shortcut.map((key, index) => (
              <Shortcut key={`${key}-${index}`}>{key}</Shortcut>
            ))}
          </span>
        )}
      </BaseAutocomplete.Item>
    );
  },
);

const CommandList = forwardRef<HTMLDivElement, CommandListProps>(
  function CommandList({ className, children, ...props }, ref) {
    const renderItem =
      children ?? ((item: CommandItem) => <CommandItemPart item={item} />);

    return (
      <div className="notable-command__list-frame">
        <AnimatedHighlight />
        <BaseAutocomplete.List
          ref={ref}
          aria-label="Commands"
          className={joinClassNames('notable-command__list', className)}
          {...props}
        >
          {(entry: CommandItem | CommandGroup, index: number) =>
            isCommandGroup(entry) ? (
              <BaseAutocomplete.Group
                key={entry.label}
                items={entry.items}
                className="notable-command__group"
              >
                <BaseAutocomplete.GroupLabel className="notable-command__group-label">
                  {entry.label}
                </BaseAutocomplete.GroupLabel>
                <BaseAutocomplete.Collection>
                  {(item: CommandItem, itemIndex: number) => (
                    <Fragment key={item.value}>
                      {renderItem(item, itemIndex)}
                    </Fragment>
                  )}
                </BaseAutocomplete.Collection>
              </BaseAutocomplete.Group>
            ) : (
              <Fragment key={entry.value}>{renderItem(entry, index)}</Fragment>
            )
          }
        </BaseAutocomplete.List>
      </div>
    );
  },
);

const CommandEmpty = forwardRef<HTMLDivElement, CommandEmptyProps>(
  function CommandEmpty(
    { className, children = 'No results found', ...props },
    ref,
  ) {
    return (
      <BaseAutocomplete.Empty
        ref={ref}
        className={joinClassNames('notable-command__empty', className)}
        {...props}
      >
        {children}
      </BaseAutocomplete.Empty>
    );
  },
);

const CommandGroupPart = forwardRef<HTMLDivElement, CommandGroupProps>(
  function CommandGroupPart({ className, ...props }, ref) {
    return (
      <BaseAutocomplete.Group
        ref={ref}
        className={joinClassNames('notable-command__group', className)}
        {...props}
      />
    );
  },
);

const CommandGroupLabel = forwardRef<HTMLDivElement, CommandGroupLabelProps>(
  function CommandGroupLabel({ className, ...props }, ref) {
    return (
      <BaseAutocomplete.GroupLabel
        ref={ref}
        className={joinClassNames('notable-command__group-label', className)}
        {...props}
      />
    );
  },
);

const CommandSeparator = forwardRef<HTMLDivElement, CommandSeparatorProps>(
  function CommandSeparator({ className, ...props }, ref) {
    return (
      <BaseAutocomplete.Separator
        ref={ref}
        className={joinClassNames('notable-command__separator', className)}
        {...props}
      />
    );
  },
);

/**
 * Searchable list of commands. Use `Command.Dialog` for a modal palette, or compose
 * `Command` inline with `Command.Input` and `Command.List`.
 */
export const Command = Object.assign(CommandRoot, {
  Dialog: CommandDialog,
  Input: CommandInput,
  List: CommandList,
  Item: CommandItemPart,
  Empty: CommandEmpty,
  Group: CommandGroupPart,
  GroupLabel: CommandGroupLabel,
  Separator: CommandSeparator,
});
