import { existsSync } from "node:fs";
import path from "node:path";
import { YouTubeLoop } from "@/components/YouTubeLoop";
import { site } from "@/data/site";

const inPublic = (p: string) => existsSync(path.join(process.cwd(), "public", p));

/**
 * Full-bleed looping footage with a faded-film treatment (see the "background"
 * block in globals.css). Shows an animated dusk gradient while the footage
 * loads, or if it can't play.
 */
export function Background({ video = false }: { video?: boolean }) {
  if (!video) {
    return (
      <div className="bg" aria-hidden="true">
        <div className="grain" />
      </div>
    );
  }

  const { youtubeId, mp4, webm, poster } = site.video;
  const hasFile = inPublic(mp4) || inPublic(webm);

  return (
    <div className="bg bg-dusk" aria-hidden="true">
      {hasFile ? (
        <video
          className="bg-media is-playing"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={inPublic(poster) ? poster : undefined}
        >
          {inPublic(webm) && <source src={webm} type="video/webm" />}
          {inPublic(mp4) && <source src={mp4} type="video/mp4" />}
        </video>
      ) : (
        youtubeId && <YouTubeLoop id={youtubeId} />
      )}
      <div className="bg-glow" />
      <div className="bg-vignette" />
      <div className="grain" />
    </div>
  );
}
