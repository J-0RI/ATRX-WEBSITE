import type { PlanId } from "@/content/tiers";

export type PlanImage = {
  src: string;
  /** Intrinsic size of the served file (used only for reference; cards render with `fill`). */
  width: number;
  height: number;
  alt: string;
  /** object-position for the card's portrait media field; tuned per composition. */
  position: string;
};

/**
 * Plan-card photography (decision-20261115-plan-photography). One photograph per plan, never
 * reused. Files are web-sized WebP copies of the originals in ATRX/BRAND ASSET/MODE PLANS/IMAGES,
 * keeping their source filenames (Unsplash / Pexels) for licence traceability.
 */
export const planImages: Record<PlanId, PlanImage> = {
  standard: {
    src: "/plans/adarsh-chauhan-ybZ9uOSGIcA-unsplash.webp",
    width: 1013,
    height: 1800,
    alt: "Black-and-white view looking up at the Statue of Liberty, torch raised beside the crowned head.",
    position: "50% 42%",
  },
  "api-access": {
    src: "/plans/pexels-bertellifotografia-31853362.webp",
    width: 1200,
    height: 1800,
    alt: "Close-up of a honeybee feeding on a white and lilac flower against a soft green background.",
    position: "50% 45%",
  },
  "execution-access": {
    src: "/plans/shubham-dhage-y-spk3B7IO0-unsplash.webp",
    width: 1350,
    height: 1800,
    alt: "Abstract render of layered amber discs curving into a bright orange highlight on a brown ground.",
    position: "58% 50%",
  },
  "single-desk": {
    src: "/plans/pexels-sami-aksu-48867324-12155604.webp",
    width: 1200,
    height: 1800,
    alt: "A leather armchair beneath a lit floor lamp in a quiet lounge, with bookshelves and framed portraits.",
    position: "50% 50%",
  },
  "multi-desk": {
    src: "/plans/anthony-tyrrell-Bl-LiSJOnlY-unsplash.webp",
    width: 1216,
    height: 1800,
    alt: "Black-and-white street scene outside an office building, a walker blurred in motion past standing figures.",
    position: "50% 60%",
  },
  "custom-routing": {
    src: "/plans/ryoji-iwata-X53e51WfjlE-unsplash.webp",
    width: 1202,
    height: 1800,
    alt: "Aerial view of pedestrians crossing a striped city crosswalk in bright sunlight.",
    position: "50% 50%",
  },
  "dedicated-deployment": {
    src: "/plans/alex-moliski-1WsT-wxnaMY-unsplash.webp",
    width: 1200,
    height: 1800,
    alt: "A climber silhouetted against blue sky, bracing between two red sandstone walls.",
    position: "50% 55%",
  },
  "multi-entity-deployment": {
    src: "/plans/douglas-schneiders-oJuN4mzp_pk-unsplash.webp",
    width: 1200,
    height: 1800,
    alt: "Stepped glass curtain-wall towers reflecting warm evening light and neighbouring buildings.",
    position: "50% 50%",
  },
};
