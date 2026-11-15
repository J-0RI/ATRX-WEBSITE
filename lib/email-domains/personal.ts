/**
 * Consumer (personal) email providers. Blocked only for fields that ask for a business email.
 *
 * Maintenance: add registrable domains in lower case, ASCII (punycode for IDNs), without "@".
 * A listed domain also covers its subdomains (matching is on label boundaries, so "live.com"
 * never matches "olive.com"). Providers with many country domains are generated from a base
 * name and a suffix list so new country variants are one entry. Do not add a domain because it
 * is unfamiliar: only domains that issue mailboxes to members of the public belong here.
 * Disposable/temporary services live in ./disposable.ts; reviewed exceptions in ./exceptions.ts.
 */

const variants = (base: string, suffixes: readonly string[]) => suffixes.map((suffix) => `${base}.${suffix}`);

/** Country and regional suffixes used by the large webmail providers. */
const regional = [
  "com", "co.uk", "uk", "ie", "fr", "de", "at", "ch", "it", "es", "pt", "nl", "be", "lu", "dk", "se", "no", "fi", "is",
  "pl", "cz", "sk", "hu", "ro", "bg", "gr", "hr", "si", "rs", "ee", "lv", "lt", "ua", "ru", "by", "kz", "tr", "il",
  "ca", "com.mx", "mx", "com.br", "com.ar", "cl", "com.co", "com.pe", "com.ve",
  "com.au", "co.nz", "co.za", "co.in", "in", "co.jp", "jp", "cn", "com.cn", "com.hk", "com.tw", "com.sg", "sg", "com.my",
  "co.id", "com.ph", "co.th", "com.vn", "co.kr", "com.sa", "sa", "ae", "com.eg", "com.ng", "co.ke",
] as const;

export const personalEmailDomains: readonly string[] = [
  // Google
  "gmail.com", "googlemail.com",
  // Microsoft
  "msn.com", "passport.com", "windowslive.com",
  ...variants("outlook", regional), ...variants("hotmail", regional), ...variants("live", regional),
  // Yahoo and its legacy brands
  ...variants("yahoo", regional), "ymail.com", "rocketmail.com", "yahoomail.com",
  // Apple
  "icloud.com", "me.com", "mac.com",
  // AOL / Verizon Media
  "aol.com", "aol.co.uk", "aol.fr", "aol.de", "aim.com", "verizon.net", "love.com", "games.com", "wow.com",
  // Proton, Tuta and privacy-focused mailboxes
  "proton.me", "protonmail.com", "protonmail.ch", "pm.me",
  "tutanota.com", "tutanota.de", "tutamail.com", "tuta.io", "tuta.com", "keemail.me",
  "fastmail.com", "fastmail.fm", "hey.com", "hushmail.com", "hush.com", "mailfence.com", "posteo.de", "posteo.net",
  "runbox.com", "startmail.com", "disroot.org", "riseup.net", "ctemplar.com", "countermail.com", "kolabnow.com",
  // GMX / Web.de / Mail.com (United Internet)
  ...variants("gmx", ["com", "net", "de", "at", "ch", "fr", "co.uk", "es", "it", "us", "ca"]),
  "web.de", "mail.com", "email.com", "usa.com", "post.com", "europe.com", "asia.com", "consultant.com", "myself.com",
  "engineer.com", "dr.com", "techie.com", "writeme.com", "iname.com", "cheerful.com", "accountant.com", "workmail.com",
  // Zoho personal accounts (organizations on Zoho use their own domain)
  "zoho.com", "zohomail.com", "zohomail.in", "zohomail.eu",
  // Forwarding / alias relays (pseudonymous personal addresses)
  "privaterelay.appleid.com", "duck.com", "mozmail.com", "simplelogin.com", "simplelogin.co", "simplelogin.fr",
  "slmail.me", "aleeas.com", "anonaddy.com", "anonaddy.me", "addy.io",
  // Consumer ISPs — North America
  "comcast.net", "xfinity.com", "att.net", "sbcglobal.net", "bellsouth.net", "pacbell.net", "ameritech.net", "flash.net",
  "prodigy.net", "swbell.net", "charter.net", "spectrum.net", "rr.com", "twc.com", "roadrunner.com", "cox.net",
  "earthlink.net", "juno.com", "netzero.net", "netzero.com", "optonline.net", "frontier.com", "frontiernet.net",
  "windstream.net", "centurylink.net", "embarqmail.com", "mediacombb.net", "suddenlink.net",
  "shaw.ca", "rogers.com", "sympatico.ca", "bell.net", "videotron.ca", "telus.net", "cogeco.ca", "eastlink.ca",
  // Consumer ISPs and portals — Europe
  "btinternet.com", "btopenworld.com", "talktalk.net", "sky.com", "virginmedia.com", "blueyonder.co.uk", "ntlworld.com",
  "tiscali.co.uk", "plus.net", "orange.net", "wanadoo.co.uk", "eircom.net",
  "orange.fr", "wanadoo.fr", "free.fr", "sfr.fr", "neuf.fr", "laposte.net", "bbox.fr", "club-internet.fr", "aliceadsl.fr",
  "t-online.de", "freenet.de", "arcor.de", "online.de", "vodafone.de", "1und1.de", "mail.de",
  "libero.it", "virgilio.it", "alice.it", "tiscali.it", "tin.it", "fastwebnet.it", "email.it", "inwind.it",
  "telefonica.net", "terra.es", "ono.com", "movistar.es",
  "sapo.pt", "netcabo.pt", "clix.pt",
  "telenet.be", "skynet.be", "proximus.be", "ziggo.nl", "planet.nl", "home.nl", "kpnmail.nl", "hetnet.nl", "chello.nl", "xs4all.nl",
  "bluewin.ch", "sunrise.ch", "hispeed.ch", "chello.at", "aon.at",
  "bredband.net", "comhem.se", "online.no", "frisurf.no", "jubii.dk", "ofir.dk", "suomi24.fi", "luukku.com",
  "wp.pl", "o2.pl", "onet.pl", "op.pl", "interia.pl", "poczta.fm", "gazeta.pl", "tlen.pl",
  "seznam.cz", "centrum.cz", "atlas.cz", "email.cz", "post.cz", "azet.sk", "centrum.sk", "freemail.hu", "citromail.hu",
  "abv.bg", "mail.bg", "dir.bg", "yahoo.ro", "rdslink.ro",
  // Russia / CIS
  "mail.ru", "bk.ru", "inbox.ru", "list.ru", "internet.ru", "yandex.ru", "yandex.com", "yandex.ua", "yandex.by", "yandex.kz",
  "ya.ru", "rambler.ru", "lenta.ru", "ro.ru", "ukr.net", "i.ua", "meta.ua",
  // Asia-Pacific
  "qq.com", "foxmail.com", "163.com", "126.com", "yeah.net", "188.com", "vip.163.com", "sina.com", "sina.cn", "sohu.com",
  "aliyun.com", "139.com", "189.cn", "wo.cn", "tom.com",
  "naver.com", "hanmail.net", "daum.net", "nate.com", "kakao.com",
  "docomo.ne.jp", "ezweb.ne.jp", "softbank.ne.jp", "i.softbank.jp", "nifty.com", "biglobe.ne.jp", "ocn.ne.jp",
  "rediffmail.com", "indiatimes.com",
  "bigpond.com", "bigpond.net.au", "optusnet.com.au", "iinet.net.au", "tpg.com.au", "internode.on.net", "dodo.com.au",
  "xtra.co.nz", "slingshot.co.nz",
  "singnet.com.sg", "pacific.net.sg", "streamyx.com", "pldtdsl.net",
  // Latin America, Middle East, Africa
  "uol.com.br", "bol.com.br", "terra.com.br", "ig.com.br", "globo.com", "r7.com", "prodigy.net.mx", "terra.com.mx",
  "walla.co.il", "walla.com", "netvision.net.il", "bezeqint.net",
  "mweb.co.za", "telkomsa.net", "webmail.co.za", "vodamail.co.za",
];
