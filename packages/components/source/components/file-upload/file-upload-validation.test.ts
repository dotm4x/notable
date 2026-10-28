import { describe, expect, it } from 'vitest';
import {
  describeFileConstraints,
  formatFileSize,
  getStableFileKey,
  matchesAccept,
  mightAcceptDraggedType,
  resolveFileSelection,
} from './file-upload-validation.js';

function createFile(
  name: string,
  options: { type?: string; size?: number; lastModified?: number } = {},
) {
  const { type = '', size = 10, lastModified = 1 } = options;
  const file = new File(['x'], name, { type, lastModified });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

describe('matchesAccept', () => {
  it('accepts every file when no accept string is given', () => {
    expect(matchesAccept(createFile('notes.txt'), undefined)).toBe(true);
  });

  it('matches extension tokens case-insensitively', () => {
    expect(matchesAccept(createFile('Photo.PNG'), '.png, .jpg')).toBe(true);
    expect(matchesAccept(createFile('notes.txt'), '.png, .jpg')).toBe(false);
  });

  it('matches wildcard MIME tokens', () => {
    expect(
      matchesAccept(createFile('a.bin', { type: 'image/gif' }), 'image/*'),
    ).toBe(true);
    expect(
      matchesAccept(createFile('a.txt', { type: 'text/plain' }), 'image/*'),
    ).toBe(false);
  });

  it('matches exact MIME tokens', () => {
    expect(
      matchesAccept(
        createFile('a.pdf', { type: 'application/pdf' }),
        'application/pdf',
      ),
    ).toBe(true);
    expect(
      matchesAccept(createFile('a.pdf', { type: '' }), 'application/pdf'),
    ).toBe(false);
  });
});

describe('mightAcceptDraggedType', () => {
  it('treats an unknown dragged type as possibly accepted', () => {
    expect(mightAcceptDraggedType('', 'image/*')).toBe(true);
  });

  it('treats extension tokens as possibly accepted during a drag', () => {
    expect(mightAcceptDraggedType('application/zip', '.png')).toBe(true);
  });

  it('rejects a dragged MIME type that no token matches', () => {
    expect(mightAcceptDraggedType('text/plain', 'image/*')).toBe(false);
    expect(mightAcceptDraggedType('image/png', 'image/*')).toBe(true);
  });
});

describe('getStableFileKey', () => {
  it('identifies a file by name, size, and modification time', () => {
    const file = createFile('a.txt', { size: 4, lastModified: 9 });

    expect(getStableFileKey(file)).toBe('a.txt::4::9');
  });
});

describe('resolveFileSelection', () => {
  it('appends valid files in multiple mode', () => {
    const current = [createFile('a.txt')];
    const incoming = [createFile('b.txt')];

    const result = resolveFileSelection(current, incoming, { multiple: true });

    expect(result.files.map((file) => file.name)).toEqual(['a.txt', 'b.txt']);
    expect(result.rejections).toEqual([]);
  });

  it('rejects duplicates against the current selection and within the batch', () => {
    const existing = createFile('a.txt');
    const duplicate = createFile('a.txt');
    const incoming = [duplicate, createFile('b.txt'), createFile('b.txt')];

    const result = resolveFileSelection([existing], incoming, {
      multiple: true,
    });

    expect(result.files.map((file) => file.name)).toEqual(['a.txt', 'b.txt']);
    expect(result.rejections.map((rejection) => rejection.code)).toEqual([
      'duplicate-file',
      'duplicate-file',
    ]);
  });

  it('rejects files that do not match accept', () => {
    const result = resolveFileSelection([], [createFile('a.txt')], {
      accept: '.png',
      multiple: true,
    });

    expect(result.files).toEqual([]);
    expect(result.rejections[0]?.code).toBe('invalid-type');
  });

  it('rejects files above the maximum size and below the minimum size', () => {
    const large = createFile('large.bin', { size: 200 });
    const small = createFile('small.bin', { size: 1 });

    const result = resolveFileSelection([], [large, small], {
      multiple: true,
      maxFileSize: 100,
      minFileSize: 5,
    });

    expect(result.files).toEqual([]);
    expect(result.rejections.map((rejection) => rejection.code)).toEqual([
      'file-too-large',
      'file-too-small',
    ]);
  });

  it('keeps only up to maxFiles and rejects the rest', () => {
    const incoming = [
      createFile('a.txt'),
      createFile('b.txt'),
      createFile('c.txt'),
    ];

    const result = resolveFileSelection([], incoming, {
      multiple: true,
      maxFiles: 2,
    });

    expect(result.files.map((file) => file.name)).toEqual(['a.txt', 'b.txt']);
    expect(result.rejections).toEqual([
      { file: incoming[2], code: 'too-many-files' },
    ]);
  });

  it('replaces the selection with the first valid file in single mode', () => {
    const current = [createFile('old.txt')];
    const incoming = [createFile('first.txt'), createFile('second.txt')];

    const result = resolveFileSelection(current, incoming, { multiple: false });

    expect(result.files.map((file) => file.name)).toEqual(['first.txt']);
    expect(result.rejections.map((rejection) => rejection.code)).toEqual([
      'too-many-files',
    ]);
  });

  it('keeps the current selection in single mode when no incoming file is valid', () => {
    const current = [createFile('old.png', { type: 'image/png' })];
    const incoming = [createFile('bad.txt', { type: 'text/plain' })];

    const result = resolveFileSelection(current, incoming, {
      accept: 'image/*',
      multiple: false,
    });

    expect(result.files).toEqual(current);
    expect(result.rejections[0]?.code).toBe('invalid-type');
  });
});

describe('formatFileSize', () => {
  it('formats bytes, kilobytes, and megabytes with binary units', () => {
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(10 * 1024 * 1024)).toBe('10 MB');
  });
});

describe('describeFileConstraints', () => {
  it('summarizes accept, size, and count constraints', () => {
    const summary = describeFileConstraints({
      accept: 'image/*',
      maxFileSize: 2 * 1024 * 1024,
      maxFiles: 3,
      multiple: true,
    });

    expect(summary).toBe(
      'Accepted: image/*, up to 2 MB per file, up to 3 files',
    );
  });

  it('omits constraints that are not set', () => {
    expect(describeFileConstraints({ multiple: false })).toBe('');
  });
});
