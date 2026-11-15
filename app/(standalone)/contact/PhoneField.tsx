"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { changePhoneCountry, dialCodes, editablePhone, editPhoneInput, findDialCode, formatPhoneInput, isCodeOnly, phoneExample, type PhoneInputState } from "@/lib/phone";
import styles from "./contact.module.css";

const CODE_ERROR = "Select an international calling code.";

const normalise = (value: string) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Matches the start of any word in a country name, or a calling code typed with or without "+". */
function matches(query: string) {
  const q = normalise(query);
  if (!q || q === "+") return dialCodes;
  const digits = q.replace(/^\+/, "");
  if (/^\d+$/.test(digits)) return dialCodes.filter((d) => d.callingCode.slice(1).startsWith(digits));
  return dialCodes.filter((d) => {
    const name = normalise(d.name);
    return name.startsWith(q) || name.split(/[\s-]+/).some((word) => word.startsWith(q));
  });
}

/** The option list never changes; built once rather than on every keystroke. */
const codeOptions = dialCodes.map((d) => <option key={d.country} value={d.country}>{d.name} ({d.callingCode})</option>);

/** A single printable character with no command modifier starts a search. Space is left to the picker. */
const startsSearch = (event: React.KeyboardEvent) =>
  event.key.length === 1 && event.key !== " " && !event.metaKey && !event.ctrlKey && !event.altKey;

/**
 * One telephone control: a compact calling-code trigger and the number share a single border,
 * surface and radius. The trigger is a real <select> laid transparently over the "+N" label:
 * clicking or tapping opens the platform's own picker. Typing a letter, digit or "+" while it
 * has focus opens a searchable list beneath the field instead of the native first-letter jump.
 * The calling code never follows the residence country.
 *
 * Entering a number that starts with "+" moves its calling code into the selector as soon as the
 * code is recognised, so "+234 803…" becomes +234 | "803…". Typing
 * without "+" never changes the selection. `hint` (the residence country) only suggests a
 * placeholder format while no calling code is selected; it is never used to validate or select.
 */
export default function PhoneField({ country: initialCountry, number: initialNumber, hint, required, error, onChange, onBlurNumber }: {
  country: string;
  number: string;
  hint?: string;
  required: boolean;
  error?: string;
  onChange: (value: { phoneCountry: string; phone: string }) => void;
  onBlurNumber: (value: { phoneCountry: string; phone: string }) => void;
}) {
  const id = useId();
  const [state, setState] = useState<PhoneInputState>(() => ({ phoneCountry: initialCountry, phone: editablePhone(initialNumber), explicit: false }));
  const country = state.phoneCountry;
  const number = useMemo(() => formatPhoneInput(country, state.phone), [country, state.phone]);
  const [composition, setComposition] = useState<string | null>(null);
  const composing = useRef(false);
  const selectionWasRange = useRef(false);
  const publish = (next: PhoneInputState) => {
    setState(next);
    onChange({ phoneCountry: next.phoneCountry, phone: next.phone });
  };
  const [query, setQuery] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const anchor = useRef<HTMLDivElement>(null);
  const select = useRef<HTMLSelectElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const caret = useRef<number | null>(null);

  const open = query !== null;
  const selected = findDialCode(country);
  const codeOnly = !selected && isCodeOnly(country);
  const results = useMemo(() => matches(query ?? ""), [query]);

  const labelId = `${id}-label`;
  const errorId = `${id}-error`;
  const searchHintId = `${id}-search-hint`;
  const listId = `${id}-list`;
  const optionId = (index: number) => `${id}-option-${index}`;

  const close = (focusSelect: boolean) => {
    setQuery(null);
    if (focusSelect) select.current?.focus();
  };
  const choose = (code: string) => {
    publish(changePhoneCountry(state, code));
    setQuery(null);
    input.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const field = search.current;
    if (field && document.activeElement !== field) {
      field.focus();
      field.setSelectionRange(field.value.length, field.value.length);
    }
    const onPointer = (event: PointerEvent) => {
      if (!anchor.current?.contains(event.target as Node)) setQuery(null);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  // After formatting, restore the caret by its editable digit position.
  // Runs on every commit (a ref check) because the remaining digits can equal the previous value.
  useLayoutEffect(() => {
    const field = input.current;
    if (caret.current === null || !field) return;
    if (document.activeElement === field) field.setSelectionRange(caret.current, caret.current);
    caret.current = null;
  });

  const applyInput = (field: HTMLInputElement, inputType = "") => {
    const next = editPhoneInput(state, field.value, field.selectionStart ?? field.value.length, inputType, selectionWasRange.current);
    caret.current = next.caret;
    publish(next.state);
  };
  const onNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (composing.current || (event.nativeEvent as InputEvent).isComposing) {
      setComposition(event.target.value);
      return;
    }
    applyInput(event.target, (event.nativeEvent as InputEvent).inputType ?? "");
  };

  useEffect(() => {
    if (open) list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open, results]);

  return (
    <div className={styles.field}>
      <span id={labelId}>Phone (including country code){required ? "" : " (optional)"}</span>
      <div className={styles.phoneAnchor} ref={anchor}>
        <div className={styles.phoneControl} data-invalid={error ? "true" : undefined}>
          <span className={styles.dialTrigger}>
            <select ref={select} name="phoneCountry" className={styles.dialSelect} value={country}
              aria-label={selected ? `International calling code, ${selected.name} ${selected.callingCode}`
                : codeOnly ? `International calling code ${country}, country not determined` : "International calling code"}
              aria-invalid={error === CODE_ERROR || undefined}
              aria-describedby={[searchHintId, error ? errorId : ""].filter(Boolean).join(" ")}
              onChange={(event) => publish(changePhoneCountry(state, event.target.value))}
              onKeyDown={(event) => {
                if (!startsSearch(event)) return;
                event.preventDefault();
                setActive(0);
                setQuery(event.key);
              }}>
              <option value="">Select calling code</option>
              {/* A detected shared code (e.g. +1) whose country is not yet known: selectable value, not a list entry. */}
              {codeOnly ? <option value={country} disabled hidden>{country}</option> : null}
              {codeOptions}
            </select>
            <span aria-hidden="true" className={selected || codeOnly ? undefined : styles.dialPlaceholder}>
              {selected?.callingCode ?? (codeOnly ? country : "Code")}
            </span>
            <span id={searchHintId} className={styles.visuallyHidden}>Type a country name or calling code to search.</span>
          </span>
          <input ref={input} name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={32}
            aria-labelledby={labelId} aria-required={required}
            aria-invalid={error ? error !== CODE_ERROR : undefined}
            aria-describedby={error ? errorId : undefined}
            placeholder={phoneExample(country) ?? (!country && hint ? phoneExample(hint) : undefined) ?? "Phone number"} value={composition ?? number}
            onChange={onNumberChange}
            onSelect={(event) => { selectionWasRange.current = event.currentTarget.selectionStart !== event.currentTarget.selectionEnd; }}
            onCompositionStart={() => { composing.current = true; setComposition(number); }}
            onCompositionEnd={(event) => {
              composing.current = false;
              setComposition(null);
              applyInput(event.currentTarget, "insertCompositionText");
            }}
            onBlur={() => {
              onBlurNumber({ phoneCountry: state.phoneCountry, phone: state.phone });
            }} />
        </div>

        {open ? (
          <div className={styles.dialPanel}>
            <input ref={search} type="text" className={styles.dialSearch} role="combobox" aria-expanded="true"
              aria-controls={listId} aria-autocomplete="list" aria-label="Search countries or calling codes"
              aria-activedescendant={results[active] ? optionId(active) : undefined}
              placeholder="Search country or code" autoComplete="off" spellCheck={false} value={query ?? ""}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActive((i) => Math.min(i + 1, results.length - 1));
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActive((i) => Math.max(i - 1, 0));
                } else if (event.key === "Enter") {
                  event.preventDefault();
                  if (results[active]) choose(results[active].country);
                } else if (event.key === "Escape") {
                  event.preventDefault();
                  close(true);
                } else if (event.key === "Tab") {
                  setQuery(null);
                }
              }} />
            <ul ref={list} id={listId} role="listbox" aria-label="International calling codes" className={styles.dialList}>
              {results.length === 0 ? <li className={styles.dialEmpty} role="presentation">No matching country</li> : null}
              {results.map((d, index) => (
                <li key={d.country} id={optionId(index)} data-index={index} role="option"
                  aria-selected={d.country === country} data-active={index === active || undefined}
                  className={styles.dialOption}
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => choose(d.country)}>
                  <span>{d.name}</span>
                  <span className={styles.dialCode}>{d.callingCode}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      {error ? <p id={errorId} className={styles.fieldError}>{error}</p> : null}
    </div>
  );
}
