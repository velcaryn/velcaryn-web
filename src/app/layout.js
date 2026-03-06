import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Velcaryn | Global Export & Import",
  description: "Velcaryn – Your trusted partner for seamless global trade, specializing in the export and import of high-quality goods across international borders.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
