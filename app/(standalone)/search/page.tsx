import type { Metadata } from "next";
import searchIndex from "@/content/search-index.generated.json";
import { searchPages, type SearchDocument, type SearchResult } from "@/lib/search";
import SearchResults from "./SearchResults";
import styles from "./search.module.css";

type Props = { searchParams: Promise<{ q?: string | string[]; area?: string | string[] }> };

const documents = searchIndex as SearchDocument[];
/** Filter areas in the site's own order (the index is generated in taxonomy order). */
const areas = [...new Set(documents.map((document) => document.category))];

function readQuery(value: string | string[] | undefined) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = readQuery((await searchParams).q);
  return { title: query ? `Results for ${query}` : "Search", robots: { index: false, follow: true } };
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = readQuery(params.q);
  const requested = ([] as string[]).concat(params.area ?? []);
  const selected = areas.filter((area) => requested.includes(area));

  let results: SearchResult[] = [];
  let failed = false;
  try {
    results = searchPages(query, documents);
  } catch {
    failed = true;
  }

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <h1 className={styles.heading}>
          {query ? (
            <>
              <span className={styles.prefix}>Results for</span> <span className={styles.query}>{query}</span>
            </>
          ) : (
            "Search ATRX"
          )}
        </h1>
      </header>
      <SearchResults key={`${query}|${selected.join(",")}`} query={query} results={results} areas={areas} initialSelected={selected} failed={failed} />
    </div>
  );
}
