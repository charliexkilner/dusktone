import type { Metadata, Viewport } from "next";
import { BookButton } from "@/components/Contact";
import { SiteHeader } from "@/components/SiteHeader";
import { artists, artistAnchor } from "@/data/artists";
import { getRaArtist } from "@/lib/ra";

export const metadata: Metadata = { title: "Roster" };
export const viewport: Viewport = { themeColor: "#ffffff" };

export default async function RosterPage() {
  const roster = await Promise.all(
    artists.map(async (artist) => ({
      artist,
      ra: artist.raSlug ? await getRaArtist(artist.raSlug) : null,
    }))
  );

  return (
    <>
      <SiteHeader />
      <main className="page">
        <p className="eyebrow">Roster</p>
        <ul className="roster-index">
          {artists.map((a) => (
            <li key={a.name}>
              <a href={`#${artistAnchor(a)}`}>
                {a.name}
                <span className="roster-icon" aria-hidden="true">
                  {a.icon ?? "⊹"}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="cards">
          {roster.map(({ artist, ra }) => {
            const image = artist.image ?? ra?.image;
            const links = [
              artist.raSlug && {
                label: "Resident Advisor",
                href: ra?.url ?? `https://ra.co/dj/${artist.raSlug}`,
              },
              ra?.soundcloud && { label: "SoundCloud", href: ra.soundcloud },
              ra?.instagram && { label: "Instagram", href: ra.instagram },
              ...(artist.links ?? []),
            ].filter((l) => !!l);
            return (
              <article className="card" id={artistAnchor(artist)} key={artist.name}>
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
                    {!artist.raSlug
                      ? "Dates to be announced."
                      : ra
                        ? "No dates announced right now."
                        : "Dates are unavailable right now."}
                  </p>
                )}

                <div className="card-links">
                  <BookButton artist={artist.name} />
                  {links.map((l) => (
                    <a href={l.href} target="_blank" rel="noreferrer" key={l.href}>
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </>
  );
}
