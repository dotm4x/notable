'use client';

import { Button } from '@dotm4x/one/components';
import './hero-actions.css';

export function HeroActions() {
  return (
    <div className="site-hero-actions">
      <Button asChild size="large">
        <a href="/docs/installation">Get Started</a>
      </Button>
      <Button asChild variant="outline" size="large">
        <a href="/docs/components">Explore Components</a>
      </Button>
    </div>
  );
}
