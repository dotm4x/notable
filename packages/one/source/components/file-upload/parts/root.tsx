import { forwardRef } from 'react';
import { FileUploadContext } from '../context.js';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import { useFileUploadRoot } from '../hooks/use-file-upload-root.js';
import type { TFileUploadRootProps } from '../types.js';

export const FileUploadRoot = forwardRef<HTMLDivElement, TFileUploadRootProps>(
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
    const {
      handleInputChange,
      handleDragEnter,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      ...context
    } = useFileUploadRoot({
      accept,
      defaultValue,
      disabled,
      invalid,
      maxFileSize,
      maxFiles,
      minFileSize,
      mode,
      multiple,
      onFilesChange,
      onFilesRejected,
      readOnly,
      value,
    });

    return (
      <FileUploadContext.Provider value={context}>
        <div
          ref={ref}
          className={joinClassNames(
            'one-file-upload',
            `one-file-upload--${mode}`,
            className,
          )}
          data-mode={mode}
          data-disabled={disabled || undefined}
          data-readonly={readOnly || undefined}
          data-invalid={invalid || undefined}
          data-required={required || undefined}
          data-drag-active={context.isDragging || undefined}
          data-drag-rejected={
            context.isDragging && context.isDragRejected ? true : undefined
          }
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          {...props}
        >
          <input
            ref={context.inputRef}
            id={id}
            name={name}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            required={required}
            className="one-file-upload__input"
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
