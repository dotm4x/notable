'use client';

import { Badge } from '@dotm4x/one/components';
import { Check, Clock, TriangleAlert } from '@dotm4x/one/icons';

export default function WithIcon() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      <Badge variant="success">
        <Check aria-hidden="true" />
        Complete
      </Badge>
      <Badge variant="warning">
        <Clock aria-hidden="true" />
        Pending
      </Badge>
      <Badge variant="danger">
        <TriangleAlert aria-hidden="true" />
        Needs attention
      </Badge>
    </div>
  );
}
