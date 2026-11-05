'use client';

import { Avatar, AvatarGroup } from '@dotm4x/one/components';

const members = ['MP', 'AL', 'SR'];

export default function Vertical() {
  return (
    <AvatarGroup orientation="vertical" spacing={12}>
      {members.map((initials) => (
        <Avatar key={initials}>
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}
