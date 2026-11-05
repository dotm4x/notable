'use client';

import { Avatar } from '@dotm4x/one/components';
import { UserRound } from '@dotm4x/one/icons';

export default function WithIcon() {
  return (
    <Avatar>
      <Avatar.Fallback>
        <UserRound aria-hidden="true" />
      </Avatar.Fallback>
    </Avatar>
  );
}
