import { createContext, useContext } from 'react';

export type TSidebarContextValue = {
  open: boolean;
  isMobile: boolean;
  mobileOpen: boolean;
  sidebarId: string;
  setOpen: (open: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

export const SidebarContext = createContext<TSidebarContextValue | null>(null);

export function useSidebarContext(componentName: string) {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Sidebar.Root.`);
  }

  return context;
}
