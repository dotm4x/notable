'use client';

import { Button, Tooltip } from '@dotm4x/one/components';

const placements = ['top', 'right', 'bottom', 'left'] as const;

export default function Placement() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {placements.map((placement) => (
        <Tooltip
          key={placement}
          placement={placement}
          content={`Tooltip on the ${placement}`}
        >
          <Button variant="outline">{placement}</Button>
        </Tooltip>
      ))}
    </div>
  );
}
