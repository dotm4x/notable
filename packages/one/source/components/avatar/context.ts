import { createContext, useContext } from 'react';

export type TAvatarContextValue = {
  activeSource: string | null;
  loadedSource: string | null;
  setLoadedSource: (source: string | null) => void;
};

export const AvatarContext = createContext<TAvatarContextValue | null>(null);

export function useAvatarContext() {
  const context = useContext(AvatarContext);

  if (!context) {
    throw new Error(
      'Avatar.Image and Avatar.Fallback must be used within Avatar.',
    );
  }

  return context;
}
