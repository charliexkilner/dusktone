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
  {
    name: "Neev",
    raSlug: "neev.", // the full stop is part of her RA address
    bio: "London-based, with a sound rooted in house, electro and minimal techno, and a curiosity for the obscure.",
  },
  {
    name: "Tia Radkiewicz",
    bio: "Drawing from minimal, house and techno, her sets are deep, stripped-back and groove-led. Built around subtle movement, unexpected textures and a constant search for new sounds.",
  },
  {
    name: "Sleepy Jean",
    raSlug: "sleepyjean",
    bio: "An alchemist of sound, turning energy into electric groove.",
  },
  {
    name: "Holly Why",
    raSlug: "hollywhy",
    bio: "A sound that continues to unfold, shaped by the heart, taste and a love for the moment.",
  },
  {
    name: "Larushkin",
    raSlug: "larushkin",
    bio: "A DJ rooted in rhythm, weaving earthly layers and low-slung basslines.",
  },
  {
    name: "Goose",
    raSlug: "goose-3",
    bio: "Blending electro and house with an energy that feels grounded and raw. Her sets are curated for movement, nothing more, nothing less.",
  },
  {
    name: "Touré",
    raSlug: "toure",
    bio: "Manchester-based, creating journeys built on warped textures.",
  },
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
