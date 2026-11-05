'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { codeToTokens, type BundledLanguage } from 'shiki';

/** Themes shared by the optional code block highlighter. */
export const codeBlockThemes = {
  light: 'github-light',
  dark: 'github-dark',
} as const;

/**
 * Tokenizes code into one React node list per line. The returned spans carry
 * the Shiki CSS variables consumed by the code block styles.
 */
export async function highlightCode(
  code: string,
  language: string = 'tsx',
): Promise<ReactNode[]> {
  const source = code.replace(/\n$/, '');
  const { tokens } = await codeToTokens(source, {
    lang: language as BundledLanguage,
    themes: codeBlockThemes,
    defaultColor: false,
  });

  return tokens.map((line, lineIndex) =>
    line.map((token, tokenIndex) => (
      <span
        className="one-code-block__token"
        key={`${lineIndex}-${tokenIndex}`}
        style={token.htmlStyle as CSSProperties | undefined}
      >
        {token.content}
      </span>
    )),
  );
}

/**
 * Returns one highlighted React node list per line. It returns plain lines
 * until the first pass finishes and falls back to plain text on errors.
 */
export function useHighlightedCode(
  code: string,
  language: string = 'tsx',
): ReactNode[] {
  const [lines, setLines] = useState<ReactNode[] | null>(null);

  useEffect(() => {
    let active = true;
    setLines(null);

    highlightCode(code, language)
      .then((nextLines) => {
        if (active) {
          setLines(nextLines);
        }
      })
      .catch(() => {
        if (active) {
          setLines(code.replace(/\n$/, '').split('\n'));
        }
      });

    return () => {
      active = false;
    };
  }, [code, language]);

  return lines ?? code.replace(/\n$/, '').split('\n');
}
