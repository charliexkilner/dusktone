# Dusktone

An independent booking agency + mixcast rooted in the underground.

Next.js (App Router), deployed on Vercel.

```bash
npm install
npm run dev
```

## Editing the site

| What | Where |
| --- | --- |
| Roster | `data/artists.ts` — add `{ name, raSlug }`. `raSlug` is the end of the artist's RA url (`ra.co/dj/<raSlug>`). Optional `image` (a file in `public/artists/`), `bio` and `links`. |
| Description, contact address, SoundCloud account | `data/site.ts` |
| Background footage | Drop `loop.mp4` (and optionally `loop.webm`, `poster.jpg`) into `public/video/`. Until then the home page shows an animated dusk gradient. |
| ASCII logo | Replace `scripts/logo-source.png`, then `npm run logo`. |

Upcoming gigs are read from each artist's Resident Advisor page and the mix-cast is read from the DuskTone SoundCloud feed. Both refresh hourly, so new dates and new mixes appear without a redeploy.

## Contact form

The pop-up posts to `/api/contact`, which sends mail through [Resend](https://resend.com). Set these in Vercel → Project → Settings → Environment Variables (see `.env.example`):

- `RESEND_API_KEY`
- `CONTACT_TO` — where enquiries land (defaults to `contactEmail` in `data/site.ts`)
- `CONTACT_FROM` — optional, a sender on a domain verified with Resend

Without a key the form falls back to opening the visitor's mail app addressed to `contactEmail`.
