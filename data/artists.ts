export type Artist = {
  name: string;
  /** The last part of the artist's RA url — ra.co/dj/<raSlug>. Leave out until they have a page. */
  raSlug?: string;
  /** Optional press shot in /public/artists. Falls back to the RA profile image. */
  image?: string;
  bio?: string;
  links?: { label: string; href: string }[];
};

// The roster. Add artists in any order: the page lists them alphabetically.
// Each artist gets a page at /<name>, e.g. /toure or /sleepy-jean.
export const artists: Artist[] = [
  { name: "Neev", raSlug: "neev." }, // the full stop is part of her RA address
  { name: "Tia Radkiewicz" },
  { name: "Sleepy Jean", raSlug: "sleepyjean" },
  { name: "Holly Why", raSlug: "hollywhy" },
  { name: "Larushkin", raSlug: "larushkin" },
  { name: "Goose", raSlug: "goose-3" },
  { name: "Touré", raSlug: "toure" },
].sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));

/** The artist's page address: "Touré" → "toure", "Sleepy Jean" → "sleepy-jean" */
export const artistSlug = (a: Artist) =>
  a.name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const findArtist = (slug: string) => artists.find((a) => artistSlug(a) === slug);
