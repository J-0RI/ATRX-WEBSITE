/**
 * Email domain classification for application email fields. Framework-free and side-effect
 * free, so the client submission boundary and any server handler share the same rules.
 */
import { disposableEmailDomains } from "./disposable";
import { approvedBusinessAddresses, approvedBusinessDomains } from "./exceptions";
import { personalEmailDomains } from "./personal";

export type EmailDomainClass = "disposable" | "personal" | "organization";

const toSet = (domains: readonly string[]) => new Set(domains.map((domain) => normaliseDomain(domain)).filter(Boolean) as string[]);
let registry: { personal: Set<string>; disposable: Set<string>; approvedDomains: Set<string>; approvedAddresses: Set<string> } | undefined;
// Built on first use so importing the module costs nothing on pages that never validate email.
const sets = () => (registry ??= {
  personal: toSet(personalEmailDomains),
  disposable: toSet(disposableEmailDomains),
  approvedDomains: toSet(approvedBusinessDomains),
  approvedAddresses: new Set(approvedBusinessAddresses.map((address) => normaliseEmail(address)).filter(Boolean) as string[]),
});

/**
 * Case-insensitive ASCII form of a domain: trimmed, lower-cased, trailing root dot removed and
 * internationalised labels converted to punycode, so "GMAIL.COM." and "gmail.com" match and an
 * IDN cannot slip past an ASCII entry. Returns undefined when it is not a usable host name.
 */
export function normaliseDomain(value: string): string | undefined {
  const domain = value.trim().replace(/\.$/, "").normalize("NFC");
  if (!domain || /[\s/@?#:\\]/.test(domain)) return undefined;
  try {
    return new URL(`http://${domain}`).hostname || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Canonical address for comparison: the local part is kept exactly as typed (it may be
 * case-sensitive and is never rewritten, e.g. dots or "+tags" are preserved), the domain is
 * normalised. Returns undefined when there is no single "@" separating two non-empty parts.
 */
export function normaliseEmail(value: string): string | undefined {
  const email = value.trim();
  const at = email.lastIndexOf("@");
  if (at <= 0 || at === email.length - 1) return undefined;
  const domain = normaliseDomain(email.slice(at + 1));
  return domain ? `${email.slice(0, at)}@${domain}` : undefined;
}

/** The domain and each parent, on label boundaries: a.b.example.com → b.example.com → example.com. */
function* suffixes(domain: string) {
  const labels = domain.split(".");
  for (let i = 0; i < labels.length - 1; i++) yield labels.slice(i).join(".");
}

const listed = (domain: string, set: Set<string>) => {
  for (const suffix of suffixes(domain)) if (set.has(suffix)) return true;
  return false;
};

/** Classifies an address by its domain. Unknown domains are "organization": never blocked for being unfamiliar. */
export function classifyEmail(value: string): EmailDomainClass | undefined {
  const email = normaliseEmail(value);
  if (!email) return undefined;
  const domain = email.slice(email.lastIndexOf("@") + 1);
  const { personal, disposable, approvedDomains, approvedAddresses } = sets();
  if (listed(domain, disposable)) return "disposable";
  if (approvedAddresses.has(email) || approvedAddresses.has(email.toLowerCase()) || listed(domain, approvedDomains)) return "organization";
  if (listed(domain, personal)) return "personal";
  return "organization";
}
