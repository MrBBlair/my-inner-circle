import { useEffect } from "react";

/** Full navigation to static HTML in public/pitchdeck/ (avoids SPA catch-all). */
export function PitchDeckRedirect() {
  useEffect(() => {
    window.location.replace("/pitchdeck/index.html");
  }, []);
  return null;
}
