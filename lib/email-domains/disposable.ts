/**
 * Disposable, temporary and throwaway mailbox services. Rejected on every application email
 * field (business or not): an address that expires cannot be used to follow up on a request.
 *
 * Kept separate from ./personal.ts so the two policies can change independently. Same format:
 * lower-case ASCII registrable domains; subdomains are covered automatically.
 */
export const disposableEmailDomains: readonly string[] = [
  // Mailinator network
  "mailinator.com", "mailinator.net", "mailinator2.com", "notmailinator.com", "reallymymail.com", "sogetthis.com",
  "spamherelots.com", "thisisnotmyrealemail.com", "binkmail.com", "bobmail.info", "suremail.info", "chammy.info",
  "tradermail.info", "veryrealemail.com", "safetymail.info", "zippymail.info", "mailinater.com", "streetwisemail.com",
  // Guerrilla Mail network
  "guerrillamail.com", "guerrillamail.net", "guerrillamail.org", "guerrillamail.biz", "guerrillamail.de", "guerrillamail.info",
  "guerrillamailblock.com", "sharklasers.com", "grr.la", "pokemail.net", "spam4.me",
  // Timed inboxes
  "10minutemail.com", "10minutemail.net", "10minutemail.co.uk", "10minemail.com", "20minutemail.com", "20minutemail.it",
  "minuteinbox.com", "10mail.org", "tempinbox.com", "temp-mail.org", "temp-mail.io", "tempmail.com", "tempmail.net",
  "tempmail.dev", "tempmailo.com", "tempail.com", "tempr.email", "tempemail.net", "tempmailaddress.com", "temporary-mail.net",
  "tmpmail.org", "tmpmail.net", "tmpbox.net", "tmpeml.com", "tmail.ws", "mytemp.email", "emltmp.com", "laste.ml",
  "1secmail.com", "1secmail.org", "1secmail.net", "esiix.com", "wwjmp.com", "xojxe.com", "yoggm.com",
  "dropmail.me", "spymail.one", "mohmal.com", "moakt.com", "moakt.cc", "tmails.net", "emailtemporanea.com",
  "emailtemporario.com.br", "mail-temporaire.fr", "linshiyouxiang.net", "bccto.me", "chacuo.net",
  // YOPmail network
  "yopmail.com", "yopmail.fr", "yopmail.net", "cool.fr.nf", "jetable.fr.nf", "nospam.ze.tc", "nomail.xl.cx",
  "mega.zik.dj", "speed.1s.fr", "courriel.fr.nf", "moncourrier.fr.nf", "monemail.fr.nf", "monmail.fr.nf",
  // Trash / throwaway services
  "trashmail.com", "trashmail.de", "trashmail.net", "trashmail.me", "trashmail.io", "trashmail.at", "trashmail.ws",
  "trash-mail.at", "trash-mail.com", "trashymail.com", "mytrashmail.com", "mailmetrash.com", "kurzepost.de",
  "objectmail.com", "proxymail.eu", "rcpt.at", "wegwerfmail.de", "wegwerfmail.net", "wegwerfmail.org",
  "throwawaymail.com", "throwam.com", "discard.email", "discardmail.com", "discardmail.de", "dispostable.com",
  "jetable.org", "spamgourmet.com", "spambox.us", "spamex.com", "spamfree24.org", "spamdecoy.net", "spamcero.com",
  "deadaddress.com", "mailnull.com", "mailexpire.com", "mailcatch.com", "mailforspam.com", "incognitomail.org",
  "dodgit.com", "dodgeit.com", "e4ward.com", "gishpuppy.com", "mt2015.com", "mvrht.com",
  // Public receive-only inboxes and generators
  "getnada.com", "nada.email", "maildrop.cc", "mailnesia.com", "mintemail.com", "emailondeck.com", "fakeinbox.com",
  "fakemail.net", "fakemailgenerator.com", "emailfake.com", "generator.email", "inboxkitten.com", "harakirimail.com",
  "mailpoof.com", "mailsac.com", "inboxbear.com", "getairmail.com", "burnermail.io", "33mail.com", "mailhazard.com",
  "crazymailing.com", "armyspy.com", "cuvox.de", "dayrep.com", "einrot.com", "fleckens.hu", "gustr.com",
  "jourrapide.com", "rhyta.com", "superrito.com", "teleworm.us",
];
