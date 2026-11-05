'use client';

import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import {
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockRoot,
  CodeBlockTitle,
} from './parts/sections.js';
import type { TCodeBlockProps } from './types.js';
import './code-block.css';

export type {
  TCodeBlockActionsProps,
  TCodeBlockContentProps,
  TCodeBlockCopyButtonProps,
  TCodeBlockFooterProps,
  TCodeBlockHeaderProps,
  TCodeBlockLineProps,
  TCodeBlockLineVariant,
  TCodeBlockProps,
  TCodeBlockSize,
  TCodeBlockTitleProps,
  TCodeBlockVariant,
} from './types.js';

export interface CodeBlockComponent extends ForwardRefExoticComponent<
  TCodeBlockProps & RefAttributes<HTMLDivElement>
> {
  /** Renders a row above the content for a title and actions. */
  Header: typeof CodeBlockHeader;
  /** Renders a filename, language, or label. Truncates when needed. */
  Title: typeof CodeBlockTitle;
  /** Holds actions at the end of the header, or floats them when direct. */
  Actions: typeof CodeBlockActions;
  /** Copies the supplied value with a compact icon button. */
  CopyButton: typeof CodeBlockCopyButton;
  /** Renders the focusable, scrollable code surface. */
  Content: typeof CodeBlockContent;
  /** Renders one line with an optional diff or highlight meaning. */
  Line: typeof CodeBlockLine;
  /** Renders a slot below the content, such as a Show more action. */
  Footer: typeof CodeBlockFooter;
}

/**
 * Displays code, terminal output, and diffs with an optional header, line
 * numbers, copy action, and line states. Syntax highlighting is provided
 * separately by `@dotm4x/one/code-block/highlighter`.
 */
export const CodeBlock: CodeBlockComponent = Object.assign(CodeBlockRoot, {
  Actions: CodeBlockActions,
  Content: CodeBlockContent,
  CopyButton: CodeBlockCopyButton,
  Footer: CodeBlockFooter,
  Header: CodeBlockHeader,
  Line: CodeBlockLine,
  Title: CodeBlockTitle,
});
