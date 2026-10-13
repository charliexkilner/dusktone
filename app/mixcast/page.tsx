import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/data/site";
import { embedUrl, getMixes } from "@/lib/soundcloud";

export const metadata: Metadata = { title: "Mix-cast" };
export const viewport: Viewport = { themeColor: "#ffffff" };

export default async function MixcastPage() {
  const mixes = await getMixes();

  return (
    <>
      <SiteHeader />
      <main className="page page-narrow">
        <p className="eyebrow">Mix-cast</p>
        <div className="mixes">
          {mixes.map((mix) => (
            <article className="mix" key={mix.url}>
              <h2>{mix.title}</h2>
              {mix.date && <time>{mix.date}</time>}
              {mix.description && <p>{mix.description}</p>}
              <div className="mix-player">
                <iframe
                  title={mix.title}
                  src={embedUrl(mix.url)}
                  height={166}
                  loading="lazy"
                  allow="autoplay"
                />
              </div>
            </article>
          ))}
        </div>
        <p className="card-links">
          <a href={site.soundcloud} target="_blank" rel="noreferrer">All mixes on SoundCloud ↗</a>
        </p>
      </main>
    </>
  );
}
