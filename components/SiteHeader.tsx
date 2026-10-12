import Link from "next/link";
import { ContactButton } from "@/components/Contact";

export function SiteNav() {
  return (
    <nav className="nav" aria-label="Main">
      <Link href="/roster">roster</Link>
      <span aria-hidden="true">⋆</span>
      <Link href="/mixcast">mix-cast</Link>
      <span aria-hidden="true">⋆</span>
      <ContactButton />
    </nav>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="wordmark">
        <span aria-hidden="true">⋆₊ ⊹</span> dusktone
      </Link>
      <SiteNav />
    </header>
  );
}
