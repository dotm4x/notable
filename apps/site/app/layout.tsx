import '@dotm4x/one/styles.css';
import '../source/styles/index.css';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'One',
  description: 'Design language and component system',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
