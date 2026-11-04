import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { useCallback, useMemo, useState } from 'react';
import { AutoSize } from '../../../internal/primitives/auto-size/auto-size.js';
import { Dialog } from '../../dialog/dialog.js';
import { CommandContext, type TCommandContextValue } from '../context.js';
import {
  isGroupedCommandList,
  matchesCommandQuery,
} from '../helpers/filter.js';
import { useCommandShortcut } from '../hooks/use-command-shortcut.js';
import type { CommandDialogProps, TCommandRootProps } from '../types.js';
import { CommandEmpty } from './group.js';
import { CommandInput } from './input.js';
import { CommandList } from './list.js';

export function CommandRoot({
  items,
  filter = matchesCommandQuery,
  onItemSelect,
  children,
}: TCommandRootProps) {
  const contextValue = useMemo<TCommandContextValue>(
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
export function CommandDialog({
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
        className="one-command__dialog"
      >
        <CommandRoot items={items} filter={filter} onItemSelect={closePalette}>
          {children}
        </CommandRoot>
      </Dialog.Content>
    </Dialog>
  );
}
