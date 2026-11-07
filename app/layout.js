import { Lato } from 'next/font/google';
import './globals.css';

const font = Lato({ subsets: ['latin'], weight: ['300', '400', '700', '900'], variable: '--font' });

export const metadata = {
  title: 'jarymedia. Web design and branding studio',
  description: 'Creating. Building. Iterating. A web design and branding agency.',
  icons: { icon: '/logo.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.variable}>{children}</body>
    </html>
  );
}
