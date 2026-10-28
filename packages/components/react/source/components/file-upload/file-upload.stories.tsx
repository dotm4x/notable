import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../button/button.js';
import { FileUpload } from './file-upload.js';

const meta = {
  title: 'Components/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['dropzone', 'compact', 'inline', 'media'],
    },
  },
  args: {
    mode: 'dropzone',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

function DefaultFileUpload({
  mode,
  multiple = false,
  accept,
  maxFiles,
  maxFileSize,
  disabled,
  readOnly,
  invalid,
  required,
}: {
  mode: 'dropzone' | 'compact' | 'inline' | 'media';
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  maxFileSize?: number;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  required?: boolean;
}) {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileUpload
      mode={mode}
      multiple={multiple}
      accept={accept}
      maxFiles={maxFiles}
      maxFileSize={maxFileSize}
      disabled={disabled}
      readOnly={readOnly}
      invalid={invalid}
      required={required}
      value={files}
      onFilesChange={setFiles}
    >
      {mode === 'dropzone' || mode === 'media' ? (
        <FileUpload.Dropzone />
      ) : (
        <FileUpload.Trigger />
      )}
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
      {multiple && <FileUpload.Clear />}
    </FileUpload>
  );
}

export const Default: Story = {
  render: () => (
    <DefaultFileUpload
      mode="dropzone"
      multiple
      accept="image/*,.pdf"
      maxFiles={5}
    />
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      <DefaultFileUpload mode="dropzone" multiple />
      <DefaultFileUpload mode="compact" multiple />
      <DefaultFileUpload mode="inline" multiple />
      <DefaultFileUpload mode="media" multiple accept="image/*" />
    </div>
  ),
};

export const SingleFile: Story = {
  render: () => <DefaultFileUpload mode="dropzone" accept=".pdf" />,
};

export const SizeLimit: Story = {
  render: () => (
    <DefaultFileUpload mode="dropzone" multiple maxFileSize={1024 * 1024} />
  ),
};

export const Disabled: Story = {
  render: () => <DefaultFileUpload mode="dropzone" disabled />,
};

export const ReadOnly: Story = {
  render: () => <DefaultFileUpload mode="dropzone" readOnly />,
};

export const Invalid: Story = {
  render: () => <DefaultFileUpload mode="dropzone" invalid required />,
};

function CustomContentFileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <FileUpload multiple value={files} onFilesChange={setFiles}>
      <FileUpload.Dropzone>
        <FileUpload.Title>Add your documents</FileUpload.Title>
        <FileUpload.Description>PDF files only</FileUpload.Description>
        <FileUpload.Trigger>Choose documents</FileUpload.Trigger>
      </FileUpload.Dropzone>
      <FileUpload.List>
        {files.map((file) => (
          <FileUpload.Item key={`${file.name}-${file.size}`} file={file}>
            <FileUpload.Name />
            <FileUpload.Remove />
          </FileUpload.Item>
        ))}
      </FileUpload.List>
    </FileUpload>
  );
}

export const CustomContent: Story = {
  render: () => <CustomContentFileUpload />,
};

function ClearActionFileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <FileUpload multiple value={files} onFilesChange={setFiles}>
        <FileUpload.Trigger>Add files</FileUpload.Trigger>
        <FileUpload.List>
          {files.map((file) => (
            <FileUpload.Item key={`${file.name}-${file.size}`} file={file}>
              <FileUpload.Name />
              <FileUpload.Size />
              <FileUpload.Remove />
            </FileUpload.Item>
          ))}
        </FileUpload.List>
        <FileUpload.Clear />
      </FileUpload>
      <Button variant="ghost" onClick={() => setFiles([])}>
        Reset from outside
      </Button>
    </div>
  );
}

export const ClearAction: Story = {
  render: () => <ClearActionFileUpload />,
};
