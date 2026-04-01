import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL('https://www.velcaryn.com'),
  title: {
    default: "Velcaryn | Global Export & Import Solutions",
    template: "%s | Velcaryn"
  },
  description: "Your trusted partner for seamless global trade, specializing in the export and import of high-quality medical supplies, construction materials, and commodities.",
  keywords: ["export", "import", "global trade", "medical supplies", "commodities", "construction materials", "B2B trading"],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Velcaryn | Global Export & Import Solutions',
    description: 'Your trusted partner for seamless global trade, specializing in the export and import of high-quality goods across international borders.',
    url: 'https://www.velcaryn.com',
    siteName: 'Velcaryn',
    images: [
      {
        url: '/assets/VELCARYN-SVG.svg',
        width: 1200,
        height: 630,
        alt: 'Velcaryn Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Velcaryn | Global Export & Import Solutions',
    description: 'Seamless B2B global trade and export solutions.',
    images: ['/assets/VELCARYN-SVG.svg'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
