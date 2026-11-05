'use client';

import { CodeBlock, Disclosure } from '@dotm4x/one/components';

const markup = `<svg viewBox="0 0 24 24" aria-hidden="true">
  <path d="M5 12h14" />
</svg>`;

export default function WithCode() {
  return (
    <Disclosure title="SVG markup">
      <CodeBlock>
        <CodeBlock.Content>{markup}</CodeBlock.Content>
      </CodeBlock>
    </Disclosure>
  );
}
