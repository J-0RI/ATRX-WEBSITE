/**
 * International telephone handling for the Request Access application.
 *
 * Validation and E.164 normalisation use `libphonenumber-js` with full ("max") metadata,
 * so numbers are checked against each country's numbering plan, not a character count.
 * The dialling code is chosen independently of the applicant's country of residence.
 */
import { AsYouType, getCountries, getCountryCallingCode, getExampleNumber, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/max";
import examples from "libphonenumber-js/mobile/examples";
import { findCountry, nameCollator } from "./geography";

export type DialCode = { country: string; callingCode: string; name: string };
export type Phone = { e164: string; international: string; country: string };

let dialCodes: DialCode[] | undefined;
/**
 * One entry per dialling region (ISO code, "+N", name), alphabetical by name. Built on first call:
 * every page prefetches /contact, and the Intl objects this needs are expensive to construct.
 */
export function dialCodeList(): DialCode[] {
  if (dialCodes) return dialCodes;
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  return (dialCodes = getCountries()
    .map((country) => {
      const name = findCountry(country)?.name ?? regionNames.of(country) ?? country;
      const callingCode = `+${getCountryCallingCode(country)}`;
      return { country, callingCode, name };
    })
    .sort((a, b) => nameCollator().compare(a.name, b.name)));
}
export const findDialCode = (country: string) => dialCodeList().find((d) => d.country === country);

const dialCountries = new Set<string>(getCountries());
export const isDialCountry = (value: string): value is CountryCode => dialCountries.has(value);

/** Calling code digits → every dialling region that shares it (e.g. "44" → GB, GG, IM, JE). Built once. */
const regionsByCode = new Map<string, CountryCode[]>();
for (const country of getCountries()) {
  const code = getCountryCallingCode(country);
  regionsByCode.set(code, [...(regionsByCode.get(code) ?? []), country]);
}

/**
 * The selector holds either a region ("NG") or, when a shared code's region is not yet known,
 * the calling code alone ("+1"). A code-only value never stands in for a guessed country.
 */
export const isCodeOnly = (value: string) => /^\+\d{1,3}$/.test(value) && regionsByCode.has(value.slice(1));
export const callingCodeOf = (value: string): string | undefined =>
  isDialCountry(value) ? getCountryCallingCode(value) : isCodeOnly(value) ? value.slice(1) : undefined;

/** National digits after a calling code, as the selector-adjacent input shows them: "803 123 4567", no trunk prefix. */
const nationalDisplay = (number: { countryCallingCode: string; formatInternational: () => string }) => {
  const international = number.formatInternational();
  const prefix = `+${number.countryCallingCode} `;
  return international.startsWith(prefix) ? international.slice(prefix.length) : international;
};

/** Example for the number placeholder under a selected region, e.g. "506 234 5678" for Canada. */
export function phoneExample(dialCountry: string): string | undefined {
  if (!isDialCountry(dialCountry)) return undefined;
  const example = getExampleNumber(dialCountry, examples);
  return example ? nationalDisplay(example) : undefined;
}

/**
 * Splits an explicit international entry ("+234 803…") into its calling code and the remainder,
 * exactly as typed. Only the first 1–3 digits after "+" are examined: ITU calling codes are
 * prefix-free, so at most one length matches and this is a handful of map lookups, not a parse.
 */
export function splitInternational(value: string): { code: string; rest: string; removed: number } | undefined {
  const match = /^\s*\+(\d{1,3})/.exec(value);
  if (!match) return undefined;
  for (let length = 1; length <= match[1].length; length++) {
    const code = match[1].slice(0, length);
    if (!regionsByCode.has(code)) continue;
    const end = match[0].length - match[1].length + length;
    const removed = end + (/^[\s.\-/]*/.exec(value.slice(end))?.[0].length ?? 0);
    return { code, rest: value.slice(removed), removed };
  }
  return undefined;
}

/**
 * Selector value for a detected calling code. A code used by one region selects it. A shared code
 * selects a region only when the numbering plan identifies it from a complete number (`national`,
 * passed on paste or blur, never per keystroke); otherwise a current selection under the same code
 * is kept, and failing that the code is shown alone rather than assigning an arbitrary country.
 */
export function dialValueFor(code: string, current: string, national?: string): string {
  const regions = regionsByCode.get(code) ?? [];
  if (regions.length === 1) return regions[0];
  if (national) {
    const parsed = parsePhoneNumberFromString(national, { defaultCallingCode: code });
    if (parsed?.isValid() && parsed.country) return parsed.country;
  }
  return callingCodeOf(current) === code ? current : `+${code}`;
}

/**
 * Parses a number typed with an explicit "+" prefix, or against the selected dialling code.
 * Returns the normalised E.164 value, or a message describing what is missing.
 */
export function resolvePhone(dialCountry: string, value: string):
  | { ok: true; phone: Phone }
  | { ok: false; field: "phone" | "phoneCountry"; message: string } {
  const number = value.trim();
  if (!number) return { ok: false, field: "phone", message: "Phone number is required." };
  const international = number.startsWith("+");
  const callingCode = callingCodeOf(dialCountry);
  if (!international && !callingCode) {
    return { ok: false, field: "phoneCountry", message: "Select an international calling code." };
  }
  // Digits with the usual separators only; a single leading "+" for international entry.
  if (number.length > 32 || !/^\+?[\d\s().\-]+$/.test(number)) {
    return { ok: false, field: "phone", message: "Enter a valid phone number for the selected country." };
  }
  const parsed = international
    ? parsePhoneNumberFromString(number)
    : isDialCountry(dialCountry)
      ? parsePhoneNumberFromString(number, dialCountry)
      : parsePhoneNumberFromString(number, { defaultCallingCode: callingCode });
  if (!parsed?.isValid()) return { ok: false, field: "phone", message: "Enter a valid phone number for the selected country." };
  return {
    ok: true,
    phone: {
      e164: parsed.number,
      international: parsed.formatInternational(),
      country: parsed.country ?? (isDialCountry(dialCountry) ? dialCountry : ""),
    },
  };
}

/** Editable digits/prefix are authoritative; display and E.164 are separate derivations. */
export type PhoneInputState = { phoneCountry: string; phone: string; explicit: boolean };
export const editablePhone = (value: string) => /^[+\d\s().\-/]*$/.test(value)
  ? value.replace(/[\s().\-/]/g, "") : value;

export function formatPhoneInput(country: string, raw: string): string {
  if (!raw || !/^\+?\d*$/.test(raw) || raw.startsWith("+")) return raw;
  const code = callingCodeOf(country);
  if (!code) {
    // Readability only, not a numbering-plan guess. Keep the selector unresolved and
    // require a calling context at validation. A selected country replaces this grouping.
    return [raw.slice(0, 3), raw.slice(3, 6), raw.slice(6, 10), ...(raw.slice(10).match(/.{1,3}/g) ?? [])]
      .filter(Boolean).join(" ");
  }
  const national = new AsYouType(isDialCountry(country) ? country : { defaultCallingCode: code }).input(raw);
  // Some plans require a trunk prefix for national formatting. If the applicant omitted it,
  // use international grouping without manufacturing an extra editable digit.
  if (/[^\d]/.test(national)) return national;
  return new AsYouType().input(`+${code}${raw}`).replace(new RegExp(`^\\+${code} ?`), "");
}

export function changePhoneCountry(state: PhoneInputState, country: string): PhoneInputState {
  const split = splitInternational(state.phone);
  return { phoneCountry: country, phone: split ? editablePhone(split.rest) : state.phone, explicit: false };
}

/** Input-only transition: never validates and never writes geographic fields. */
export function editPhoneInput(state: PhoneInputState, value: string, position = value.length,
  inputType = "", selectionWasRange = false): { state: PhoneInputState; display: string; caret: number } {
  const before = formatPhoneInput(state.phoneCountry, state.phone);
  let raw = editablePhone(value);
  let digitsBefore = (value.slice(0, position).match(/[\d+]/g) ?? []).length;
  // Deleting only an inserted separator must make progress, including mobile InputEvents.
  if (!selectionWasRange && inputType.startsWith("delete") && value.length < before.length && raw === state.phone) {
    const index = inputType.includes("Backward") ? digitsBefore - 1 : digitsBefore;
    if (index >= 0 && index < raw.length) {
      raw = raw.slice(0, index) + raw.slice(index + 1);
      if (index < digitsBefore) digitsBefore--;
    }
  }
  let country = state.phoneCountry;
  let explicit = state.explicit;
  const split = splitInternational(raw);
  if (split) {
    country = dialValueFor(split.code, country);
    raw = split.rest;
    digitsBefore = Math.max(0, digitsBefore - split.code.length - 1);
    explicit = true;
  } else if (raw.startsWith("+")) {
    explicit = true;
  }
  const code = callingCodeOf(country);
  if ((explicit || isCodeOnly(country)) && code && raw && !raw.startsWith("+")) {
    const formatter = new AsYouType();
    formatter.input(`+${code}${raw}`);
    country = formatter.getCountry() ?? country;
  }
  if (!raw && !split) explicit = false;
  const display = formatPhoneInput(country, raw);
  let caret = 0;
  let count = 0;
  while (caret < display.length && count < digitsBefore) {
    if (/[\d+]/.test(display[caret])) count++;
    caret++;
  }
  // At the end, include newly inserted closing punctuation, e.g. "(506)|".
  if (position === value.length && !inputType.startsWith("delete")) caret = display.length;
  return { state: { phoneCountry: country, phone: raw, explicit }, display, caret };
}
