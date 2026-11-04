import { useFileUploadContext } from '../context.js';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import {
  FILE_UPLOAD_REJECTION_MESSAGES,
  getStableFileKey,
  type TFileUploadRejection,
} from '../helpers/validation.js';
import type { TFileUploadRejectionsProps } from '../types.js';

function describeRejections(rejections: TFileUploadRejection[]): string {
  const names = rejections.map((rejection) => rejection.file.name).join(', ');
  return `${rejections.length} ${rejections.length === 1 ? 'file was' : 'files were'} rejected: ${names}`;
}

export function FileUploadRejections({
  className,
  ...props
}: TFileUploadRejectionsProps) {
  const { rejections } = useFileUploadContext();

  return (
    <div
      className={joinClassNames('one-file-upload__rejections', className)}
      {...props}
    >
      <span className="one-file-upload__status" role="status">
        {rejections.length > 0 ? describeRejections(rejections) : ''}
      </span>
      {rejections.length > 0 && (
        <ul className="one-file-upload__rejection-list">
          {rejections.map((rejection, index) => (
            <li
              key={`${index}-${getStableFileKey(rejection.file)}-${rejection.code}`}
              className="one-file-upload__rejection"
            >
              <span className="one-file-upload__name">
                {rejection.file.name}
              </span>
              <span className="one-file-upload__rejection-reason">
                {FILE_UPLOAD_REJECTION_MESSAGES[rejection.code]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
