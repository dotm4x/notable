'use client';

import { Link } from '@dotm4x/one/components';

export default function External() {
  return (
    <Link
      href="https://github.com/dotm4x/one"
      target="_blank"
      rel="noreferrer"
      arrow
    >
      Open the repository on GitHub
    </Link>
  );
}
