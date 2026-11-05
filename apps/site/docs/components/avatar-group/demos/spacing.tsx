'use client';

import { Avatar, AvatarGroup } from '@dotm4x/one/components';

const members = ['MP', 'AL', 'SR'];

export default function Spacing() {
  return (
    <AvatarGroup spacing={16} size="large">
      {members.map((initials) => (
        <Avatar key={initials}>
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}
