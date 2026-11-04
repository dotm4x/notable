import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { ElementType } from 'react';
import { AutoSize } from '../../../internal/primitives/auto-size/auto-size.js';
import {
  File as FileIcon,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  Plus,
  X,
} from '../../../icons';
import { DURATION_BASE, EASING_STANDARD } from '../../../styles/motion.js';
import { Button } from '../../button/button.js';
import {
  FileItemContext,
  useFileItem,
  useFileUploadContext,
} from '../context.js';
import { formatFileSize } from '../helpers/validation.js';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import { useObjectUrl } from '../hooks/use-object-url.js';
import type {
  TFileUploadClearProps,
  TFileUploadItemProps,
  TFileUploadListProps,
  TFileUploadNameProps,
  TFileUploadPreviewProps,
  TFileUploadRemoveProps,
  TFileUploadSizeProps,
} from '../types.js';

export function FileUploadList({
  children,
  className,
  ...props
}: TFileUploadListProps) {
  const { canSelect, files, isFull, multiple, mode, openPicker } =
    useFileUploadContext();
  const showAddTile = mode === 'media' && canSelect && !(multiple && isFull);
  const addLabel = multiple
    ? 'Add files'
    : files.length > 0
      ? 'Replace file'
      : 'Add file';

  return (
    <AutoSize axis="vertical" className="one-file-upload__list-container">
      <ul
        className={joinClassNames('one-file-upload__list', className)}
        {...props}
      >
        <AnimatePresence initial={false}>{children}</AnimatePresence>
        {showAddTile && (
          <li className="one-file-upload__add-item">
            <button
              type="button"
              className="one-file-upload__add"
              aria-label={addLabel}
              onClick={openPicker}
            >
              <Plus size={22} aria-hidden="true" />
            </button>
          </li>
        )}
      </ul>
    </AutoSize>
  );
}

export function FileUploadItem({
  children,
  className,
  file,
  ...props
}: TFileUploadItemProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <FileItemContext.Provider value={file}>
      <motion.li
        className={joinClassNames('one-file-upload__item', className)}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: DURATION_BASE, ease: EASING_STANDARD }
        }
        {...props}
      >
        {children ?? (
          <>
            <FileUploadPreview />
            <FileUploadName />
            <FileUploadSize />
            <FileUploadRemove />
          </>
        )}
      </motion.li>
    </FileItemContext.Provider>
  );
}

function getFileIcon(file: File): ElementType {
  if (file.type.startsWith('image/')) {
    return FileImage;
  }
  if (file.type.startsWith('video/')) {
    return FileVideo;
  }
  if (file.type.startsWith('audio/')) {
    return FileAudio;
  }
  if (file.type.startsWith('text/') || file.type === 'application/pdf') {
    return FileText;
  }
  return FileIcon;
}

export function FileUploadPreview({
  className,
  ...props
}: TFileUploadPreviewProps) {
  const file = useFileItem();
  const isImage = file.type.startsWith('image/');
  const imageUrl = useObjectUrl(isImage ? file : null);
  const Icon = getFileIcon(file);

  return (
    <span
      className={joinClassNames('one-file-upload__preview', className)}
      {...props}
      aria-hidden="true"
    >
      {imageUrl ? (
        <img className="one-file-upload__image" src={imageUrl} alt="" />
      ) : (
        <Icon size={18} aria-hidden="true" />
      )}
    </span>
  );
}

export function FileUploadName({
  className,
  children,
  ...props
}: TFileUploadNameProps) {
  const file = useFileItem();

  return (
    <span
      className={joinClassNames('one-file-upload__name', className)}
      title={file.name}
      {...props}
    >
      {children ?? file.name}
    </span>
  );
}

export function FileUploadSize({
  className,
  children,
  ...props
}: TFileUploadSizeProps) {
  const file = useFileItem();

  return (
    <span
      className={joinClassNames('one-file-upload__size', className)}
      {...props}
    >
      {children ?? formatFileSize(file.size)}
    </span>
  );
}

export function FileUploadRemove({
  children,
  className,
  onClick,
  ...props
}: TFileUploadRemoveProps) {
  const file = useFileItem();
  const { canSelect, removeFile } = useFileUploadContext();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-small"
      className={joinClassNames('one-file-upload__remove', className)}
      aria-label={`Remove ${file.name}`}
      disabled={!canSelect}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          removeFile(file);
        }
      }}
      {...props}
    >
      {children ?? <X size={16} aria-hidden="true" />}
    </Button>
  );
}

export function FileUploadClear({
  children,
  className,
  onClick,
  ...props
}: TFileUploadClearProps) {
  const { canSelect, clearFiles, files } = useFileUploadContext();

  return (
    <Button
      type="button"
      variant="ghost"
      size="small"
      className={joinClassNames('one-file-upload__clear', className)}
      disabled={!canSelect || files.length === 0}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          clearFiles();
        }
      }}
      {...props}
    >
      {children ?? 'Clear all'}
    </Button>
  );
}
