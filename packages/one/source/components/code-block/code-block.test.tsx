import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CodeBlock as PublicCodeBlock } from '../../components/index.js';
import { CodeBlock } from './code-block.js';

const writeText = vi.fn();

function installClipboardMock() {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
}

beforeEach(() => {
  writeText.mockReset();
  writeText.mockResolvedValue(undefined);
});

describe('CodeBlock', () => {
  it('renders a header, title, and copy action', async () => {
    const user = userEvent.setup();
    installClipboardMock();
    render(
      <CodeBlock>
        <CodeBlock.Header>
          <CodeBlock.Title>app.tsx</CodeBlock.Title>
          <CodeBlock.Actions>
            <CodeBlock.CopyButton value="const value = 1;" />
          </CodeBlock.Actions>
        </CodeBlock.Header>
        <CodeBlock.Content>{'const value = 1;'}</CodeBlock.Content>
      </CodeBlock>,
    );

    expect(screen.getByText('app.tsx')).toHaveClass('one-code-block__title');
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Copy' }));
    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith('const value = 1;'),
    );
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Copied' }),
      ).toBeInTheDocument(),
    );
  });

  it('sets the content direction and focus behavior', () => {
    render(<CodeBlock.Content>{'const value = 1;'}</CodeBlock.Content>);

    const pre = screen.getByText('const value = 1;').closest('pre');
    expect(pre).toHaveAttribute('dir', 'ltr');
    expect(pre).toHaveAttribute('tabindex', '0');
  });

  it('numbers lines from the requested start', () => {
    render(
      <CodeBlock.Content lineNumbers startLine={10}>
        {'first\nsecond'}
      </CodeBlock.Content>,
    );

    expect(screen.getByText('10')).toHaveClass('one-code-block__line-number');
    expect(screen.getByText('11')).toHaveClass('one-code-block__line-number');
  });

  it('ignores a single trailing newline', () => {
    const { container } = render(
      <CodeBlock.Content lineNumbers>{'one\ntwo\n'}</CodeBlock.Content>,
    );

    expect(container.querySelectorAll('.one-code-block__line')).toHaveLength(2);
  });

  it('renders line variants and wrap', () => {
    const { container } = render(
      <CodeBlock.Content wrap>
        <CodeBlock.Line>unchanged</CodeBlock.Line>
        <CodeBlock.Line variant="added">added</CodeBlock.Line>
        <CodeBlock.Line variant="removed">removed</CodeBlock.Line>
        <CodeBlock.Line variant="highlighted">highlighted</CodeBlock.Line>
      </CodeBlock.Content>,
    );

    expect(container.querySelector('.one-code-block__code')).toHaveClass(
      'one-code-block__code--wrap',
    );
    expect(screen.getByText('added').parentElement).toHaveAttribute(
      'data-variant',
      'added',
    );
    expect(screen.getByText('removed').parentElement).toHaveAttribute(
      'data-variant',
      'removed',
    );
    expect(screen.getByText('highlighted').parentElement).toHaveAttribute(
      'data-variant',
      'highlighted',
    );
  });

  it('applies the tone and size modifiers', () => {
    const { container } = render(
      <CodeBlock size="sm" variant="destructive">
        <CodeBlock.Content>Error output</CodeBlock.Content>
      </CodeBlock>,
    );

    expect(container.firstChild).toHaveClass(
      'one-code-block--destructive',
      'one-code-block--sm',
    );
  });

  it('is exported from the package entry point', () => {
    expect(PublicCodeBlock).toBe(CodeBlock);
    expect(PublicCodeBlock.Header).toBe(CodeBlock.Header);
    expect(PublicCodeBlock.Content).toBe(CodeBlock.Content);
    expect(PublicCodeBlock.Line).toBe(CodeBlock.Line);
    expect(PublicCodeBlock.CopyButton).toBe(CodeBlock.CopyButton);
  });
});
