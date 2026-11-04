import type { HTMLMotionProps } from 'motion/react';
import type { ComponentProps } from 'react';
import type { ButtonProps } from '../button/button.js';
import type { TFileUploadRejection } from './helpers/validation.js';

/** Presentation of the file upload. Behavior is identical across modes. */
export type TFileUploadMode = 'dropzone' | 'compact' | 'inline' | 'media';

/** Props for {@link FileUpload.Root}, in addition to native `div` attributes. */
export type TFileUploadRootProps = Omit<
  ComponentProps<'div'>,
  | 'defaultValue'
  | 'onChange'
  | 'onDragEnter'
  | 'onDragLeave'
  | 'onDragOver'
  | 'onDrop'
> & {
  /** Presentation mode. Defaults to `dropzone`. */
  mode?: TFileUploadMode;
  /** Accepted MIME types, wildcards (`image/*`), and extensions (`.pdf`). */
  accept?: string;
  /** Allows selecting more than one file. Defaults to `false`. */
  multiple?: boolean;
  /** Maximum number of files when `multiple` is set. */
  maxFiles?: number;
  /** Minimum file size in bytes. */
  minFileSize?: number;
  /** Maximum file size in bytes. */
  maxFileSize?: number;
  /** Selected files for controlled usage. */
  value?: File[];
  /** Initially selected files for uncontrolled usage. */
  defaultValue?: File[];
  /** Called with the complete next selection whenever it changes. */
  onFilesChange?: (files: File[]) => void;
  /** Called with the rejected files and their reasons after a selection attempt. */
  onFilesRejected?: (rejections: TFileUploadRejection[]) => void;
  /** Prevents selection and removal. */
  disabled?: boolean;
  /** Prevents selection and removal while keeping the files visible. */
  readOnly?: boolean;
  /** Marks the native input as required. */
  required?: boolean;
  /** Marks the component as invalid for styling. Pair with an error message. */
  invalid?: boolean;
  /** Name of the native file input, used in form submission. */
  name?: string;
  /** Id of the native file input. */
  id?: string;
};

/** Props for {@link FileUpload.Dropzone}. */
export type TFileUploadDropzoneProps = Omit<ComponentProps<'div'>, 'onClick'>;

/** Props for {@link FileUpload.Icon}. */
export type TFileUploadIconProps = ComponentProps<'span'>;

/** Props for {@link FileUpload.Trigger}, in addition to Button props. */
export type TFileUploadTriggerProps = ButtonProps;

/** Props for {@link FileUpload.List}, in addition to native `ul` attributes. */
export type TFileUploadListProps = ComponentProps<'ul'>;

/** Props for {@link FileUpload.Item}. */
export type TFileUploadItemProps = HTMLMotionProps<'li'> & {
  /** The selected file this item displays. */
  file: File;
};

/** Props for {@link FileUpload.Preview}. */
export type TFileUploadPreviewProps = ComponentProps<'span'>;

/** Props for {@link FileUpload.Name}. */
export type TFileUploadNameProps = ComponentProps<'span'>;

/** Props for {@link FileUpload.Size}. */
export type TFileUploadSizeProps = ComponentProps<'span'>;

/** Props for {@link FileUpload.Remove}, in addition to Button props. */
export type TFileUploadRemoveProps = ButtonProps;

/** Props for {@link FileUpload.Clear}, in addition to Button props. */
export type TFileUploadClearProps = ButtonProps;

/** Props for {@link FileUpload.Rejections}, in addition to native `div` attributes. */
export type TFileUploadRejectionsProps = ComponentProps<'div'>;
