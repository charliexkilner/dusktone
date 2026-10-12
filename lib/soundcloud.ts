import { cacheLife } from "next/cache";
import { site } from "@/data/site";
import { fallbackMixes } from "@/data/mixes";

export type Mix = {
  title: string;
  url: string;
  /** e.g. "06 Sep 2026" */
  date: string;
  description: string;
};

const decode = (s: string) =>
  s
    .replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, "&")
    .trim();

const tag = (item: string, name: string) =>
  decode(item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1] ?? "");

/** Every DuskTone mix, newest first, read from the SoundCloud feed. Refreshed hourly. */
export async function getMixes(): Promise<Mix[]> {
  "use cache";
  cacheLife("hours");

  try {
    const res = await fetch(
      `https://feeds.soundcloud.com/users/soundcloud:users:${site.soundcloudUserId}/sounds.rss`
    );
    if (!res.ok) return fallbackMixes;
    const items = (await res.text()).match(/<item>[\s\S]*?<\/item>/g) ?? [];
    const mixes = items
      .map((item) => ({
        title: tag(item, "title"),
        url: tag(item, "link"),
        date: tag(item, "pubDate").match(/\d{2} \w{3} \d{4}/)?.[0] ?? "",
        description: tag(item, "description"),
      }))
      .filter((m) => m.title && m.url);
    return mixes.length ? mixes : fallbackMixes;
  } catch {
    return fallbackMixes;
  }
}

export const embedUrl = (trackUrl: string) =>
  `https://w.soundcloud.com/player/?url=${encodeURIComponent(trackUrl)}` +
  "&color=%23c9a24a&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false";
