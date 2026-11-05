'use client';

import { TableOfContents } from '@dotm4x/one/components';

export default function Nested() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 14rem',
        gap: 32,
        alignItems: 'start',
        width: '100%',
      }}
    >
      <article>
        <section id="toc-nested-guides" style={{ minHeight: 120 }}>
          <h2>Guides</h2>
          <p>Task-focused walkthroughs for common product work.</p>
        </section>
        <section id="toc-nested-components" style={{ minHeight: 120 }}>
          <h2>Components</h2>
          <p>Every component documents its parts and their props.</p>
        </section>
        <section id="toc-nested-button" style={{ minHeight: 120 }}>
          <h3>Button</h3>
          <p>A button triggers an action and defaults to type button.</p>
        </section>
        <section id="toc-nested-dialog" style={{ minHeight: 120 }}>
          <h3>Dialog</h3>
          <p>A dialog interrupts the flow to request a decision.</p>
        </section>
      </article>
      <TableOfContents>
        <TableOfContents.Header>On this page</TableOfContents.Header>
        <TableOfContents.List>
          <TableOfContents.Item href="#toc-nested-guides" label="Guides" />
          <TableOfContents.Item
            href="#toc-nested-components"
            label="Components"
          >
            <TableOfContents.List>
              <TableOfContents.Item href="#toc-nested-button" label="Button" />
              <TableOfContents.Item href="#toc-nested-dialog" label="Dialog" />
            </TableOfContents.List>
          </TableOfContents.Item>
        </TableOfContents.List>
      </TableOfContents>
    </div>
  );
}
