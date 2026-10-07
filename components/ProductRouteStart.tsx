"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** A new product page opens at its beginning, independently of the persistent rail. */
export default function ProductRouteStart() {
  const pathname = usePathname();

  useEffect(() => {
    // Next can preserve a partial document offset when the in-flow mobile menu
    // closes. Run after its layout/scroll handling, without touching rail scroll.
    const frame = requestAnimationFrame(() => {
      if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
