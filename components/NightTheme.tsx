"use client";

import { useEffect } from "react";

/**
 * Turns the document dark while the home page is on screen. This has to follow
 * the page's visibility rather than its presence in the DOM: after a client-side
 * navigation Next.js keeps the previous page mounted but hidden.
 */
export function NightTheme() {
  useEffect(() => {
    document.documentElement.classList.add("night");
    return () => document.documentElement.classList.remove("night");
  }, []);
  return null;
}
