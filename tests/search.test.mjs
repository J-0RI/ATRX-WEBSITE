import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { highlightSegments, normalizeSearch, searchPages } from "../lib/search.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const documents = JSON.parse(readFileSync(path.join(root, "content/search-index.generated.json"), "utf8"));
const text = (document) => [document.title, document.summary, ...document.headings.map((item) => item.text), ...document.passages.map((item) => item.text)].join(" ").toLowerCase();

test("the generated index covers each existing content route once", () => {
  assert.equal(documents.length, 22);
  assert.equal(new Set(documents.map((document) => document.href)).size, documents.length);
  assert.ok(documents.every((document) => document.title && document.category && document.passages.length));
});

test("content rendered by page components and data modules is indexed", () => {
  const home = documents.find((document) => document.href === "/");
  assert.match(text(home), /us-german 2y spread compressed 14 bps/);
  const access = documents.find((document) => document.href === "/access");
  assert.match(text(access), /monthly compute fee/);
  const institutional = documents.find((document) => document.href === "/access/institutional");
  assert.match(text(institutional), /dedicated inference cluster/);
});

test("categories follow the site taxonomy", () => {
  const byHref = Object.fromEntries(documents.map((document) => [document.href, document.category]));
  assert.equal(byHref["/capabilities/risk-control"], "Control & Delivery");
  assert.equal(byHref["/access/capital-desk"], "Access Modes");
  assert.equal(byHref["/architecture"], "Architecture");
});

test("single characters match as case-insensitive substrings of real content", () => {
  for (const query of ["g", "h", "G"]) {
    const results = searchPages(query, documents);
    const expected = documents.filter((document) => text(document).includes(query.toLowerCase())).length;
    assert.equal(results.length, expected, query);
    assert.ok(results.length > 0, query);
  }
  assert.ok(searchPages("h", documents).some((result) => result.title === "System Architecture"));
});

test("title matches rank above incidental mentions", () => {
  assert.equal(searchPages("causal attribution", documents)[0].href, "/capabilities/causal-attribution");
  assert.equal(searchPages("webhooks", documents)[0].href, "/delivery/zero-latency-webhooks");
  assert.equal(searchPages("architecture", documents)[0].href, "/architecture");
  assert.equal(searchPages("ATRX", documents)[0].href, "/");
  assert.ok(searchPages("risk", documents).slice(0, 2).every((result) => /risk/i.test(result.title)));
});

test("multiword, case and punctuation handling remain stable", () => {
  assert.equal(normalizeSearch("  MARKET-risk!  "), "market risk");
  assert.deepEqual(searchPages("  CAUSAL,   attribution! ", documents).map((result) => result.href),
    searchPages("causal attribution", documents).map((result) => result.href));
  assert.ok(searchPages("P&L", documents).some((result) => result.title === "Causal Attribution"));
  assert.deepEqual(searchPages("zzqxjv", documents), []);
  assert.deepEqual(searchPages("   ", documents), []);
});

test("excerpts come from body copy around the match, never the bare title", () => {
  for (const query of ["g", "risk", "portfolio management"]) {
    for (const result of searchPages(query, documents)) {
      assert.notEqual(result.excerpt, result.title);
      assert.ok(result.excerpt.length > 0);
    }
  }
  const [result] = searchPages("portfolio management", documents);
  assert.equal(result.href, "/architecture#footprint");
  assert.match(result.excerpt, /portfolio management/i);
});

test("highlighting preserves the source text and capitalisation", () => {
  const source = "Regime & State Analysis, GAP";
  const segments = highlightSegments(source, "g");
  assert.equal(segments.map((part) => part.text).join(""), source);
  assert.deepEqual(segments.filter((part) => part.match).map((part) => part.text), ["g", "G"]);
  const phrase = highlightSegments("Relate realized P&L to market risk", "market risk p&l");
  assert.deepEqual(phrase.filter((part) => part.match).map((part) => part.text), ["P&L", "market", "risk"]);
  assert.deepEqual(highlightSegments("a.b(c)", ".("), [{ text: "a.b(c)", match: false }]);
});
