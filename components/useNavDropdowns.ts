"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/** Hover-intent timing: quick enough to feel immediate, long enough to ignore fly-overs and slips. */
const OPEN_DELAY = 80;
const CLOSE_DELAY = 150;

type OpenReason = "hover" | "click" | "keyboard";
type OpenState = { id: string; reason: OpenReason } | null;

/** Only a real hovering pointer drives hover intent; touch never emulates it. */
const isHoverPointer = (e: React.PointerEvent) =>
  (e.pointerType === "mouse" || e.pointerType === "pen") &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * One controller for every global-nav dropdown: a single open id, shared
 * hover-intent timers and shared dismissal. Pointer, click, keyboard and route
 * changes all write to the same source of truth.
 */
export function useNavDropdowns() {
  const [state, setState] = useState<OpenState>(null);
  const stateRef = useRef<OpenState>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const commit = useCallback((next: OpenState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  const clearTimers = useCallback(() => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  }, []);

  const open = useCallback((id: string, reason: OpenReason) => {
    clearTimers();
    commit({ id, reason });
  }, [clearTimers, commit]);

  /** Closes `id` only if it is still the open menu, so a stale timer never closes another. */
  const close = useCallback((id?: string) => {
    clearTimers();
    if (!id || stateRef.current?.id === id) commit(null);
  }, [clearTimers, commit]);

  const pathname = usePathname();
  useEffect(() => close(), [pathname, close]);
  useEffect(() => clearTimers, [clearTimers]);

  const pointerEnter = useCallback((id: string, e: React.PointerEvent) => {
    if (!isHoverPointer(e)) return;
    clearTimers();
    const current = stateRef.current;
    if (current?.id === id) return;
    // Moving across from another open menu switches immediately.
    if (current) open(id, "hover");
    else openTimer.current = setTimeout(() => open(id, "hover"), OPEN_DELAY);
  }, [clearTimers, open]);

  const pointerLeave = useCallback((id: string, e: React.PointerEvent, region: HTMLElement | null) => {
    if (!isHoverPointer(e)) return;
    clearTimeout(openTimer.current);
    // A keyboard user working inside the panel keeps it open.
    if (region?.querySelector(":focus-visible")) return;
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => close(id), CLOSE_DELAY);
  }, [close]);

  /** Click/tap fallback. A click never dismisses a menu that hover has just opened. */
  const toggle = useCallback((id: string) => {
    const current = stateRef.current;
    if (current?.id === id && current.reason !== "hover") close(id);
    else open(id, "click");
  }, [close, open]);

  return { openId: state?.id ?? null, open, close, toggle, pointerEnter, pointerLeave };
}

export type NavDropdowns = ReturnType<typeof useNavDropdowns>;
