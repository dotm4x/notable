import '@notable/components/styles.css';
import '../source/styles/site.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Notable',
  description: 'Design language and component system',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
							(() => {
								let theme = 'dark';
								try {
									const stored = localStorage.getItem('notable-theme');
									if (stored === 'light' || stored === 'dark') {
										theme = stored;
									} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
										theme = 'light';
									}
								} catch {
									theme = 'dark';
								}
								document.documentElement.dataset.theme = theme;
							})();
						`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
