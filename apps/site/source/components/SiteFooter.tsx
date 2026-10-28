import { Footer, Link } from '@notable/react';

export default function SiteFooter() {
  return (
    <Footer className="site-footer">
      <Footer.Content>
        <Footer.Brand>
          <strong>Notable</strong>
          <p>
            A design language for expressive, coherent, and accessible digital
            experiences.
          </p>
        </Footer.Brand>
        <Footer.Section>
          <Footer.Heading>Explore</Footer.Heading>
          <ul>
            <li>
              <Link href="#components">Components</Link>
            </li>
            <li>
              <Link href="#principles">Principles</Link>
            </li>
          </ul>
        </Footer.Section>
        <Footer.Section>
          <Footer.Heading>Project</Footer.Heading>
          <ul>
            <li>
              <Link
                href="https://github.com/dotm4x/notable"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
            </li>
            <li>
              <Link
                href="https://github.com/dotm4x/notable/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
              >
                License
              </Link>
            </li>
          </ul>
        </Footer.Section>
      </Footer.Content>
      <Footer.Bottom>
        <span>© {new Date().getFullYear()} dotm4x. MIT License.</span>
      </Footer.Bottom>
    </Footer>
  );
}
