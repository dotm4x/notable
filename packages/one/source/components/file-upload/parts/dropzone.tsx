import type { ComponentProps, MouseEvent } from 'react';
import { Paperclip, Upload } from '../../../icons';
import { Button } from '../../button/button.js';
import { useFileUploadContext } from '../context.js';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import type {
  TFileUploadDropzoneProps,
  TFileUploadIconProps,
  TFileUploadTriggerProps,
} from '../types.js';

export function FileUploadDropzone({
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
      className={joinClassNames('one-file-upload__dropzone', className)}
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

export function FileUploadIcon({
  children,
  className,
  ...props
}: TFileUploadIconProps) {
  return (
    <span
      className={joinClassNames('one-file-upload__icon', className)}
      {...props}
      aria-hidden="true"
    >
      {children ?? <Upload size={20} />}
    </span>
  );
}

export function FileUploadTitle({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={joinClassNames('one-file-upload__title', className)}
      {...props}
    />
  );
}

export function FileUploadDescription({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={joinClassNames('one-file-upload__description', className)}
      {...props}
    />
  );
}

export function FileUploadHelper({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={joinClassNames('one-file-upload__helper', className)}
      {...props}
    />
  );
}

export function FileUploadTrigger({
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
      className="one-file-upload__trigger"
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
