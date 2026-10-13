import type { Metadata } from "next";
import { Inter_Tight, Space_Mono } from "next/font/google";
import { ContactProvider } from "@/components/Contact";
import { site } from "@/data/site";
import "./globals.css";

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

// artist names
const display = Inter_Tight({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: { default: site.name, template: `%s ⋆ ${site.name}` },
  description: site.description,
  openGraph: { title: site.name, description: site.description, type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${mono.variable} ${display.variable}`}>
      <body>
        <ContactProvider>{children}</ContactProvider>
      </body>
    </html>
  );
}
