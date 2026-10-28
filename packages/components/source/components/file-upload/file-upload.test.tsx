import { type ComponentProps, useState } from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  FileUpload,
  type TFileUploadMode,
  type TFileUploadRejection,
} from './file-upload.js';
import { FileUpload as PublicFileUpload } from '../../index.js';

const MODES: TFileUploadMode[] = ['dropzone', 'compact', 'inline', 'media'];

function createFile(name: string, type = 'text/plain') {
  return new File(['content'], name, { type, lastModified: 1 });
}

function createDataTransfer(files: File[] = [], itemTypes?: string[]) {
  const types = itemTypes ?? files.map((file) => file.type);
  return {
    types: ['Files'],
    files,
    items: types.map((type) => ({ kind: 'file', type })),
  };
}

function getInput(container: HTMLElement) {
  const input = container.querySelector<HTMLInputElement>('input[type="file"]');
  if (!input) {
    throw new Error('Expected a file input');
  }
  return input;
}

function getRoot(container: HTMLElement) {
  const root = container.querySelector<HTMLElement>('.notable-file-upload');
  if (!root) {
    throw new Error('Expected a FileUpload root');
  }
  return root;
}

let createObjectURL: ReturnType<typeof vi.fn>;
let revokeObjectURL: ReturnType<typeof vi.fn>;

beforeEach(() => {
  let counter = 0;
  createObjectURL = vi.fn(() => `blob:preview-${(counter += 1)}`);
  revokeObjectURL = vi.fn();
  URL.createObjectURL =
    createObjectURL as unknown as typeof URL.createObjectURL;
  URL.revokeObjectURL =
    revokeObjectURL as unknown as typeof URL.revokeObjectURL;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('FileUpload', () => {
  it.each(MODES)(
    'renders the %s mode with its modifier class and data attribute',
    (mode) => {
      const { container } = render(<FileUpload mode={mode} />);

      const root = getRoot(container);
      expect(root).toHaveClass(`notable-file-upload--${mode}`);
      expect(root).toHaveAttribute('data-mode', mode);
    },
  );

  it('adds selected files in uncontrolled mode and reports them', async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    const { container } = render(
      <FileUpload multiple onFilesChange={onFilesChange}>
        <FileUpload.List />
      </FileUpload>,
    );
    const file = createFile('notes.txt');

    await user.upload(getInput(container), [file]);

    expect(onFilesChange).toHaveBeenCalledWith([file]);
  });

  it('renders each file with its name, size, and remove button by default', async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUploadWithList />);

    await user.upload(getInput(container), [createFile('report.txt')]);

    expect(await screen.findByText('report.txt')).toBeInTheDocument();
    expect(screen.getByText('7 B')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Remove report.txt' }),
    ).toBeEnabled();
  });

  it('keeps the selection controlled by the value prop', async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    const { container } = render(
      <FileUpload multiple value={[]} onFilesChange={onFilesChange}>
        <FileUpload.List />
      </FileUpload>,
    );

    await user.upload(getInput(container), [createFile('a.txt')]);

    expect(onFilesChange).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('a.txt')).not.toBeInTheDocument();
  });

  it('replaces the selection in single mode with the first valid file', async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUploadWithList />);
    await user.upload(getInput(container), [createFile('first.txt')]);

    await user.upload(getInput(container), [createFile('second.txt')]);

    expect(await screen.findByText('second.txt')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText('first.txt')).not.toBeInTheDocument(),
    );
  });

  it('rejects duplicates and reports them through onFilesRejected', async () => {
    const user = userEvent.setup();
    const onFilesRejected = vi.fn();
    const { container } = render(
      <FileUploadWithList multiple onFilesRejected={onFilesRejected} />,
    );
    const file = createFile('dup.txt');
    await user.upload(getInput(container), [file]);

    await user.upload(getInput(container), [createFile('dup.txt')]);

    expect(onFilesRejected).toHaveBeenCalledTimes(1);
    const [rejections] = onFilesRejected.mock.calls[0] as [
      TFileUploadRejection[],
    ];
    expect(rejections.map((rejection) => rejection.code)).toEqual([
      'duplicate-file',
    ]);
    expect(screen.getByRole('status')).toHaveTextContent(
      '1 file was rejected: dup.txt',
    );
  });

  it('lists rejected files visibly and announces them', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const { container } = render(
      <FileUploadWithList accept="image/*" multiple />,
    );

    await user.upload(getInput(container), [
      createFile('notes.txt', 'text/plain'),
    ]);

    expect(screen.getByRole('status')).toHaveTextContent('notes.txt');
    expect(
      screen.getByText('notes.txt', { selector: '.notable-file-upload__name' }),
    ).toBeInTheDocument();
  });

  it('opens the picker when the dropzone is clicked', () => {
    const { container } = render(
      <FileUpload>
        <FileUpload.Dropzone />
      </FileUpload>,
    );
    const click = vi.spyOn(getInput(container), 'click');

    fireEvent.click(screen.getByText('Drop files here'));

    expect(click).toHaveBeenCalledTimes(1);
  });

  it('opens the picker once when the trigger is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <FileUpload>
        <FileUpload.Trigger />
      </FileUpload>,
    );
    const click = vi.spyOn(getInput(container), 'click');

    await user.click(screen.getByRole('button', { name: 'Browse files' }));

    expect(click).toHaveBeenCalledTimes(1);
  });

  it.each(['dropzone', 'compact', 'media'] as TFileUploadMode[])(
    'accepts a dropped file in %s mode',
    (mode) => {
      const onFilesChange = vi.fn();
      const { container } = render(
        <FileUpload mode={mode} multiple onFilesChange={onFilesChange}>
          <FileUpload.Dropzone />
          <FileUpload.List />
        </FileUpload>,
      );
      const file = createFile('dropped.txt');

      fireEvent.dragEnter(getRoot(container), {
        dataTransfer: createDataTransfer([file]),
      });
      expect(getRoot(container)).toHaveAttribute('data-drag-active');
      fireEvent.drop(getRoot(container), {
        dataTransfer: createDataTransfer([file]),
      });

      expect(onFilesChange).toHaveBeenCalledWith([file]);
      expect(getRoot(container)).not.toHaveAttribute('data-drag-active');
    },
  );

  it('keeps the drag state active until nested drag targets are all left', () => {
    const { container } = render(<FileUpload />);
    const root = getRoot(container);
    const dataTransfer = createDataTransfer([createFile('a.png', 'image/png')]);

    fireEvent.dragEnter(root, { dataTransfer });
    fireEvent.dragEnter(root, { dataTransfer });
    fireEvent.dragLeave(root, { dataTransfer });

    expect(root).toHaveAttribute('data-drag-active');

    fireEvent.dragLeave(root, { dataTransfer });

    expect(root).not.toHaveAttribute('data-drag-active');
  });

  it('marks a drag as rejected when no dragged type matches accept', () => {
    const { container } = render(<FileUpload accept="image/*" />);
    const root = getRoot(container);

    fireEvent.dragEnter(root, {
      dataTransfer: createDataTransfer([], ['text/plain']),
    });

    expect(root).toHaveAttribute('data-drag-active');
    expect(root).toHaveAttribute('data-drag-rejected');
  });

  it('ignores dropped files when disabled', () => {
    const onFilesChange = vi.fn();
    const { container } = render(
      <FileUpload disabled onFilesChange={onFilesChange} />,
    );

    fireEvent.drop(getRoot(container), {
      dataTransfer: createDataTransfer([createFile('a.txt')]),
    });

    expect(onFilesChange).not.toHaveBeenCalled();
    expect(getInput(container)).toBeDisabled();
  });

  it('removes a file and clears the whole selection', async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUploadWithList multiple />);
    await user.upload(getInput(container), [
      createFile('a.txt'),
      createFile('b.txt'),
    ]);

    await user.click(
      await screen.findByRole('button', { name: 'Remove a.txt' }),
    );
    await waitFor(() =>
      expect(screen.queryByText('a.txt')).not.toBeInTheDocument(),
    );
    expect(screen.getByText('b.txt')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear all' }));
    await waitFor(() =>
      expect(screen.queryByText('b.txt')).not.toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: 'Clear all' })).toBeDisabled();
  });

  it('hides editing controls and ignores selection when read only', async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    const locked = createFile('locked.txt');
    const { container } = render(
      <FileUpload readOnly value={[locked]} onFilesChange={onFilesChange}>
        <FileUpload.List>
          <FileUpload.Item file={locked}>
            <FileUpload.Name />
            <FileUpload.Remove />
          </FileUpload.Item>
        </FileUpload.List>
      </FileUpload>,
    );

    expect(
      screen.getByRole('button', { name: 'Remove locked.txt' }),
    ).toBeDisabled();
    await user.upload(getInput(container), [createFile('new.txt')]);

    expect(onFilesChange).not.toHaveBeenCalled();
  });

  it('creates an object URL for image previews and revokes it on unmount', async () => {
    const user = userEvent.setup();
    const { container, unmount } = render(<FileUploadWithList multiple />);

    await user.upload(getInput(container), [
      createFile('photo.png', 'image/png'),
    ]);

    const image = await waitFor(() => {
      const element = container.querySelector<HTMLImageElement>('img');
      if (!element) {
        throw new Error('Expected a preview image');
      }
      return element;
    });
    expect(image).toHaveAttribute('src', 'blob:preview-1');
    expect(image).toHaveAttribute('alt', '');

    unmount();

    expect(revokeObjectURL).toHaveBeenCalledWith('blob:preview-1');
  });

  it('shows an add tile in media mode until the file limit is reached', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <FileUploadWithList mode="media" multiple maxFiles={1} />,
    );

    expect(
      screen.getByRole('button', { name: 'Add files' }),
    ).toBeInTheDocument();

    await user.upload(getInput(container), [createFile('one.txt')]);

    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Add files' }),
      ).not.toBeInTheDocument(),
    );
  });

  it('labels the inline trigger as an accessible attach button', () => {
    render(
      <FileUpload mode="inline">
        <FileUpload.Trigger />
      </FileUpload>,
    );

    expect(
      screen.getByRole('button', { name: 'Attach files' }),
    ).toBeInTheDocument();
  });

  it('exposes every compound member on the root at runtime', () => {
    expect(FileUpload.Dropzone).toBeTypeOf('function');
    expect(FileUpload.Icon).toBeTypeOf('function');
    expect(FileUpload.Title).toBeTypeOf('function');
    expect(FileUpload.Description).toBeTypeOf('function');
    expect(FileUpload.Helper).toBeTypeOf('function');
    expect(FileUpload.Trigger).toBeTypeOf('function');
    expect(FileUpload.List).toBeTypeOf('function');
    expect(FileUpload.Item).toBeTypeOf('function');
    expect(FileUpload.Preview).toBeTypeOf('function');
    expect(FileUpload.Name).toBeTypeOf('function');
    expect(FileUpload.Size).toBeTypeOf('function');
    expect(FileUpload.Remove).toBeTypeOf('function');
    expect(FileUpload.Clear).toBeTypeOf('function');
    expect(FileUpload.Rejections).toBeTypeOf('function');
  });

  it('is exported through the package entry point with its members', () => {
    expect(PublicFileUpload).toBe(FileUpload);
    expect(PublicFileUpload.Trigger).toBe(FileUpload.Trigger);
  });

  it('throws when a part is rendered outside the root', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<FileUpload.Trigger />)).toThrow(
      'FileUpload parts must be rendered inside FileUpload.Root.',
    );
  });

  it('describes the constraints inside the dropzone', () => {
    render(
      <FileUpload accept=".pdf" maxFiles={2} multiple>
        <FileUpload.Dropzone />
      </FileUpload>,
    );

    const dropzone = screen
      .getByText('Drop files here')
      .closest<HTMLElement>('.notable-file-upload__dropzone');
    expect(dropzone).not.toBeNull();
    expect(
      within(dropzone as HTMLElement).getByText(
        'Accepted: .pdf, up to 2 files',
      ),
    ).toBeVisible();
  });
});

function FileUploadWithList(props: Partial<ComponentProps<typeof FileUpload>>) {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileUpload value={files} onFilesChange={setFiles} {...props}>
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
  );
}
