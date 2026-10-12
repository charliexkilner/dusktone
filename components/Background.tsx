import { existsSync } from "node:fs";
import path from "node:path";
import { site } from "@/data/site";

const inPublic = (p: string) => existsSync(path.join(process.cwd(), "public", p));

/** Full-bleed looping footage. Falls back to an animated dusk gradient until a video is added. */
export function Background({ video = false }: { video?: boolean }) {
  const { mp4, webm, poster } = site.video;
  const hasVideo = video && (inPublic(mp4) || inPublic(webm));

  return (
    <div className={video ? "bg bg-dusk" : "bg"} aria-hidden="true">
      {hasVideo && (
        <video
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
      )}
      <div className="grain" />
    </div>
  );
}
