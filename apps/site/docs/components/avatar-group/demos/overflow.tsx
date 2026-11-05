'use client';

import { Avatar, AvatarGroup } from '@dotm4x/one/components';

const members = ['MP', 'AL', 'SR', 'TC', 'JR'];

export default function Overflow() {
  return (
    <AvatarGroup max={3}>
      {members.map((initials) => (
        <Avatar key={initials}>
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}
