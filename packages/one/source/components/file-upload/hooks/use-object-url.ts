import { useEffect, useState } from 'react';

/**
 * Creates an object URL for the file and revokes it when the file changes or
 * the component unmounts. Returns null when no file is provided.
 */
export function useObjectUrl(file: File | null): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return file ? url : null;
}
