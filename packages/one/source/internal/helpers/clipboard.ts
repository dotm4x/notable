/**
 * Copies text using the Clipboard API when available and falls back to a
 * temporary textarea for non-secure contexts.
 */
export async function copyToClipboard(value: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  if (typeof document === 'undefined') {
    throw new Error('Clipboard is not available in this environment.');
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.insetBlockStart = '0';
  textarea.style.insetInlineStart = '0';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const copied = document.execCommand('copy');

    if (!copied) {
      throw new Error('The browser rejected the copy command.');
    }
  } finally {
    textarea.remove();
  }
}
