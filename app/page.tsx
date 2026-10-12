import { AsciiLogo } from "@/components/AsciiLogo";
import { Background } from "@/components/Background";
import { SiteNav } from "@/components/SiteHeader";
import { site } from "@/data/site";

export default function Home() {
  return (
    <main className="home">
      <Background video />
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
