/* Minimal functional glyphs. 1.5px strokes on a 16px grid, currentColor only. */

type IconProps = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: "false" as const,
});

export function ChevronDown({ size = 14, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

export function ChevronRight({ size = 14, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}

export function ArrowUpRight({ size = 12, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 11l6-6M6 5h5v5" />
    </svg>
  );
}

export function CopyIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="5.5" y="5.5" width="8" height="8" rx="2" />
      <path d="M10.5 3.5v-.5a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" />
    </svg>
  );
}

export function CheckIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

/**
 * Knight — the ATRX capability marker (decision-20261114-knight-capability-marker).
 * A simplified monoline profile on the shared 16px grid: base rule, chest, muzzle, ear and
 * mane in one stroke, with a single eye point. Used only as a list marker, never as an
 * illustration or badge.
 */
export function KnightIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 13.5h8" />
      <path d="M5.25 13.5c0-2.6 1.6-3.4 2.5-4.6l-2 .7-1.4-1.4 3-4.2.6-1.6 1.2 1.1c2.3.9 3.3 3.5 2.7 10" />
      <circle cx="8" cy="6" r=".55" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SearchIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="7" cy="7" r="4.75" />
      <path d="M10.5 10.5l3 3" />
    </svg>
  );
}

export function MenuIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M2.5 5h11M2.5 11h11" />
    </svg>
  );
}

/** Horizontal "more" glyph: three round-capped points on the 16px grid. */
export function MoreIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2} className={className}>
      <path d="M3.5 8h.01M8 8h.01M12.5 8h.01" />
    </svg>
  );
}

export function CloseIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

export function InfoIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="8" cy="8" r="6" />
      <path d="M8 7.25v3.5M8 5.25h.01" />
    </svg>
  );
}
