import type { Metadata, Viewport } from "next";
import { Space_Mono } from "next/font/google";
import { ContactProvider } from "@/components/Contact";
import { site } from "@/data/site";
import "./globals.css";

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: { default: site.name, template: `%s ⋆ ${site.name}` },
  description: site.description,
  openGraph: { title: site.name, description: site.description, type: "website" },
};

export const viewport: Viewport = { themeColor: "#0b0a08" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={mono.variable}>
      <body>
        <ContactProvider>{children}</ContactProvider>
      </body>
    </html>
  );
}
