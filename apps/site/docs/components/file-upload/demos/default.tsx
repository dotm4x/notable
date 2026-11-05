'use client';

import { FileUpload } from '@dotm4x/one/components';
import { useState } from 'react';

export default function Default() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div style={{ width: '100%', maxWidth: '480px' }}>
      <FileUpload
        accept="image/*,.pdf"
        multiple
        maxFiles={5}
        value={files}
        onFilesChange={setFiles}
      >
        <FileUpload.Dropzone />
        <FileUpload.List>
          {files.map((file) => (
            <FileUpload.Item key={`${file.name}-${file.size}`} file={file}>
              <FileUpload.Preview />
              <FileUpload.Name />
              <FileUpload.Size />
              <FileUpload.Remove />
            </FileUpload.Item>
          ))}
        </FileUpload.List>
        <FileUpload.Rejections />
        <FileUpload.Clear />
      </FileUpload>
    </div>
  );
}
