type TParsedShortcut = {
  key: string;
  mod: boolean;
  ctrl: boolean;
  meta: boolean;
  alt: boolean;
  shift: boolean;
};

export type TShortcutRegistration = {
  shortcut: string;
};

function isApplePlatform(): boolean {
  return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
}

function parseShortcut(shortcut: string): TParsedShortcut {
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

export function matchesShortcut(
  event: KeyboardEvent,
  shortcut: string,
): boolean {
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

/**
 * Palettes that are mounted at the same time register here in mount order. Only
 * the most recently mounted palette for a shortcut responds to it.
 */
export const shortcutRegistrations: TShortcutRegistration[] = [];
