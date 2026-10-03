"use client";

import { useEffect } from "react";

/**
 * Initial load always starts at the top unless the URL targets an anchor.
 * (history.scrollRestoration is set to "manual" inline in the layout, before paint.)
 * Client-side route changes are handled by Next's own scroll-to-top / hash logic.
 */
export default function ScrollManager() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const target = document.getElementById(decodeURIComponent(hash));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, []);

  return null;
}
