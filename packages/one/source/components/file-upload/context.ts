import { createContext, useContext, type RefObject } from 'react';
import type { TFileUploadRejection } from './helpers/validation.js';
import type { TFileUploadMode } from './types.js';

export type TFileUploadContextValue = {
  mode: TFileUploadMode;
  accept?: string;
  multiple: boolean;
  canSelect: boolean;
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  files: File[];
  rejections: TFileUploadRejection[];
  isDragging: boolean;
  isDragRejected: boolean;
  isFull: boolean;
  constraintSummary: string;
  inputRef: RefObject<HTMLInputElement | null>;
  openPicker: () => void;
  removeFile: (file: File) => void;
  clearFiles: () => void;
};

export const FileUploadContext = createContext<TFileUploadContextValue | null>(
  null,
);

export const FileItemContext = createContext<File | null>(null);

export function useFileUploadContext(): TFileUploadContextValue {
  const context = useContext(FileUploadContext);
  if (!context) {
    throw new Error(
      'FileUpload parts must be rendered inside FileUpload.Root.',
    );
  }
  return context;
}

export function useFileItem(): File {
  const file = useContext(FileItemContext);
  if (!file) {
    throw new Error(
      'FileUpload item parts must be rendered inside FileUpload.Item.',
    );
  }
  return file;
}
