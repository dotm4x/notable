'use client';

import { Empty } from '@dotm4x/one/components';
import { SearchX } from '@dotm4x/one/icons';

export default function Variants() {
  return (
    <div style={{ display: 'grid', gap: '16px', width: '100%' }}>
      <Empty variant="outline" size="compact">
        <Empty.Header>
          <Empty.Title>No saved filters</Empty.Title>
          <Empty.Description>
            Filters you save will be listed here.
          </Empty.Description>
        </Empty.Header>
      </Empty>
      <Empty variant="surface" size="spacious">
        <Empty.Header>
          <Empty.Media variant="icon">
            <SearchX aria-hidden="true" />
          </Empty.Media>
          <Empty.Title>No results found</Empty.Title>
          <Empty.Description>
            Try a different search term or clear the filters.
          </Empty.Description>
        </Empty.Header>
      </Empty>
    </div>
  );
}
