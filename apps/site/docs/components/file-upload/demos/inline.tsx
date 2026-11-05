'use client';

import { FileUpload } from '@dotm4x/one/components';
import { useState } from 'react';

export default function Inline() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div style={{ width: '100%', maxWidth: '480px' }}>
      <FileUpload
        mode="inline"
        multiple
        accept="image/*,.pdf"
        value={files}
        onFilesChange={setFiles}
      >
        <FileUpload.Trigger>Add attachments</FileUpload.Trigger>
        <FileUpload.List>
          {files.map((file) => (
            <FileUpload.Item key={`${file.name}-${file.size}`} file={file}>
              <FileUpload.Name />
              <FileUpload.Size />
              <FileUpload.Remove />
            </FileUpload.Item>
          ))}
        </FileUpload.List>
        <FileUpload.Rejections />
        <FileUpload.Helper>Up to five files, 10 MB each.</FileUpload.Helper>
      </FileUpload>
    </div>
  );
}
