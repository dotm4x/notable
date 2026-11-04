import { useEffect, useRef } from 'react';
import {
  matchesShortcut,
  shortcutRegistrations,
  type TShortcutRegistration,
} from '../helpers/shortcut.js';

/**
 * Calls `onTrigger` when the shortcut is pressed. Chords are handled even while an
 * editable field has focus, and events that another handler already prevented are
 * ignored.
 */
export function useCommandShortcut(
  shortcut: string | null,
  onTrigger: () => void,
) {
  const onTriggerRef = useRef(onTrigger);

  useEffect(() => {
    onTriggerRef.current = onTrigger;
  });

  useEffect(() => {
    if (shortcut === null) {
      return;
    }

    const registration: TShortcutRegistration = { shortcut };
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
