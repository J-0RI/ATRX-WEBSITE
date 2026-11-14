export type SearchEntry = { text: string; href: string };

export type SearchDocument = {
  href: string;
  title: string;
  category: string;
  /** The page's published meta description: a fallback excerpt, weighted below body copy. */
  summary?: string;
  headings: SearchEntry[];
  passages: SearchEntry[];
};

export type SearchResult = {
  href: string;
  title: string;
  category: string;
  excerpt: string;
  /** Extra context for the expanded result: 2–3 indexed sentences that the excerpt does not already say. May be empty. */
  detail: string;
  /** Action label naming what the destination is ("View guide", "View disclosure"…). */
  action: string;
  score: number;
};

/*
 * What each route is, expressed as the label of the action that opens it. Derived from the
 * pages themselves (a walkthrough is a guide, /risk is a disclosure), not from the filter
 * areas, which group pages by topic. Most specific prefix wins; unknown routes are pages.
 */
const DESTINATIONS: [prefix: string, label: string][] = [
  ["/access/", "View access mode"],
  ["/access", "View access tiers"],
  ["/explore", "View comparison"],
  ["/quickstart", "View guide"],
  ["/capabilities/", "View capability"],
  ["/control/", "View capability"],
  ["/delivery/", "View capability"],
  ["/documentation", "View documentation"],
  ["/instruments", "View instruments"],
  ["/philosophy", "View paper"],
  ["/architecture", "View architecture"],
  ["/use-cases", "View use cases"],
  ["/partnerships", "View tenancy model"],
  ["/performance", "View metrics"],
  ["/contact", "Request access"],
  ["/risk", "View disclosure"],
];

export function destinationLabel(href: string) {
  const path = href.split(/[?#]/)[0] || "/";
  if (path === "/") return "View overview";
  return DESTINATIONS.find(([prefix]) => prefix.endsWith("/") ? path.startsWith(prefix) : path === prefix || path.startsWith(`${prefix}/`))?.[1] ?? "View page";
}

const DETAIL_MIN_WORDS = 40;
const DETAIL_MAX_WORDS = 65;

/** Share of `a`'s words that also appear in `b` — catches restatements, not just exact repeats. */
function overlap(a: string, b: Set<string>) {
  const list = normalizeSearch(a).split(" ").filter((word) => word.length > 2);
  return list.length ? list.filter((word) => b.has(word)).length / list.length : 1;
}

/** Openings that lean on a previous passage ("That is…", "It does not…") and read wrongly alone. */
const DANGLING = /^(It|Its|They|Their|These|Those|That|This is|This was)\b/;

/**
 * Two or three sentences from the page's own indexed copy: the destination section first, then
 * the published description, then the page body in order. Each pick is the opening of one
 * passage, so sentences keep the context they were written in (a "Regime tag." label stays
 * with its definition). Table rows, fragments, dangling openings and anything the excerpt or an
 * earlier pick already says are skipped. Nothing is written here; an empty string is valid.
 */
function detail(document: SearchDocument, href: string, shown: string) {
  const section = href.includes("#") ? document.passages.filter((item) => item.href === href) : [];
  const sources = [...section.map((item) => item.text), document.summary ?? "", ...document.passages.map((item) => item.text)];

  const split = (text: string) => text.split(/(?<=[.!?])\s+(?=[A-Z“"\d])/).map((sentence) => sentence.trim());
  // Cards are sometimes indexed twice, once as "Label. Text" and once run together as
  // "Label Text"; both count as label-led.
  const labelled = new Set(document.passages.filter((item) => words(split(item.text)[0]) < 5).map((item) => normalizeSearch(item.text)));

  const seen = new Set(normalizeSearch(shown).split(" "));
  const picked: string[] = [];
  let count = 0;
  let total = 0;
  for (const text of sources) {
    if (total >= 3 || count >= DETAIL_MIN_WORDS) break;
    if (!text || text.includes(" · ") || DANGLING.test(text) || labelled.has(normalizeSearch(text))) continue;
    const sentences = split(text);
    // A passage led by a label ("Decision logs.", "01.") is a definition item whose next
    // sentence leans on that label; it does not read as prose on its own.
    if (words(sentences[0]) < 5) continue;
    // The longest complete opening of this passage that still fits the budget.
    const opening: string[] = [];
    for (const sentence of sentences) {
      if (!/[.!?]["”]?$/.test(sentence) || words(sentence) < 5 || total + opening.length === 3) break;
      if (count + words([...opening, sentence].join(" ")) > DETAIL_MAX_WORDS) break;
      opening.push(sentence);
      if (count + words(opening.join(" ")) >= DETAIL_MIN_WORDS) break;
    }
    const value = opening.join(" ");
    if (words(value) < 10 || overlap(value, seen) > 0.5) continue;
    picked.push(value);
    count += words(value);
    total += opening.length;
    for (const word of normalizeSearch(value).split(" ")) seen.add(word);
  }
  return picked.join(" ");
}

/** Case-, accent- and punctuation-insensitive form used for matching (`P&L` → `pl`). */
export function normalizeSearch(value: string) {
  return value.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/(?<=\b\p{L})&(?=\p{L}\b)/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");
}

/** Every term counts, including single characters; longest first so highlighting prefers whole terms. */
export function searchTerms(query: string) {
  return [...new Set(normalizeSearch(query).split(" ").filter(Boolean))].sort((a, b) => b.length - a.length);
}

/** Padded normal form: `" " + term` then means "a word starts with term". */
function pad(text: string) {
  return ` ${normalizeSearch(text)} `;
}

/** 2 = a word starts with the term, 1 = the term occurs inside a word, 0 = absent. */
function level(field: string, term: string) {
  return field.includes(` ${term}`) ? 2 : field.includes(term) ? 1 : 0;
}

function passageStrength(field: string, terms: string[], phrase: string) {
  let strength = level(field, phrase) * 3;
  for (const term of terms) strength += level(field, term);
  return strength;
}

const EXCERPT_LENGTH = 260;

/** A window of the passage around its first strong match, cut on word boundaries. */
function excerpt(text: string, terms: string[], phrase: string) {
  if (text.length <= EXCERPT_LENGTH) return text;
  const lower = text.toLowerCase();
  const wordStart = (needle: string) => {
    const match = new RegExp(`(^|[^\\p{L}\\p{N}])${escape(needle)}`, "iu").exec(lower);
    return match ? match.index + match[1].length : -1;
  };
  const candidates = [wordStart(phrase), ...terms.map(wordStart), ...terms.map((term) => lower.indexOf(term))];
  const position = candidates.find((value) => value >= 0) ?? 0;
  let begin = Math.max(0, position - 70);
  if (begin > 0) begin = text.indexOf(" ", begin) + 1 || begin;
  let finish = Math.min(text.length, begin + EXCERPT_LENGTH);
  if (finish < text.length) finish = Math.max(begin + 160, text.lastIndexOf(" ", finish));
  return `${begin > 0 ? "…" : ""}${text.slice(begin, finish).trim()}${finish < text.length ? "…" : ""}`;
}

function words(text: string) {
  return text.split(" ").length;
}

function escape(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Ranks indexed pages for a query. A page qualifies when every term occurs somewhere in it
 * (title, headings, body passages or summary), as a case-insensitive substring — so single
 * characters match broadly. Ranking: exact title, title prefix/phrase, title words, headings,
 * then body passages, with mid-word occurrences weighted lowest. One result per page; it links
 * to the section that best matches when the match is not in the page title.
 */
export function searchPages(query: string, documents: SearchDocument[]): SearchResult[] {
  const terms = searchTerms(query);
  if (!terms.length) return [];
  const phrase = normalizeSearch(query);

  return documents.flatMap((document) => {
    const title = pad(document.title);
    const summary = pad(document.summary ?? "");
    const headings = document.headings.map((item) => ({ ...item, field: pad(item.text) }));
    const passages = document.passages.map((item) => ({ ...item, field: pad(item.text) }));
    const everything = [title, summary, ...headings.map((item) => item.field), ...passages.map((item) => item.field)].join(" ");
    if (!terms.every((term) => everything.includes(term))) return [];

    let score = 0;
    const plainTitle = normalizeSearch(document.title);
    if (plainTitle === phrase) score += 300;
    else if (plainTitle.startsWith(phrase)) score += 120;
    else score += [0, 30, 80][level(title, phrase)];
    for (const term of terms) score += [0, 5, 25][level(title, term)];

    score += Math.max(0, ...headings.map((item) => [0, 12, 40][level(item.field, phrase)]));
    for (const term of terms) score += [0, 2, 8][Math.max(0, ...headings.map((item) => level(item.field, term)))];

    const count = (test: (field: string) => boolean) => Math.min(6, passages.filter((item) => test(item.field)).length);
    score += count((field) => level(field, phrase) === 2) * 6;
    for (const term of terms) {
      score += count((field) => level(field, term) === 2) * 2;
      score += count((field) => level(field, term) === 1) * 0.5;
    }
    score += [0, 2, 10][level(summary, phrase)];

    // Destination: the page itself for title matches, otherwise the best-matching section.
    // Very short queries match almost everywhere; only a specific query earns a section link.
    let href = document.href;
    const specific = phrase.length >= 3;
    if (specific && level(title, phrase) < 2) {
      const heading = headings.find((item) => level(item.field, phrase) === 2) ?? headings.find((item) => level(item.field, phrase) === 1);
      href = heading?.href ?? href;
    }

    // Excerpt: the body passage that best demonstrates the match; never the title itself.
    // A full sentence that contains the match explains a result better than a short label.
    const ranked = passages.map((item, order) => {
      const strength = passageStrength(item.field, terms, phrase);
      return { item, order, strength: strength > 0 ? strength + (words(item.text) >= 10 ? 4 : 0) : 0 };
    })
      .filter((entry) => entry.strength > 0)
      // Ties favour substantive sentences over short labels, then the destination section.
      .sort((a, b) => b.strength - a.strength || Number(words(b.item.text) >= 10) - Number(words(a.item.text) >= 10)
        || Number(b.item.href === href) - Number(a.item.href === href) || a.order - b.order);
    const best = ranked[0]?.item;
    if (specific && href === document.href && best && best.href !== document.href && level(title, phrase) < 2 && passageStrength(best.field, terms, phrase) >= 3) {
      href = best.href;
    }
    const source = best?.text ?? document.summary ?? document.passages[0]?.text ?? "";

    const shown = excerpt(source, terms, phrase);
    return [{ href, title: document.title, category: document.category, excerpt: shown, detail: detail(document, href, source), action: destinationLabel(document.href), score }];
  }).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}

/**
 * Splits text into plain and matching segments for safe rendering (no HTML is produced).
 * Matching is case-insensitive; the original capitalisation is preserved.
 */
export function highlightSegments(text: string, query: string): { text: string; match: boolean }[] {
  const terms = searchTerms(query);
  if (!terms.length || !text) return [{ text, match: false }];
  // `P&L` is matched as typed as well as by its normalized form.
  const acronyms = [...query.matchAll(/(\p{L})&(\p{L})/gu)].map((match) => `${escape(match[1])}\\s*&\\s*${escape(match[2])}`);
  const pattern = new RegExp(`(${[...acronyms, ...terms.map(escape)].join("|")})`, "giu");
  // With one capture group, split alternates plain (even) and matched (odd) segments.
  return text.split(pattern).map((part, index) => ({ text: part, match: index % 2 === 1 })).filter((part) => part.text !== "");
}
