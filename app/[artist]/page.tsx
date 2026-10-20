import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { BookButton } from "@/components/Contact";
import { SiteHeader } from "@/components/SiteHeader";
import { type Artist, artists, artistSlug, findArtist } from "@/data/artists";
import { site } from "@/data/site";
import { getRaArtist, stillToCome } from "@/lib/ra";

export const viewport: Viewport = { themeColor: "#ffffff" };
// The artist is read from the URL before anything renders so an unknown name
// gets a real 404. Every artist page is prerendered, so the wait is one fetch.
export const instant = false;

export function generateStaticParams() {
  return artists.map((a) => ({ artist: artistSlug(a) }));
}

export async function generateMetadata({ params }: PageProps<"/[artist]">): Promise<Metadata> {
  const artist = findArtist((await params).artist);
  return artist ? { title: artist.name, description: `Book ${artist.name} through ${site.name}.` } : {};
}

export default async function ArtistPage({ params }: PageProps<"/[artist]">) {
  const artist = findArtist((await params).artist);
  if (!artist) notFound();

  const ra = artist.raSlug ? await getRaArtist(artist.raSlug) : null;
  const image = artist.image ?? ra?.image;
  const links = [
    artist.raSlug && { label: "Resident Advisor", href: ra?.url ?? `https://ra.co/dj/${artist.raSlug}` },
    ra?.soundcloud && { label: "SoundCloud", href: ra.soundcloud },
    ra?.instagram && { label: "Instagram", href: ra.instagram },
    ...(artist.links ?? []),
  ].filter((l) => !!l);

  return (
    <>
      <SiteHeader />
      <main className="page">
        <Link href="/roster" className="eyebrow back">
          ← Roster
        </Link>
        <article className="artist">
          <div className="artist-photo">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element -- remote RA images, not worth proxying
              <img src={image} alt={artist.name} referrerPolicy="no-referrer" />
            ) : (
              <div className="artist-blank" aria-hidden="true">⋆₊ ⊹</div>
            )}
          </div>

          <div>
            <h1>{artist.name}</h1>
            {artist.bio && <p className="artist-bio">{artist.bio}</p>}

            <h2>Upcoming gigs</h2>
            <Suspense fallback={<p className="gigs-empty">Loading dates…</p>}>
              <UpcomingGigs artist={artist} />
            </Suspense>

            <div className="link-row">
              <BookButton artist={artist.name} />
              {links.map((l) => (
                <a href={l.href} target="_blank" rel="noreferrer" key={l.href}>
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>
        </article>
      </main>
    </>
  );
}

// RA data is cached for an hour, but which dates have passed is worked out on
// every request, so a gig drops off the moment its day is over.
async function UpcomingGigs({ artist }: { artist: Artist }) {
  await connection();
  const ra = artist.raSlug ? await getRaArtist(artist.raSlug) : null;
  const gigs = ra ? stillToCome(ra.gigs) : [];

  if (!gigs.length) {
    return (
      <p className="gigs-empty">
        {!artist.raSlug
          ? "Dates to be announced."
          : ra
            ? "No dates announced right now."
            : "Dates are unavailable right now."}
      </p>
    );
  }

  return (
    <ul className="gigs">
      {gigs.map((gig) => (
        <li key={gig.id}>
          <a href={gig.url} target="_blank" rel="noreferrer">
            <span className="gig-title">{gig.title}</span>
            <time dateTime={gig.day}>{gig.date}</time>
            {(gig.venue || gig.city) && (
              <span className="gig-where">{[gig.venue, gig.city].filter(Boolean).join(" · ")}</span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
