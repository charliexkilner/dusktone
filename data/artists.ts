export type Artist = {
  name: string;
  /** The last part of the artist's RA url — ra.co/dj/<raSlug>. Leave out until they have a page. */
  raSlug?: string;
  /** Optional press shot in /public/artists. Falls back to the RA profile image. */
  image?: string;
  bio?: string;
  links?: { label: string; href: string }[];
};

// The roster. Order here is the order on the page.
export const artists: Artist[] = [
  { name: "Neev", raSlug: "neev" },
  { name: "Tia Radkiewicz" },
  { name: "Sleepy Jean", raSlug: "sleepyjean" },
  { name: "Holly Why", raSlug: "hollywhy" },
  { name: "Larushkin", raSlug: "larushkin" },
  { name: "Goose", raSlug: "goose-3" },
  { name: "Touré", raSlug: "toure" },
];

/** "Touré" → "toure", "Sleepy Jean" → "sleepy-jean" */
export const artistAnchor = (a: Artist) =>
  a.name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
