'use client';

import { FileUpload } from '@dotm4x/one/components';
import { useState } from 'react';

export default function Custom() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div style={{ width: '100%', maxWidth: '480px' }}>
      <FileUpload
        multiple
        accept=".pdf"
        maxFileSize={10 * 1024 * 1024}
        value={files}
        onFilesChange={setFiles}
      >
        <FileUpload.Dropzone>
          <FileUpload.Icon />
          <FileUpload.Title>Add your documents</FileUpload.Title>
          <FileUpload.Description>
            PDF files up to 10 MB, five documents at a time.
          </FileUpload.Description>
          <FileUpload.Trigger>Choose documents</FileUpload.Trigger>
        </FileUpload.Dropzone>
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
