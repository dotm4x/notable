import {
  useCallback,
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from 'react';
import type { TCssCustomProperties } from '../../../internal/helpers/css-custom-properties.js';
import { toCssLength } from '../helpers/css-length.js';
import { getIsMobile, subscribeToMobile } from '../helpers/mobile.js';

type TUseSidebarRootOptions = {
  open: boolean | undefined;
  defaultOpen: boolean;
  onOpenChange: ((open: boolean) => void) | undefined;
  keyboardShortcut: string | false;
  width: number | string;
  collapsedWidth: number | string;
  mobileWidth: number | string;
};

export function useSidebarRoot({
  open,
  defaultOpen,
  onOpenChange,
  keyboardShortcut,
  width,
  collapsedWidth,
  mobileWidth,
}: TUseSidebarRootOptions) {
  const sidebarId = useId();
  const isMobile = useSyncExternalStore(
    subscribeToMobile,
    getIsMobile,
    () => false,
  );
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isOpen = open ?? uncontrolledOpen;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [onOpenChange, open],
  );

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileOpen((currentOpen) => !currentOpen);
    } else {
      setOpen(!isOpen);
    }
  }, [isMobile, isOpen, setOpen]);

  useEffect(() => {
    if (keyboardShortcut === false) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      const isEditing =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.matches('input, textarea, select, [role="textbox"]'));

      if (
        !isEditing &&
        !event.repeat &&
        !event.shiftKey &&
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        event.key.toLowerCase() === keyboardShortcut.toLowerCase()
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keyboardShortcut, toggleSidebar]);

  const sidebarStyle: CSSProperties & TCssCustomProperties = {
    '--_sidebar-width': toCssLength(width),
    '--_sidebar-collapsed-width': toCssLength(collapsedWidth),
  };
  const mobileDrawerStyle: CSSProperties & TCssCustomProperties = {
    '--_drawer-horizontal-size': toCssLength(mobileWidth),
  };

  return {
    sidebarId,
    isMobile,
    isOpen,
    mobileOpen,
    setMobileOpen,
    setOpen,
    toggleSidebar,
    sidebarStyle,
    mobileDrawerStyle,
  };
}
