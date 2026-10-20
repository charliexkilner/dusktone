# Dusktone

An independent booking agency + mixcast rooted in the underground.

Next.js (App Router), deployed on Vercel.

```bash
npm install
npm run dev
```

Keep this folder out of iCloud Drive (a synced Desktop or Documents folder): macOS evicts project files to the cloud when disk space is low, which breaks the dev server. A folder name ending in `.nosync` is skipped by iCloud.

## Editing the site

| What | Where |
| --- | --- |
| Roster | `data/artists.ts` — add `{ name, raSlug }`. `raSlug` is the end of the artist's RA url (`ra.co/dj/<raSlug>`); leave it out until they have a page. Each artist gets their own page, named after them (`/toure`, `/sleepy-jean`). Photo, Instagram and SoundCloud links come from RA. Optional `image` (a file in `public/artists/`), `bio` and extra `links`. |
| Description, contact address, SoundCloud account, the "Book <artist>" enquiry template | `data/site.ts` |
| Background footage | `youtubeId` in `data/site.ts` plays a muted YouTube video behind the home page. To use your own file instead, drop `loop.mp4` (and optionally `loop.webm`, `poster.jpg`) into `public/video/` — a file wins over the embed. Opacity, white glow and film grain are the three `--video-opacity` / `--glow` / `--grain` values at the top of the background block in `app/globals.css`. |

Upcoming gigs are read from each artist's Resident Advisor page and the mix-cast is read from the DuskTone SoundCloud feed. Both refresh hourly, so new dates and new mixes appear without a redeploy, and a gig drops off an artist's page as soon as its day is over.

## Contact form

The pop-up posts to `/api/contact`, which sends mail through [Resend](https://resend.com). Set these in Vercel → Project → Settings → Environment Variables (see `.env.example`):

- `RESEND_API_KEY`
- `CONTACT_TO` — where enquiries land (defaults to `contactEmail` in `data/site.ts`)
- `CONTACT_FROM` — optional, a sender on a domain verified with Resend

Without a key the form falls back to opening the visitor's mail app addressed to `contactEmail`.
