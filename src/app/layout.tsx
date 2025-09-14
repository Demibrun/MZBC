import './globals.css';
import type { Metadata } from 'next';
import Providers from './Providers';

export const metadata: Metadata = {
  title: 'Mount Zion Bible Church Nigeria',
  description: 'Zion, where captives become captains.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
