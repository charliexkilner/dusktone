export type Artist = {
  name: string;
  /** The last part of the artist's RA url — ra.co/dj/<raSlug> */
  raSlug: string;
  /** Optional press shot in /public/artists. Falls back to the RA profile image. */
  image?: string;
  bio?: string;
  links?: { label: string; href: string }[];
};

// The roster. Order here is the order on the page.
export const artists: Artist[] = [
  { name: "Alisdair", raSlug: "alisdair" },
];

export const artistAnchor = (a: Artist) => a.raSlug.toLowerCase();
