/**
 * Reviewed exceptions for business-email fields.
 *
 * Unfamiliar organizational domains are already accepted: only listed consumer and disposable
 * providers are refused. These lists cover the remaining case, a legitimate organization whose
 * mail is hosted on a consumer domain, after it has asked for review (CONTACT_EMAIL) and been
 * approved. Record who approved each entry and when. Exceptions never override the disposable
 * registry.
 */

/** Domains approved after review that would otherwise match the personal-provider registry. */
export const approvedBusinessDomains: readonly string[] = [
  // "example-fund.co.uk", // 2026-11-15, approved by <reviewer>, ticket <id>
];

/** Individual addresses approved after review (organizations without their own domain). */
export const approvedBusinessAddresses: readonly string[] = [
  // "operations.examplefund@gmail.com", // 2026-11-15, approved by <reviewer>, ticket <id>
];
