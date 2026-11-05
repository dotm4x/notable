'use client';

import { Avatar } from '@dotm4x/one/components';

export default function WithImage() {
  return (
    <Avatar>
      <Avatar.Image src="https://i.pravatar.cc/120?img=12" alt="Max Perez" />
      <Avatar.Fallback>MP</Avatar.Fallback>
    </Avatar>
  );
}
