import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from 'motion/react';
import { AutoSize } from '../../internal/primitives/auto-size/auto-size.js';
import {
  File as FileIcon,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  Paperclip,
  Plus,
  Upload,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type DragEvent,
  type MouseEvent,
  type RefObject,
} from 'react';
import { Button, type ButtonProps } from '../button/button.js';
import { DURATION_BASE, EASING_STANDARD } from '../../styles/motion.js';
import {
  describeFileConstraints,
  FILE_UPLOAD_REJECTION_MESSAGES,
  formatFileSize,
  getStableFileKey,
  mightAcceptDraggedType,
  resolveFileSelection,
  type TFileUploadRejection,
} from './file-upload-validation.js';
import './file-upload.css';

export type {
  TFileUploadRejection,
  TFileUploadRejectionCode,
} from './file-upload-validation.js';

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

type TFileUploadContextValue = {
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

const FileUploadContext = createContext<TFileUploadContextValue | null>(null);
const FileItemContext = createContext<File | null>(null);

function useFileUploadContext(): TFileUploadContextValue {
  const context = useContext(FileUploadContext);
  if (!context) {
    throw new Error(
      'FileUpload parts must be rendered inside FileUpload.Root.',
    );
  }
  return context;
}

function useFileItem(): File {
  const file = useContext(FileItemContext);
  if (!file) {
    throw new Error(
      'FileUpload item parts must be rendered inside FileUpload.Item.',
    );
  }
  return file;
}

function classNames(...names: (string | false | null | undefined)[]): string {
  return names.filter(Boolean).join(' ');
}

function hasFileData(dataTransfer: DataTransfer | null | undefined): boolean {
  return Array.from(dataTransfer?.types ?? []).includes('Files');
}

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

function useStrayFileDropGuard() {
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

const FileUploadRoot = forwardRef<HTMLDivElement, TFileUploadRootProps>(
  function FileUploadRoot(
    {
      accept,
      children,
      className,
      defaultValue,
      disabled = false,
      id,
      invalid = false,
      maxFileSize,
      maxFiles,
      minFileSize,
      mode = 'dropzone',
      multiple = false,
      name,
      onFilesChange,
      onFilesRejected,
      readOnly = false,
      required = false,
      value,
      ...props
    },
    ref,
  ) {
    const [internalFiles, setInternalFiles] = useState<File[]>(
      defaultValue ?? [],
    );
    const [rejections, setRejections] = useState<TFileUploadRejection[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isDragRejected, setIsDragRejected] = useState(false);
    const dragDepth = useRef(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useStrayFileDropGuard();

    const isControlled = value !== undefined;
    const files = value ?? internalFiles;
    const canSelect = !disabled && !readOnly;
    const isFull =
      multiple && maxFiles !== undefined && files.length >= maxFiles;
    const constraintSummary = describeFileConstraints({
      accept,
      maxFileSize,
      maxFiles,
      multiple,
    });

    const commitFiles = (next: File[]) => {
      const unchanged =
        next.length === files.length &&
        next.every((file, index) => file === files[index]);
      if (unchanged) {
        return;
      }
      if (!isControlled) {
        setInternalFiles(next);
      }
      onFilesChange?.(next);
    };

    const addFiles = (incoming: File[]) => {
      if (!canSelect || incoming.length === 0) {
        return;
      }
      const result = resolveFileSelection(files, incoming, {
        accept,
        maxFileSize,
        maxFiles,
        minFileSize,
        multiple,
      });
      setRejections(result.rejections);
      if (result.rejections.length > 0) {
        onFilesRejected?.(result.rejections);
      }
      commitFiles(result.files);
    };

    const removeFile = (file: File) => {
      if (!canSelect) {
        return;
      }
      commitFiles(files.filter((current) => current !== file));
    };

    const clearFiles = () => {
      if (!canSelect) {
        return;
      }
      setRejections([]);
      commitFiles([]);
    };

    const openPicker = () => {
      if (canSelect) {
        inputRef.current?.click();
      }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(event.currentTarget.files ?? []);
      event.currentTarget.value = '';
      addFiles(selected);
    };

    const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
      if (!canSelect || !hasFileData(event.dataTransfer)) {
        return;
      }
      event.preventDefault();
      dragDepth.current += 1;
      setIsDragging(true);
      const items = Array.from(event.dataTransfer.items ?? []).filter(
        (item) => item.kind === 'file',
      );
      setIsDragRejected(
        items.length > 0 &&
          !items.some((item) => mightAcceptDraggedType(item.type, accept)),
      );
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
      if (!canSelect || !hasFileData(event.dataTransfer)) {
        return;
      }
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    };

    const resetDragState = () => {
      dragDepth.current = 0;
      setIsDragging(false);
      setIsDragRejected(false);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
      if (!hasFileData(event.dataTransfer)) {
        return;
      }
      dragDepth.current = Math.max(0, dragDepth.current - 1);
      if (dragDepth.current === 0) {
        setIsDragging(false);
        setIsDragRejected(false);
      }
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
      if (!canSelect || !hasFileData(event.dataTransfer)) {
        return;
      }
      event.preventDefault();
      resetDragState();
      addFiles(Array.from(event.dataTransfer.files));
    };

    const context: TFileUploadContextValue = {
      mode,
      accept,
      multiple,
      canSelect,
      disabled,
      readOnly,
      invalid,
      files,
      rejections,
      isDragging,
      isDragRejected,
      isFull,
      constraintSummary,
      inputRef,
      openPicker,
      removeFile,
      clearFiles,
    };

    return (
      <FileUploadContext.Provider value={context}>
        <div
          ref={ref}
          className={classNames(
            'notable-file-upload',
            `notable-file-upload--${mode}`,
            className,
          )}
          data-mode={mode}
          data-disabled={disabled || undefined}
          data-readonly={readOnly || undefined}
          data-invalid={invalid || undefined}
          data-required={required || undefined}
          data-drag-active={isDragging || undefined}
          data-drag-rejected={isDragging && isDragRejected ? true : undefined}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          {...props}
        >
          <input
            ref={inputRef}
            id={id}
            name={name}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            required={required}
            className="notable-file-upload__input"
            tabIndex={-1}
            aria-hidden="true"
            onChange={handleInputChange}
          />
          {children}
        </div>
      </FileUploadContext.Provider>
    );
  },
);

/** Props for {@link FileUpload.Dropzone}. */
export type TFileUploadDropzoneProps = Omit<ComponentProps<'div'>, 'onClick'>;

function FileUploadDropzone({
  children,
  className,
  ...props
}: TFileUploadDropzoneProps) {
  const { canSelect, constraintSummary, openPicker } = useFileUploadContext();

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (
      event.target instanceof Element &&
      event.target.closest('button, a, input, label')
    ) {
      return;
    }
    openPicker();
  };

  return (
    <div
      className={classNames('notable-file-upload__dropzone', className)}
      onClick={canSelect ? handleClick : undefined}
      {...props}
    >
      {children ?? (
        <>
          <FileUploadIcon />
          <FileUploadTitle>Drop files here</FileUploadTitle>
          {constraintSummary && (
            <FileUploadDescription>{constraintSummary}</FileUploadDescription>
          )}
          <FileUploadTrigger />
        </>
      )}
    </div>
  );
}

/** Props for {@link FileUpload.Icon}. */
export type TFileUploadIconProps = ComponentProps<'span'>;

function FileUploadIcon({
  children,
  className,
  ...props
}: TFileUploadIconProps) {
  return (
    <span
      className={classNames('notable-file-upload__icon', className)}
      {...props}
      aria-hidden="true"
    >
      {children ?? <Upload size={20} />}
    </span>
  );
}

function FileUploadTitle({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={classNames('notable-file-upload__title', className)}
      {...props}
    />
  );
}

function FileUploadDescription({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={classNames('notable-file-upload__description', className)}
      {...props}
    />
  );
}

function FileUploadHelper({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={classNames('notable-file-upload__helper', className)}
      {...props}
    />
  );
}

/** Props for {@link FileUpload.Trigger}, in addition to Button props. */
export type TFileUploadTriggerProps = ButtonProps;

function FileUploadTrigger({
  children,
  onClick,
  size,
  variant,
  ...props
}: TFileUploadTriggerProps) {
  const { canSelect, mode, openPicker } = useFileUploadContext();
  const isInline = mode === 'inline';

  return (
    <Button
      type="button"
      className="notable-file-upload__trigger"
      variant={variant ?? (isInline ? 'ghost' : 'secondary')}
      size={size ?? (isInline ? 'icon-small' : 'small')}
      disabled={!canSelect}
      aria-label={isInline && !children ? 'Attach files' : undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          openPicker();
        }
      }}
      {...props}
    >
      {children ??
        (isInline ? (
          <Paperclip size={16} aria-hidden="true" />
        ) : (
          'Browse files'
        ))}
    </Button>
  );
}

/** Props for {@link FileUpload.List}, in addition to native `ul` attributes. */
export type TFileUploadListProps = ComponentProps<'ul'>;

function FileUploadList({
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
    <AutoSize axis="vertical" className="notable-file-upload__list-container">
      <ul
        className={classNames('notable-file-upload__list', className)}
        {...props}
      >
        <AnimatePresence initial={false}>{children}</AnimatePresence>
        {showAddTile && (
          <li className="notable-file-upload__add-item">
            <button
              type="button"
              className="notable-file-upload__add"
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

/** Props for {@link FileUpload.Item}. */
export type TFileUploadItemProps = HTMLMotionProps<'li'> & {
  /** The selected file this item displays. */
  file: File;
};

function FileUploadItem({
  children,
  className,
  file,
  ...props
}: TFileUploadItemProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <FileItemContext.Provider value={file}>
      <motion.li
        className={classNames('notable-file-upload__item', className)}
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

function getFileIcon(file: File): LucideIcon {
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

/**
 * Creates an object URL for the file and revokes it when the file changes or
 * the component unmounts. Returns null when no file is provided.
 */
function useObjectUrl(file: File | null): string | null {
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

/** Props for {@link FileUpload.Preview}. */
export type TFileUploadPreviewProps = ComponentProps<'span'>;

function FileUploadPreview({ className, ...props }: TFileUploadPreviewProps) {
  const file = useFileItem();
  const isImage = file.type.startsWith('image/');
  const imageUrl = useObjectUrl(isImage ? file : null);
  const Icon = getFileIcon(file);

  return (
    <span
      className={classNames('notable-file-upload__preview', className)}
      {...props}
      aria-hidden="true"
    >
      {imageUrl ? (
        <img className="notable-file-upload__image" src={imageUrl} alt="" />
      ) : (
        <Icon size={18} aria-hidden="true" />
      )}
    </span>
  );
}

/** Props for {@link FileUpload.Name}. */
export type TFileUploadNameProps = ComponentProps<'span'>;

function FileUploadName({
  className,
  children,
  ...props
}: TFileUploadNameProps) {
  const file = useFileItem();

  return (
    <span
      className={classNames('notable-file-upload__name', className)}
      title={file.name}
      {...props}
    >
      {children ?? file.name}
    </span>
  );
}

/** Props for {@link FileUpload.Size}. */
export type TFileUploadSizeProps = ComponentProps<'span'>;

function FileUploadSize({
  className,
  children,
  ...props
}: TFileUploadSizeProps) {
  const file = useFileItem();

  return (
    <span
      className={classNames('notable-file-upload__size', className)}
      {...props}
    >
      {children ?? formatFileSize(file.size)}
    </span>
  );
}

/** Props for {@link FileUpload.Remove}, in addition to Button props. */
export type TFileUploadRemoveProps = ButtonProps;

function FileUploadRemove({
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
      className={classNames('notable-file-upload__remove', className)}
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

/** Props for {@link FileUpload.Clear}, in addition to Button props. */
export type TFileUploadClearProps = ButtonProps;

function FileUploadClear({
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
      className={classNames('notable-file-upload__clear', className)}
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

/** Props for {@link FileUpload.Rejections}, in addition to native `div` attributes. */
export type TFileUploadRejectionsProps = ComponentProps<'div'>;

function describeRejections(rejections: TFileUploadRejection[]): string {
  const names = rejections.map((rejection) => rejection.file.name).join(', ');
  return `${rejections.length} ${rejections.length === 1 ? 'file was' : 'files were'} rejected: ${names}`;
}

function FileUploadRejections({
  className,
  ...props
}: TFileUploadRejectionsProps) {
  const { rejections } = useFileUploadContext();

  return (
    <div
      className={classNames('notable-file-upload__rejections', className)}
      {...props}
    >
      <span className="notable-file-upload__status" role="status">
        {rejections.length > 0 ? describeRejections(rejections) : ''}
      </span>
      {rejections.length > 0 && (
        <ul className="notable-file-upload__rejection-list">
          {rejections.map((rejection, index) => (
            <li
              key={`${index}-${getStableFileKey(rejection.file)}-${rejection.code}`}
              className="notable-file-upload__rejection"
            >
              <span className="notable-file-upload__name">
                {rejection.file.name}
              </span>
              <span className="notable-file-upload__rejection-reason">
                {FILE_UPLOAD_REJECTION_MESSAGES[rejection.code]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const FileUpload = Object.assign(FileUploadRoot, {
  Dropzone: FileUploadDropzone,
  Icon: FileUploadIcon,
  Title: FileUploadTitle,
  Description: FileUploadDescription,
  Helper: FileUploadHelper,
  Trigger: FileUploadTrigger,
  List: FileUploadList,
  Item: FileUploadItem,
  Preview: FileUploadPreview,
  Name: FileUploadName,
  Size: FileUploadSize,
  Remove: FileUploadRemove,
  Clear: FileUploadClear,
  Rejections: FileUploadRejections,
});
