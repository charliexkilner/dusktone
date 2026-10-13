export const site = {
  name: "Dusktone",
  description:
    "An independent booking agency + mixcast rooted in the underground.",
  // Address the contact form delivers to (and the mailto fallback opens).
  contactEmail: "dusktoneartists@gmail.com",
  soundcloud: "https://soundcloud.com/dusktone-524369108",
  soundcloudUserId: "1613426343",
  // Looping background footage. A file dropped into /public/video wins over the YouTube embed.
  video: {
    youtubeId: "29XymHesxa0",
    mp4: "/video/loop.mp4",
    webm: "/video/loop.webm",
    poster: "/video/poster.jpg",
  },
};

/** What the "Book <artist>" buttons drop into the contact pop-up. */
export const bookingEnquiry = (artist: string) => ({
  subject: `${artist} Booking Enquiry`,
  message: `Hiya I would like to make an enquiry to book ${artist} for an upcoming party please see info below:

Date:
Location:
Venue:
Promoter:
Additional Information:

Thanks!`,
});
