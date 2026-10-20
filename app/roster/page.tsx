import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { artists, artistSlug } from "@/data/artists";

export const metadata: Metadata = { title: "Roster" };
export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RosterPage() {
  return (
    <>
      <SiteHeader />
      <main className="page">
        <p className="eyebrow">Roster</p>
        <ul className="roster-index">
          {artists.map((a) => (
            <li key={a.name}>
              <Link href={`/${artistSlug(a)}`}>{a.name}</Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
