import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail } from 'lucide-react';
import { Button } from '../button/button.js';
import { Link } from '../link/link.js';
import { Footer } from './footer.js';

const meta = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 320, display: 'flex', alignItems: 'end' }}>
        <div style={{ inlineSize: '100%' }}>
          <Story />
        </div>
      </div>
    ),
  ],
  render: () => (
    <Footer>
      <Footer.Content>
        <Footer.Brand>
          <strong>Acme Studio</strong>
          <p>Tools for designers who ship.</p>
        </Footer.Brand>
        <Footer.Section>
          <Footer.Heading>Product</Footer.Heading>
          <ul>
            <li>
              <Link href="#">Features</Link>
            </li>
            <li>
              <Link href="#">Pricing</Link>
            </li>
          </ul>
        </Footer.Section>
        <Footer.Section>
          <Footer.Heading>Company</Footer.Heading>
          <ul>
            <li>
              <Link href="#">About</Link>
            </li>
            <li>
              <Link href="#">Careers</Link>
            </li>
          </ul>
        </Footer.Section>
      </Footer.Content>
      <Footer.Bottom>
        <span>© 2025 Acme Studio</span>
        <nav aria-label="Legal">
          <ul
            style={{
              display: 'flex',
              gap: 16,
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            <li>
              <Link href="#">Privacy</Link>
            </li>
            <li>
              <Link href="#">Terms</Link>
            </li>
          </ul>
        </nav>
      </Footer.Bottom>
    </Footer>
  ),
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Footer>
      <Footer.Bottom>
        <span>© 2025 Acme Studio. All rights reserved.</span>
      </Footer.Bottom>
    </Footer>
  ),
};

export const Complete: Story = {};

export const SocialAndActions: Story = {
  render: () => (
    <Footer>
      <Footer.Content>
        <Footer.Brand>
          <strong>Acme Studio</strong>
          <p>Follow the team for release notes and design updates.</p>
        </Footer.Brand>
        <Footer.Section>
          <Footer.Heading>Newsletter</Footer.Heading>
          <p>Get a short note when something ships.</p>
          <Button size="small">Subscribe</Button>
        </Footer.Section>
        <Footer.Section>
          <Footer.Heading>Social</Footer.Heading>
          <ul>
            <li>
              <Link href="#">GitHub</Link>
            </li>
            <li>
              <Link href="#">LinkedIn</Link>
            </li>
            <li>
              <Link href="#" arrow>
                <Mail size={16} aria-hidden="true" focusable="false" />
                Email the team
              </Link>
            </li>
          </ul>
        </Footer.Section>
      </Footer.Content>
      <Footer.Bottom>
        <span>© 2025 Acme Studio</span>
      </Footer.Bottom>
    </Footer>
  ),
};

export const CustomComposition: Story = {
  render: () => (
    <Footer aria-label="Site footer">
      <Footer.Content>
        <Footer.Brand>
          <strong>Long names and descriptions wrap cleanly</strong>
          <p>
            https://example.com/a-very-long-path-that-would-otherwise overflow a
            narrow column without overflow-wrap handling in place.
          </p>
        </Footer.Brand>
        <Footer.Section>
          <Footer.Heading as="h3">Resources</Footer.Heading>
          <ul>
            <li>
              <Link href="#">
                Documentation for every component in the library
              </Link>
            </li>
            <li>
              <Link href="#">Accessibility guidance</Link>
            </li>
          </ul>
        </Footer.Section>
      </Footer.Content>
      <Footer.Bottom>
        <span>Built with Notable</span>
      </Footer.Bottom>
    </Footer>
  ),
};
