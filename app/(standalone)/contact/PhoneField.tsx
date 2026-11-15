"use client";

import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { changePhoneCountry, dialCodeList, editPhoneInput, findDialCode, formatPhoneInput, isCodeOnly, phoneExample, type PhoneInputState } from "@/lib/phone";
import styles from "./contact.module.css";

const CODE_ERROR = "Select an international calling code.";

/** The option list never changes; built once (on first render, not at import) rather than on every keystroke. */
let options: React.ReactElement[] | undefined;
const codeOptions = () =>
  (options ??= dialCodeList().map((d) => <option key={d.country} value={d.country}>{d.name} ({d.callingCode})</option>));

/**
 * One telephone control: a compact calling-code trigger and the number share a single border,
 * surface and radius. The trigger is a real <select> laid transparently over the "+N" label:
 * clicking, tapping or typing uses the platform's native picker. The calling code never follows
 * the residence country.
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
  const [state, setState] = useState<PhoneInputState>(() => editPhoneInput({ phoneCountry: initialCountry, phone: "", explicit: false }, initialNumber).state);
  const country = state.phoneCountry;
  const number = useMemo(() => formatPhoneInput(country, state.phone), [country, state.phone]);
  const [composition, setComposition] = useState<string | null>(null);
  const composing = useRef(false);
  const selectionWasRange = useRef(false);
  const publish = (next: PhoneInputState) => {
    setState(next);
    onChange({ phoneCountry: next.phoneCountry, phone: next.phone });
  };
  // Parent-driven restoration uses the same pipeline as input/change (including autofill).
  // Ordinary keystrokes only publish a snapshot; unchanged incoming props must not reset them.
  const incoming = useRef({ country: initialCountry, number: initialNumber });
  useLayoutEffect(() => {
    const changed = incoming.current.country !== initialCountry || incoming.current.number !== initialNumber;
    incoming.current = { country: initialCountry, number: initialNumber };
    if (!changed) return;
    if (state.phoneCountry === initialCountry && state.phone === initialNumber) return;
    const next = editPhoneInput({ phoneCountry: initialCountry, phone: "", explicit: false }, initialNumber).state;
    setState(next);
    onChange({ phoneCountry: next.phoneCountry, phone: next.phone });
  }, [initialCountry, initialNumber, onChange, state.phoneCountry, state.phone]);
  const input = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);

  const selected = findDialCode(country);
  const codeOnly = !selected && isCodeOnly(country);

  const labelId = `${id}-label`;
  const errorId = `${id}-error`;

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

  return (
    <div className={styles.field}>
      <span id={labelId}>Phone (including country code){required ? "" : " (optional)"}</span>
      <div className={styles.phoneControl} data-invalid={error ? "true" : undefined}>
        <span className={styles.dialTrigger}>
          <select name="phoneCountry" className={styles.dialSelect} value={country}
            aria-label={selected ? `International calling code, ${selected.name} ${selected.callingCode}`
              : codeOnly ? `International calling code ${country}, country not determined` : "International calling code"}
            aria-invalid={error === CODE_ERROR || undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => publish(changePhoneCountry(state, event.target.value))}>
            <option value="">Select calling code</option>
            {/* A detected shared code (e.g. +1) whose country is not yet known: selectable value, not a list entry. */}
            {codeOnly ? <option value={country} disabled hidden>{country}</option> : null}
            {codeOptions()}
          </select>
          <span aria-hidden="true" className={selected || codeOnly ? undefined : styles.dialPlaceholder}>
            {selected?.callingCode ?? (codeOnly ? country : "Code")}
          </span>
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
      {error ? <p id={errorId} className={styles.fieldError}>{error}</p> : null}
    </div>
  );
}
