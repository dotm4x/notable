import { SiteFooter } from '../source/components/footer';
import { HeroActions } from '../source/components/hero-actions';
import { SiteHeader } from '../source/components/header';
import './page.css';

export default function Page() {
  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <section className="site-hero" aria-labelledby="hero-heading">
          <h1 id="hero-heading">The Foundation for modern interfaces</h1>
          <p>
            Expressive, accessible components with thoughtful details and a
            cohesive design language.
          </p>
          <HeroActions />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
