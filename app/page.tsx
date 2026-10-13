import { AsciiLogo } from "@/components/AsciiLogo";
import { Background } from "@/components/Background";
import { NightTheme } from "@/components/NightTheme";
import { SiteNav } from "@/components/SiteHeader";
import type { Viewport } from "next";
import { site } from "@/data/site";

export const viewport: Viewport = { themeColor: "#0b0a08" };

export default function Home() {
  return (
    <main className="home">
      <NightTheme />
      <Background />
      <AsciiLogo />
      <h1 className="home-word">
        <span aria-hidden="true">⋆₊ ⊹</span>
        <b>{site.name}</b>
        <span aria-hidden="true">⊹ ₊⋆</span>
      </h1>
      <SiteNav />
      <p className="home-desc">{site.description}</p>
    </main>
  );
}
