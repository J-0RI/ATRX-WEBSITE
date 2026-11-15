/**
 * Country and first-level region options for the Request Access application.
 *
 * Source: `country-region-data` (MIT, maintained ISO 3166-1 / 3166-2 based dataset).
 * Country identifiers are ISO 3166-1 alpha-2 codes. Region identifiers are ISO 3166-2
 * style `CC-XX` codes where the dataset supplies a subdivision code, otherwise
 * `CC-<slug of the region name>`. Nothing here is inferred from the visitor's IP or device.
 */
import { allCountries } from "country-region-data";

export type Country = { code: string; name: string };
export type Region = { id: string; name: string };

/** Explicit, valid response for locations without meaningful first-level subdivisions. */
export const REGION_NOT_APPLICABLE = "not-applicable";
export const REGION_NOT_APPLICABLE_LABEL = "Not applicable";

/**
 * The dataset keeps a few formal inverted names ("Korea, Republic of"). Only the display
 * label changes; the ISO code remains the stored identifier.
 */
const displayNames: Record<string, string> = {
  BN: "Brunei",
  CD: "Democratic Republic of the Congo",
  CG: "Republic of the Congo",
  CI: "Côte d’Ivoire",
  CZ: "Czechia",
  FK: "Falkland Islands",
  FM: "Micronesia",
  GM: "Gambia",
  IR: "Iran",
  KP: "North Korea",
  KR: "South Korea",
  MK: "North Macedonia",
  RU: "Russia",
  SY: "Syria",
  TR: "Türkiye",
  TZ: "Tanzania",
  VA: "Vatican City",
  VE: "Venezuela",
  VG: "British Virgin Islands",
  VI: "U.S. Virgin Islands",
};

/**
 * USPS-style entries in the dataset that are not US states or territories: military mail
 * regions and the freely associated states, which are listed as countries in their own right.
 */
const excludedRegions: Record<string, ReadonlySet<string>> = {
  US: new Set(["AA", "AE", "AP", "FM", "MH", "PW"]),
};

const slug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const collator = new Intl.Collator("en", { sensitivity: "base" });

type Entry = { country: Country; regions: Region[] };

const entries = new Map<string, Entry>();
for (const [datasetName, code, rawRegions] of allCountries) {
  const name = displayNames[code] ?? datasetName;
  const excluded = excludedRegions[code];
  const regions = rawRegions
    .filter(([, short]) => !(short && excluded?.has(short)))
    .map(([regionName, short]) => ({ id: `${code}-${short || slug(regionName)}`, name: regionName }))
    .sort((a, b) => collator.compare(a.name, b.name));
  // A single entry restating the territory itself (Hong Kong, Gibraltar…) is not a subdivision.
  entries.set(code, { country: { code, name }, regions: regions.length > 1 ? regions : [] });
}

export const countries: Country[] = [...entries.values()]
  .map(({ country }) => country)
  .sort((a, b) => collator.compare(a.name, b.name));

export function findCountry(code: string | null | undefined): Country | undefined {
  return code ? entries.get(code)?.country : undefined;
}

/** First-level regions for a country; an empty list means "Not applicable" is the only answer. */
export function regionsFor(code: string | null | undefined): Region[] {
  return (code && entries.get(code)?.regions) || [];
}

export type Location = {
  country: Country;
  /** `REGION_NOT_APPLICABLE` when the country has no first-level subdivisions. */
  region: Region;
};

/** Resolves a submitted country/region pair against the dataset. Returns an error message when invalid. */
export function resolveLocation(countryCode: string, regionId: string):
  | { ok: true; location: Location }
  | { ok: false; field: "country" | "region"; message: string } {
  const country = findCountry(countryCode.trim());
  if (!country) return { ok: false, field: "country", message: "Select your country." };
  const regions = regionsFor(country.code);
  if (regions.length === 0) {
    return regionId === REGION_NOT_APPLICABLE
      ? { ok: true, location: { country, region: { id: REGION_NOT_APPLICABLE, name: REGION_NOT_APPLICABLE_LABEL } } }
      : { ok: false, field: "region", message: "Select a state, province or region." };
  }
  const region = regions.find((r) => r.id === regionId);
  return region
    ? { ok: true, location: { country, region } }
    : { ok: false, field: "region", message: "Select a state, province or region." };
}
