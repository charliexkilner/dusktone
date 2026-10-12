"use client";

import { useEffect, useRef, useState } from "react";

const ORIGIN = "https://www.youtube-nocookie.com";
const PLAYING = 1;
const PAUSED = 2;

/**
 * A muted, chromeless YouTube embed used as background footage. It is only
 * visible while the player reports it is actually playing, so YouTube's
 * poster, spinner and pause overlay never show (e.g. when autoplay is blocked).
 */
export function YouTubeLoop({ id }: { id: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;

    const send = (msg: object) =>
      el.contentWindow?.postMessage(JSON.stringify({ ...msg, id: 1, channel: "widget" }), ORIGIN);
    const play = () => send({ event: "command", func: "playVideo", args: [] });

    // Ask the player to report its state; repeat until it has booted and answers.
    const subscribe = () => {
      send({ event: "listening" });
      send({ event: "command", func: "addEventListener", args: ["onStateChange"] });
    };
    const retry = setInterval(subscribe, 500);

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== ORIGIN || e.source !== el.contentWindow || typeof e.data !== "string") return;
      let info: unknown;
      try {
        info = JSON.parse(e.data).info;
      } catch {
        return;
      }
      clearInterval(retry);
      const state =
        typeof info === "number" ? info : (info as { playerState?: number } | null)?.playerState;
      if (state === undefined) return;
      setPlaying(state === PLAYING);
      // browsers pause background tabs; pick back up when we're on screen
      if (state === PAUSED && !document.hidden) play();
    };
    const onVisible = () => !document.hidden && play();

    window.addEventListener("message", onMessage);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(retry);
      window.removeEventListener("message", onMessage);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: id, // required for loop to work on a single video
    controls: "0",
    playsinline: "1",
    disablekb: "1",
    fs: "0",
    rel: "0",
    iv_load_policy: "3",
    enablejsapi: "1",
  });

  return (
    <iframe
      ref={frame}
      className={playing ? "bg-media is-playing" : "bg-media"}
      src={`${ORIGIN}/embed/${id}?${params}`}
      title="Background footage"
      allow="autoplay; encrypted-media"
      tabIndex={-1}
    />
  );
}
