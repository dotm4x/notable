import { Button } from '@notable/components';
import { Star } from 'lucide-react';

type LinkButtonProps = {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  external?: boolean;
  icon?: 'star';
};

export default function LinkButton({
  label,
  href,
  variant = 'primary',
  external = false,
  icon,
}: LinkButtonProps) {
  function navigate() {
    if (external) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }
    window.location.assign(href);
  }

  return (
    <Button variant={variant} onClick={navigate}>
      {icon === 'star' ? <Star aria-hidden="true" size={16} /> : null}
      {label}
    </Button>
  );
}
