'use client';

import { TableOfContents } from '@dotm4x/one/components';

export default function Default() {
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
        <section id="toc-default-overview" style={{ minHeight: 120 }}>
          <h2>Overview</h2>
          <p>
            One describes shared principles that every implementation follows.
          </p>
        </section>
        <section id="toc-default-foundations" style={{ minHeight: 120 }}>
          <h2>Foundations</h2>
          <p>Color, type, spacing, and motion are defined once and reused.</p>
        </section>
        <section id="toc-default-patterns" style={{ minHeight: 120 }}>
          <h2>Patterns</h2>
          <p>Patterns combine foundations into recurring interface behavior.</p>
        </section>
      </article>
      <TableOfContents>
        <TableOfContents.Header>On this page</TableOfContents.Header>
        <TableOfContents.List>
          <TableOfContents.Item href="#toc-default-overview" label="Overview" />
          <TableOfContents.Item
            href="#toc-default-foundations"
            label="Foundations"
          />
          <TableOfContents.Item href="#toc-default-patterns" label="Patterns" />
        </TableOfContents.List>
      </TableOfContents>
    </div>
  );
}
