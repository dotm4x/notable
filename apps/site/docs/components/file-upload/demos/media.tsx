'use client';

import { FileUpload } from '@dotm4x/one/components';
import { useState } from 'react';

export default function Media() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div style={{ width: '100%', maxWidth: '480px' }}>
      <FileUpload
        mode="media"
        multiple
        accept="image/*"
        maxFiles={6}
        value={files}
        onFilesChange={setFiles}
      >
        <FileUpload.List>
          {files.map((file) => (
            <FileUpload.Item key={`${file.name}-${file.size}`} file={file}>
              <FileUpload.Preview />
              <FileUpload.Name />
              <FileUpload.Remove />
            </FileUpload.Item>
          ))}
        </FileUpload.List>
        <FileUpload.Rejections />
      </FileUpload>
    </div>
  );
}
