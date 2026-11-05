'use client';

import { Avatar, AvatarGroup } from '@dotm4x/one/components';

export default function Default() {
  return (
    <AvatarGroup>
      <Avatar>
        <Avatar.Image src="https://i.pravatar.cc/120?img=12" alt="Max Perez" />
        <Avatar.Fallback>MP</Avatar.Fallback>
      </Avatar>
      <Avatar>
        <Avatar.Image src="https://i.pravatar.cc/120?img=32" alt="Alex Lee" />
        <Avatar.Fallback>AL</Avatar.Fallback>
      </Avatar>
      <Avatar>
        <Avatar.Image src="https://i.pravatar.cc/120?img=47" alt="Sam Rivera" />
        <Avatar.Fallback>SR</Avatar.Fallback>
      </Avatar>
      <Avatar>
        <Avatar.Fallback>TC</Avatar.Fallback>
      </Avatar>
    </AvatarGroup>
  );
}
