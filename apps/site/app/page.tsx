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
          <h1 id="hero-heading">One design for the web.</h1>
          <p>
            A cohesive design language, expressive components, and carefully
            crafted icons. Everything works together.
          </p>
          <HeroActions />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
