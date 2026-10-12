import { LOGO_ROWS } from "@/lib/logo-ascii";

const SPARKLE = /([⋆₊⊹])/;

// The sparkle glyphs come from a fallback font, so each one is pinned to a
// single character cell to keep the grid aligned.
export function AsciiLogo() {
  return (
    <pre className="ascii" aria-hidden="true">
      {LOGO_ROWS.map((row, y) => (
        <span className="ascii-row" key={y}>
          {row.split(SPARKLE).map((part, i) =>
            SPARKLE.test(part) ? (
              <span className="sp" key={i}>
                {part}
              </span>
            ) : (
              part
            )
          )}
          {"\n"}
        </span>
      ))}
    </pre>
  );
}
