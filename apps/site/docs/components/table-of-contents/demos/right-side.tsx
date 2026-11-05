'use client';

import { TableOfContents } from '@dotm4x/one/components';

export default function RightSide() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 12rem',
        gap: 32,
        alignItems: 'start',
        width: '100%',
      }}
    >
      <article>
        <section id="toc-right-install" style={{ minHeight: 120 }}>
          <h2>Install</h2>
          <p>Add the package with your package manager of choice.</p>
        </section>
        <section id="toc-right-configure" style={{ minHeight: 120 }}>
          <h2>Configure</h2>
          <p>Import the stylesheet once at the root of your application.</p>
        </section>
      </article>
      <TableOfContents side="right" style={{ position: 'sticky', top: 16 }}>
        <TableOfContents.Header>On this page</TableOfContents.Header>
        <TableOfContents.List>
          <TableOfContents.Item href="#toc-right-install" label="Install" />
          <TableOfContents.Item href="#toc-right-configure" label="Configure" />
        </TableOfContents.List>
      </TableOfContents>
    </div>
  );
}
