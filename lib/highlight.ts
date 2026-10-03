/**
 * Minimal line tokenizer for the documentation code samples.
 * Covers only what the samples use: comments, strings, numbers, keywords,
 * call names and Python keyword arguments.
 */

export type Lang = "python" | "javascript" | "json";
export type TokenType = "comment" | "string" | "number" | "keyword" | "fn" | "param";
export type Token = { t?: TokenType; v: string };
export type TokenLine = Token[];

const KEYWORDS: Record<Lang, Set<string>> = {
  python: new Set([
    "import", "from", "as", "def", "return", "if", "elif", "else", "not", "and", "or", "in",
    "for", "while", "with", "try", "except", "raise", "class", "None", "True", "False", "async", "await",
  ]),
  javascript: new Set([
    "import", "from", "export", "default", "async", "await", "function", "return", "if", "else",
    "const", "let", "new", "for", "of", "in", "throw", "try", "catch", "null", "true", "false", "typeof",
  ]),
  json: new Set(["true", "false", "null"]),
};

const PATTERNS: Record<Lang, RegExp> = {
  python: /(#.*$)|(f?"(?:\\.|[^"\\])*"|f?'(?:\\.|[^'\\])*')|(\b\d[\d_.]*\b)|([A-Za-z_]\w*)|(\s+)|(.)/gy,
  javascript: /(\/\/.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d[\d_.]*\b)|([A-Za-z_$][\w$]*)|(\s+)|(.)/gy,
  json: /(\/\/.*$)|("(?:\\.|[^"\\])*")|(-?\b\d[\d.]*\b)|([A-Za-z_]\w*)|(\s+)|(.)/gy,
};

function tokenizeLine(line: string, lang: Lang): TokenLine {
  const re = new RegExp(PATTERNS[lang].source, "gy");
  const out: TokenLine = [];
  const push = (v: string, t?: TokenType) => {
    const last = out[out.length - 1];
    if (last && last.t === t) last.v += v;
    else out.push(t ? { t, v } : { v });
  };
  let m: RegExpExecArray | null;
  while (re.lastIndex < line.length && (m = re.exec(line))) {
    const [, comment, str, num, word, space, other] = m;
    if (comment) push(comment, "comment");
    else if (str) push(str, "string");
    else if (num) push(num, "number");
    else if (word) {
      const rest = line.slice(re.lastIndex);
      if (KEYWORDS[lang].has(word)) push(word, "keyword");
      else if (/^\s*\(/.test(rest)) push(word, "fn");
      else if (lang === "python" && /^=(?!=)/.test(rest)) push(word, "param");
      else push(word);
    } else push(space ?? other ?? "");
  }
  return out;
}

export function tokenize(code: string, lang: Lang): TokenLine[] {
  return code.replace(/\n$/, "").split("\n").map((line) => tokenizeLine(line, lang));
}
