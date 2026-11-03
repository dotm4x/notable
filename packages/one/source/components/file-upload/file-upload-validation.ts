/** Reason a file was not added to the selection. */
export type TFileUploadRejectionCode =
  | 'invalid-type'
  | 'file-too-large'
  | 'file-too-small'
  | 'duplicate-file'
  | 'too-many-files';

/** A file that failed validation, with the reason it was rejected. */
export type TFileUploadRejection = {
  file: File;
  code: TFileUploadRejectionCode;
};

/** Constraints applied to every selection, from either the picker or a drop. */
export type TFileUploadConstraints = {
  accept?: string;
  multiple: boolean;
  maxFiles?: number;
  minFileSize?: number;
  maxFileSize?: number;
};

/** Result of applying a new selection to the current files. */
export type TFileUploadSelectionResult = {
  files: File[];
  rejections: TFileUploadRejection[];
};

/** Human-readable message for each rejection code. */
export const FILE_UPLOAD_REJECTION_MESSAGES: Record<
  TFileUploadRejectionCode,
  string
> = {
  'invalid-type': 'This file type is not supported.',
  'file-too-large': 'This file is larger than the maximum size.',
  'file-too-small': 'This file is smaller than the minimum size.',
  'duplicate-file': 'This file has already been selected.',
  'too-many-files': 'The maximum number of files has been reached.',
};

/** Identifies a file for duplicate detection and list keys. */
export function getStableFileKey(file: File): string {
  return `${file.name}::${file.size}::${file.lastModified}`;
}

function parseAcceptTokens(accept: string): string[] {
  return accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
}

/** Checks a file against an `accept` string, following browser conventions. */
export function matchesAccept(
  file: Pick<File, 'name' | 'type'>,
  accept: string | undefined,
): boolean {
  if (!accept) {
    return true;
  }

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return parseAcceptTokens(accept).some((token) => {
    if (token.startsWith('.')) {
      return name.endsWith(token);
    }
    if (token.endsWith('/*')) {
      return type.startsWith(token.slice(0, -1));
    }
    return type === token;
  });
}

/**
 * Whether a dragged item might be accepted before its name is known.
 * Extension tokens cannot be checked during a drag, so they count as possible.
 */
export function mightAcceptDraggedType(
  type: string,
  accept: string | undefined,
): boolean {
  if (!accept || !type) {
    return true;
  }

  const normalizedType = type.toLowerCase();

  return parseAcceptTokens(accept).some((token) => {
    if (token.startsWith('.')) {
      return true;
    }
    if (token.endsWith('/*')) {
      return normalizedType.startsWith(token.slice(0, -1));
    }
    return normalizedType === token;
  });
}

/**
 * Applies a new selection to the current files.
 *
 * In multiple mode, valid files are appended in order. Files that are
 * already selected are rejected as duplicates, and files beyond `maxFiles`
 * are rejected. In single mode, the first valid file replaces the current
 * selection. If no file is valid, the current selection is kept.
 */
export function resolveFileSelection(
  current: readonly File[],
  incoming: readonly File[],
  constraints: TFileUploadConstraints,
): TFileUploadSelectionResult {
  const { accept, maxFileSize, maxFiles, minFileSize, multiple } = constraints;
  const limit = multiple ? (maxFiles ?? Number.POSITIVE_INFINITY) : 1;
  const files = [...current];
  const keys = new Set(files.map(getStableFileKey));
  const rejections: TFileUploadRejection[] = [];
  let replaced = false;

  for (const file of incoming) {
    const reject = (code: TFileUploadRejectionCode) =>
      rejections.push({ file, code });

    if (!matchesAccept(file, accept)) {
      reject('invalid-type');
      continue;
    }
    if (maxFileSize !== undefined && file.size > maxFileSize) {
      reject('file-too-large');
      continue;
    }
    if (minFileSize !== undefined && file.size < minFileSize) {
      reject('file-too-small');
      continue;
    }

    const key = getStableFileKey(file);
    if (multiple && keys.has(key)) {
      reject('duplicate-file');
      continue;
    }

    if (!multiple) {
      if (replaced) {
        reject('too-many-files');
        continue;
      }
      replaced = true;
      files.length = 0;
      files.push(file);
      keys.clear();
      keys.add(key);
      continue;
    }

    if (files.length >= limit) {
      reject('too-many-files');
      continue;
    }

    files.push(file);
    keys.add(key);
  }

  return { files, rejections };
}

/** Formats a byte count using binary units, for example `1.5 MB`. */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${units[unitIndex]}`;
}

/** Summarizes the selection constraints for display in the dropzone. */
export function describeFileConstraints(
  constraints: Pick<
    TFileUploadConstraints,
    'accept' | 'maxFileSize' | 'maxFiles' | 'multiple'
  >,
): string {
  const parts: string[] = [];

  if (constraints.accept) {
    parts.push(`Accepted: ${constraints.accept}`);
  }
  if (constraints.maxFileSize !== undefined) {
    parts.push(`up to ${formatFileSize(constraints.maxFileSize)} per file`);
  }
  if (constraints.multiple && constraints.maxFiles !== undefined) {
    parts.push(`up to ${constraints.maxFiles} files`);
  }

  return parts.join(', ');
}
