import { cacheLife } from "next/cache";

export type Gig = {
  id: string;
  title: string;
  /** e.g. "17 OCT 2026" */
  date: string;
  venue: string | null;
  city: string | null;
  url: string;
};

export type RaArtist = {
  name: string;
  image: string | null;
  url: string;
  instagram: string | null;
  soundcloud: string | null;
  gigs: Gig[];
};

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// Profile links are typed in by artists: keep only clean https urls, minus tracking params.
function cleanLink(url: unknown) {
  if (typeof url !== "string" || !url.startsWith("https://")) return null;
  return url.split("?")[0];
}

// RA dates are local to the venue ("2026-10-17T00:00:00.000"), so format the string itself.
function formatDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d} ${MONTHS[Number(m) - 1]} ${y}`;
}

const QUERY = `query Artist($slug: String!) {
  artist(slug: $slug) {
    name
    image
    contentUrl
    instagram
    soundcloud
    events(limit: 12, type: LATEST) {
      id
      title
      date
      contentUrl
      venue { name area { name } }
    }
  }
}`;

type RaEvent = {
  id: string;
  title: string;
  date: string;
  contentUrl: string;
  venue: { name: string | null; area: { name: string | null } | null } | null;
};

/** Upcoming gigs for an artist, read from their Resident Advisor page. Refreshed hourly. */
export async function getRaArtist(slug: string): Promise<RaArtist | null> {
  "use cache";
  cacheLife("hours");

  try {
    const res = await fetch("https://ra.co/graphql", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        referer: `https://ra.co/dj/${slug}`,
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      },
      body: JSON.stringify({ query: QUERY, variables: { slug } }),
    });
    if (!res.ok) return null;
    const artist = (await res.json())?.data?.artist;
    if (!artist) return null;

    return {
      name: artist.name,
      image: artist.image ?? null,
      url: `https://ra.co${artist.contentUrl}`,
      instagram: cleanLink(artist.instagram),
      soundcloud: cleanLink(artist.soundcloud),
      gigs: (artist.events as RaEvent[]).map((e) => ({
        id: e.id,
        title: e.title,
        date: formatDate(e.date),
        venue: e.venue?.name ?? null,
        city: e.venue?.area?.name ?? null,
        url: `https://ra.co${e.contentUrl}`,
      })),
    };
  } catch {
    return null;
  }
}
