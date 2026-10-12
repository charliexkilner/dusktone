import type { Metadata } from "next";
import { Background } from "@/components/Background";
import { SiteHeader } from "@/components/SiteHeader";
import { artists, artistAnchor } from "@/data/artists";
import { getRaArtist } from "@/lib/ra";

export const metadata: Metadata = { title: "Roster" };

export default async function RosterPage() {
  const roster = await Promise.all(
    artists.map(async (artist) => ({ artist, ra: await getRaArtist(artist.raSlug) }))
  );

  return (
    <>
      <Background />
      <SiteHeader />
      <main className="page">
        <p className="eyebrow">Roster</p>
        <ul className="roster-index">
          {artists.map((a) => (
            <li key={a.raSlug}>
              <a href={`#${artistAnchor(a)}`}>{a.name}</a>
            </li>
          ))}
        </ul>

        <div className="cards">
          {roster.map(({ artist, ra }) => {
            const image = artist.image ?? ra?.image;
            const raUrl = ra?.url ?? `https://ra.co/dj/${artist.raSlug}`;
            return (
              <article className="card" id={artistAnchor(artist)} key={artist.raSlug}>
                <div className="card-frame">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- remote RA images, not worth proxying
                    <img src={image} alt={artist.name} loading="lazy" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="card-blank" aria-hidden="true">⋆₊ ⊹</div>
                  )}
                </div>
                <h2>{artist.name}</h2>
                {artist.bio && <p className="card-bio">{artist.bio}</p>}

                <h3>Upcoming gigs</h3>
                {ra?.gigs.length ? (
                  <ul className="gigs">
                    {ra.gigs.map((gig) => (
                      <li key={gig.id}>
                        <a href={gig.url} target="_blank" rel="noreferrer">
                          <span className="gig-title">{gig.title}</span>
                          <time>{gig.date}</time>
                          {(gig.venue || gig.city) && (
                            <span className="gig-where">
                              {[gig.venue, gig.city].filter(Boolean).join(" · ")}
                            </span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="gigs-empty">
                    {ra ? "No dates announced right now." : "Dates are unavailable right now."}
                  </p>
                )}

                <p className="card-links">
                  <a href={raUrl} target="_blank" rel="noreferrer">Resident Advisor ↗</a>
                  {artist.links?.map((l) => (
                    <a href={l.href} target="_blank" rel="noreferrer" key={l.href}>
                      {l.label} ↗
                    </a>
                  ))}
                </p>
              </article>
            );
          })}
        </div>
      </main>
    </>
  );
}
