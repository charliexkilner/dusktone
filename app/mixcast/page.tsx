import type { Metadata } from "next";
import { Background } from "@/components/Background";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/data/site";
import { embedUrl, getMixes } from "@/lib/soundcloud";

export const metadata: Metadata = { title: "Mix-cast" };

export default async function MixcastPage() {
  const mixes = await getMixes();

  return (
    <>
      <Background />
      <SiteHeader />
      <main className="page page-narrow">
        <p className="eyebrow">Mix-cast</p>
        <div className="mixes">
          {mixes.map((mix) => (
            <article className="mix" key={mix.url}>
              <h2>{mix.title}</h2>
              {mix.date && <time>{mix.date}</time>}
              {mix.description && <p>{mix.description}</p>}
              <iframe
                title={mix.title}
                src={embedUrl(mix.url)}
                height={166}
                loading="lazy"
                allow="autoplay"
              />
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
