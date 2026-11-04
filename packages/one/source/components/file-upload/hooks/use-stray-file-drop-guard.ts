import { useEffect } from 'react';
import { hasFileData } from '../helpers/drop.js';

/**
 * Drops on the page that are not handled by a FileUpload would otherwise make
 * the browser navigate to the file. Only file drags are affected, and drops
 * inside a FileUpload are left to it.
 */
let mountedRootCount = 0;

function preventStrayFileDrop(event: globalThis.DragEvent) {
  if (event.defaultPrevented || !hasFileData(event.dataTransfer)) {
    return;
  }
  event.preventDefault();
}

export function useStrayFileDropGuard() {
  useEffect(() => {
    mountedRootCount += 1;
    if (mountedRootCount === 1) {
      window.addEventListener('drop', preventStrayFileDrop);
    }
    return () => {
      mountedRootCount -= 1;
      if (mountedRootCount === 0) {
        window.removeEventListener('drop', preventStrayFileDrop);
      }
    };
  }, []);
}
