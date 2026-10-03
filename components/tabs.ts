/** Roving keyboard support for an ARIA tablist (Arrow keys, Home, End). */
export function onTabListKeyDown(
  e: React.KeyboardEvent<HTMLElement>,
  tabIds: string[],
  activeIndex: number,
  select: (index: number) => void,
) {
  let next = -1;
  if (e.key === "ArrowRight") next = (activeIndex + 1) % tabIds.length;
  else if (e.key === "ArrowLeft") next = (activeIndex - 1 + tabIds.length) % tabIds.length;
  else if (e.key === "Home") next = 0;
  else if (e.key === "End") next = tabIds.length - 1;
  if (next < 0) return;
  e.preventDefault();
  select(next);
  document.getElementById(tabIds[next])?.focus();
}
