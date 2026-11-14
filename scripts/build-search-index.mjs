import { readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

/*
 * Site search index, generated from the route source at predev/prebuild.
 *
 * Each content route is parsed with the installed TypeScript compiler. Its visible copy is
 * collected from the page itself, from page-specific content components it imports (for
 * example the homepage's Practice and Workflow), and from local data modules it renders
 * (for example content/tiers.ts), resolved symbolically: `tiers[2].description`,
 * `tiers.map((tier) => …)` and destructured map callbacks expand to the values a visitor
 * actually sees. Shared primitives (Doc, ProductContent) are not walked; their content
 * arrives through the props each page passes them.
 *
 * Categories follow the site's own information architecture in content/nav.ts.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = path.join(root, "app");

async function pages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const found = await Promise.all(entries.map(async (entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return pages(full);
    return entry.name === "page.tsx" ? [full] : [];
  }));
  return found.flat();
}

function clean(value) {
  return value.replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&apos;|&#39;/g, "'").replace(/&quot;/g, "\"").replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?’”)])/g, "$1").replace(/([‘“(])\s+/g, "$1").replace(/\.\./g, ".").trim();
}

/* ---------- module resolution ---------- */

const parsed = new Map();
function parse(file) {
  if (!parsed.has(file)) {
    const ast = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true,
      file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    parsed.set(file, ast);
  }
  return parsed.get(file);
}

function resolveModule(from, specifier) {
  let base;
  if (specifier.startsWith("@/")) base = path.join(root, specifier.slice(2));
  else if (specifier.startsWith(".")) base = path.resolve(path.dirname(from), specifier);
  else return null;
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts"), path.join(base, "index.tsx")]) {
    if (/\.(tsx?)$/.test(candidate) && existsSync(candidate)) return candidate;
  }
  return null;
}

/** Top-level bindings of a module: local consts plus named imports from local modules (lazy). */
const moduleScopes = new Map();
function moduleScope(file) {
  if (moduleScopes.has(file)) return moduleScopes.get(file);
  const scope = new Map();
  moduleScopes.set(file, scope);
  const ast = parse(file);
  for (const statement of ast.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name) scope.set(statement.name.text, { node: statement, scope });
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.initializer) scope.set(declaration.name.text, { node: declaration.initializer, scope });
      }
    }
    if (ts.isImportDeclaration(statement) && statement.importClause?.namedBindings && ts.isNamedImports(statement.importClause.namedBindings)) {
      const target = resolveModule(file, statement.moduleSpecifier.text);
      if (!target || statement.importClause.isTypeOnly) continue;
      for (const element of statement.importClause.namedBindings.elements) {
        const imported = (element.propertyName ?? element.name).text;
        scope.set(element.name.text, { lazyImport: { target, imported } });
      }
    }
  }
  return scope;
}

function lookup(name, scope) {
  for (let current = scope; current; current = current.parent) {
    const map = current.vars ?? current;
    if (map.has?.(name)) {
      const entry = map.get(name);
      if (entry?.lazyImport) {
        const resolved = moduleScope(entry.lazyImport.target).get(entry.lazyImport.imported);
        return resolved?.lazyImport ? null : resolved ?? null;
      }
      return entry;
    }
  }
  return null;
}

function child(scope, vars) {
  return { vars, parent: scope };
}

/** Follows identifiers, element access and property access to a concrete AST value. */
function resolve(node, scope, depth = 0) {
  if (!node || depth > 24) return null;
  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression?.(node) || ts.isNonNullExpression(node)) {
    return resolve(node.expression, scope, depth + 1);
  }
  if (ts.isIdentifier(node)) {
    const entry = lookup(node.text, scope);
    return entry ? resolve(entry.node, entry.scope, depth + 1) : null;
  }
  if (ts.isElementAccessExpression(node)) {
    // A literal index selects that element; a state index (`items[selected]`) selects the
    // element rendered on load, which every tab component here initialises to 0.
    const position = ts.isNumericLiteral(node.argumentExpression) ? Number(node.argumentExpression.text)
      : ts.isIdentifier(node.argumentExpression) ? 0 : -1;
    const target = position < 0 ? null : resolve(node.expression, scope, depth + 1);
    const element = target?.node && ts.isArrayLiteralExpression(target.node) ? target.node.elements[position] : null;
    return element ? resolve(element, target.scope, depth + 1) ?? { node: element, scope: target.scope } : null;
  }
  if (ts.isPropertyAccessExpression(node)) {
    const target = resolve(node.expression, scope, depth + 1);
    const value = target?.node && ts.isObjectLiteralExpression(target.node) ? property(target.node, node.name.text) : null;
    return value ? resolve(value, target.scope, depth + 1) ?? { node: value, scope: target.scope } : null;
  }
  return { node, scope };
}

function property(object, key) {
  for (const item of object.properties) {
    if (ts.isPropertyAssignment(item) && item.name.getText() === key) return item.initializer;
    if (ts.isShorthandPropertyAssignment(item) && item.name.text === key) return item.name;
  }
  return null;
}

/** Binds a map callback's parameter (identifier or destructuring pattern) to one element. */
function bind(parameter, element, elementScope) {
  const vars = new Map();
  if (!parameter) return vars;
  if (ts.isIdentifier(parameter.name)) vars.set(parameter.name.text, { node: element, scope: elementScope });
  else if (ts.isObjectBindingPattern(parameter.name)) {
    const resolved = resolve(element, elementScope);
    for (const part of parameter.name.elements) {
      if (!ts.isIdentifier(part.name)) continue;
      const key = (part.propertyName ?? part.name).getText();
      const value = resolved?.node && ts.isObjectLiteralExpression(resolved.node) ? property(resolved.node, key) : null;
      if (value) vars.set(part.name.text, { node: value, scope: resolved.scope });
    }
  }
  return vars;
}

/** `array.map(callback)` over a resolvable array literal: one expansion per element. */
function mapExpansions(node, scope) {
  if (!ts.isCallExpression(node) || !ts.isPropertyAccessExpression(node.expression)) return null;
  if (!["map", "flatMap"].includes(node.expression.name.text)) return null;
  const callback = node.arguments[0];
  if (!callback || !(ts.isArrowFunction(callback) || ts.isFunctionExpression(callback))) return null;
  const source = resolve(node.expression.expression, scope);
  if (!source?.node || !ts.isArrayLiteralExpression(source.node)) return null;
  let body = callback.body;
  if (ts.isBlock(body)) {
    const returned = body.statements.find(ts.isReturnStatement);
    body = returned?.expression;
  }
  if (!body) return null;
  return source.node.elements.map((element) => ({ body, scope: child(scope, bind(callback.parameters[0], element, source.scope)) }));
}

/* ---------- visible text ---------- */

function visibleText(node, scope, depth = 0) {
  if (!node || depth > 40) return "";
  if (ts.isJsxText(node)) return node.text;
  if (ts.isStringLiteralLike(node)) return node.text;
  if (ts.isNumericLiteral(node)) return node.text;
  if (ts.isTemplateExpression(node)) {
    return node.head.text + node.templateSpans.map((span) => visibleText(span.expression, scope, depth + 1) + span.literal.text).join("");
  }
  if (ts.isJsxExpression(node)) return node.expression ? visibleText(node.expression, scope, depth + 1) : "";
  if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
    if (ts.isJsxElement(node) && SKIP_TAGS.has(tagName(node.openingElement))) return "";
    return node.children.map((item) => visibleText(item, scope, depth + 1)).join(" ");
  }
  if (ts.isJsxSelfClosingElement(node)) return "";
  if (ts.isParenthesizedExpression(node)) return visibleText(node.expression, scope, depth + 1);
  if (ts.isConditionalExpression(node)) return `${visibleText(node.whenTrue, scope, depth + 1)} ${visibleText(node.whenFalse, scope, depth + 1)}`;
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken) return visibleText(node.right, scope, depth + 1);
  const expansions = mapExpansions(node, scope);
  if (expansions) return expansions.map((item) => visibleText(item.body, item.scope, depth + 1)).join(" ");
  if (ts.isIdentifier(node) || ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
    const value = resolve(node, scope);
    if (!value?.node || value.node === node) return "";
    if (ts.isStringLiteralLike(value.node) || ts.isTemplateExpression(value.node) || ts.isNumericLiteral(value.node)
      || ts.isJsxElement(value.node) || ts.isJsxFragment(value.node) || ts.isParenthesizedExpression(value.node)) {
      return visibleText(value.node, value.scope, depth + 1);
    }
  }
  return "";
}

function tagName(opening) {
  return opening?.tagName?.getText() ?? "";
}

/** Code samples, icons and decorative media are not prose. */
const SKIP_TAGS = new Set(["code", "pre", "svg", "Image", "img", "ProductExample", "style", "script"]);
/** Interactive chrome: CTA and link labels never become passages of their own. */
const CHROME_TAGS = new Set(["Link", "a", "button", "Actions", "Related", "option", "select", "input", "textarea", "label"]);
/** Form controls: their labels and placeholders are interface, never page copy. */
const FORM_TAGS = new Set(["label", "select", "option", "input", "textarea"]);
const BLOCK_TAGS = new Set(["p", "li", "td", "dd", "dt", "blockquote", "figcaption", "caption", "Note", "summary"]);

/** Consts declared in a function body (`const topic = monitoredTopics[selected]`). */
function blockScope(block, scope) {
  const vars = new Map();
  for (const statement of block.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer) vars.set(declaration.name.text, { node: declaration.initializer, scope: null });
    }
  }
  const next = child(scope, vars);
  for (const entry of vars.values()) entry.scope = next;
  return next;
}

/** A local component used as `<Tag prop={value} />`: its body, with props bound to the attributes. */
function componentCall(opening, scope) {
  const tag = tagName(opening);
  if (!/^[A-Z][A-Za-z0-9]*$/.test(tag)) return null;
  const entry = lookup(tag, scope);
  const fn = entry?.node;
  if (!fn || !(ts.isFunctionDeclaration(fn) || ts.isArrowFunction(fn) || ts.isFunctionExpression(fn)) || !fn.body) return null;
  const vars = new Map();
  const parameter = fn.parameters[0];
  if (parameter && ts.isObjectBindingPattern(parameter.name)) {
    for (const part of parameter.name.elements) {
      if (!ts.isIdentifier(part.name)) continue;
      const key = (part.propertyName ?? part.name).getText();
      const attr = opening.attributes.properties.find((item) => ts.isJsxAttribute(item) && item.name.getText() === key);
      const value = attr?.initializer && (ts.isJsxExpression(attr.initializer) ? attr.initializer.expression : attr.initializer);
      if (value) vars.set(part.name.text, { node: value, scope });
    }
  }
  return { fn, body: fn.body, scope: child(entry.scope, vars) };
}

/** Section anchors only from static ids: a computed id cannot be linked to reliably. */
function staticId(opening) {
  const item = opening.attributes?.properties.find((part) => ts.isJsxAttribute(part) && part.name.getText() === "id");
  const value = item?.initializer && (ts.isJsxExpression(item.initializer) ? item.initializer.expression : item.initializer);
  return value && ts.isStringLiteral(value) && /^[a-z][a-z0-9-]*$/i.test(value.text) ? value.text : "";
}

function attribute(opening, key, scope) {
  const item = opening.attributes?.properties.find((part) => ts.isJsxAttribute(part) && part.name.getText() === key);
  if (!item?.initializer) return "";
  return clean(visibleText(item.initializer, scope));
}

/** Runtime-only text (counts, echoed input): a call or unresolved template inside the block. */
function isDynamic(node, scope) {
  let dynamic = false;
  const visit = (current) => {
    if (dynamic) return;
    if (ts.isTemplateExpression(current) && current.templateSpans.some((span) => !visibleText(span.expression, scope).trim())) dynamic = true;
    else if (ts.isCallExpression(current) && ts.isJsxExpression(current.parent) && !mapExpansions(current, scope)) dynamic = true;
    if (!dynamic) ts.forEachChild(current, visit);
  };
  visit(node);
  return dynamic;
}

/** Structured data handed to a component as a prop: one passage per row-like call, headings from titles. */
function walkData(node, scope, target, headings, passages, add, depth = 0) {
  if (!node || depth > 12) return;
  if (ts.isCallExpression(node) && node.arguments[0] && ts.isStringLiteralLike(node.arguments[0])) {
    const parts = [];
    const collect = (value) => {
      if (!value) return;
      if (ts.isSpreadElement(value)) return collect(value.expression);
      if (ts.isCallExpression(value)) return value.arguments.forEach(collect);
      const textValue = clean(visibleText(value, scope));
      if (textValue) parts.push(textValue);
    };
    node.arguments.forEach(collect);
    add(passages, [...new Set(parts)].join(" · "), target);
    return;
  }
  if (ts.isObjectLiteralExpression(node)) {
    const title = property(node, "title");
    if (title && ts.isStringLiteralLike(title)) add(headings, title.text, target);
  }
  ts.forEachChild(node, (child) => walkData(child, scope, target, headings, passages, add, depth + 1));
}

/** Direct copy: literal JSX text, or an expression that resolves to a string (`{research.request}`). */
function hasDirectText(element, scope) {
  return element.children.some((item) => {
    if (ts.isJsxText(item)) return item.text.trim().length > 0;
    if (!ts.isJsxExpression(item) || !item.expression) return false;
    const value = resolve(item.expression, scope);
    return !!value?.node && (ts.isStringLiteralLike(value.node) || ts.isTemplateExpression(value.node)) && visibleText(value.node, value.scope).trim().length > 0;
  });
}

/** Component props that carry copy rather than configuration. */
const NON_COPY_PROPS = /^(className|href|id|src|alt|key|style|role|type|name|as|size|variant|ref|view|location|tone|icon|aria-.*|data-.*|on[A-Z].*)$/;

/* ---------- taxonomy (content/nav.ts) ---------- */

function navTaxonomy() {
  const scope = moduleScope(path.join(root, "content", "nav.ts"));
  const product = resolve(ts.factory.createIdentifier("productSection"), scope);
  const map = new Map();
  const groups = product?.node && property(product.node, "groups");
  if (groups && ts.isArrayLiteralExpression(groups)) {
    for (const group of groups.elements) {
      const title = clean(visibleText(property(group, "title"), scope));
      const items = property(group, "items");
      for (const item of items?.elements ?? []) map.set(clean(visibleText(property(item, "href"), scope)), title);
    }
  }
  return map;
}

const productGroups = navTaxonomy();
/** Global documentation domains and standalone pages, named as the navbar and footer name them. */
function category(href) {
  if (productGroups.has(href)) return productGroups.get(href);
  if (["/documentation", "/philosophy", "/instruments"].includes(href)) return "Documentation";
  if (href === "/architecture") return "Architecture";
  if (href === "/use-cases") return "Use cases";
  if (href === "/partnerships") return "Enterprise tenancy";
  if (href === "/performance") return "Performance";
  if (href === "/risk") return "Disclosure";
  if (href === "/contact") return "Request access";
  return "Product";
}
const CATEGORY_ORDER = [...new Set([...productGroups.values()]), "Documentation", "Architecture", "Use cases", "Enterprise tenancy", "Performance", "Request access", "Disclosure"];

/* ---------- page indexing ---------- */

function pageImports(file) {
  const ast = parse(file);
  return ast.statements.filter(ts.isImportDeclaration)
    .filter((statement) => statement.importClause?.name && !statement.importClause.isTypeOnly)
    .map((statement) => resolveModule(file, statement.moduleSpecifier.text))
    .filter((target) => target?.endsWith(".tsx"));
}

function indexPage(file, followed) {
  const routeParts = path.relative(app, path.dirname(file)).split(path.sep).filter((part) => !part.startsWith("("));
  const href = `/${routeParts.join("/")}`.replace(/\/$/, "") || "/";
  if (href === "/search") return null;
  const headings = [];
  const passages = [];
  let metadataTitle = "";
  let summary = "";
  let h1 = "";

  function add(list, raw, target) {
    const text = clean(raw);
    const words = text.split(" ").length;
    if (list === passages ? (text.length < 20 || words < 3) : text.length < 4) return;
    const key = text.toLowerCase();
    // Keep the most complete version of repeated copy (a data object and its rendered row).
    if (list.some((item) => item.text.toLowerCase().includes(key))) return;
    for (let i = list.length - 1; i >= 0; i--) if (key.includes(list[i].text.toLowerCase())) list.splice(i, 1);
    list.push({ text, href: target });
  }

  const active = new Set();
  function walk(node, target, scope) {
    if (ts.isBlock(node)) {
      const inner = blockScope(node, scope);
      for (const statement of node.statements) walk(statement, target, inner);
      return;
    }
    if (ts.isVariableDeclaration(node) && node.name.getText() === "metadata" && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
      const title = property(node.initializer, "title");
      const description = property(node.initializer, "description");
      if (title && ts.isStringLiteralLike(title)) metadataTitle = clean(title.text);
      if (description) summary = clean(visibleText(description, scope));
      return;
    }

    // Data passed to shared primitives (EntryList entries, ProductSteps steps, …).
    if (ts.isObjectLiteralExpression(node)) {
      const body = ["body", "text", "descriptor", "fit"].map((key) => property(node, key)).filter(Boolean)
        .map((value) => clean(visibleText(value, scope))).filter((value) => value.length >= 20);
      if (body.length) {
        const label = ["title", "label"].map((key) => property(node, key)).filter(Boolean).map((value) => clean(visibleText(value, scope))).find(Boolean);
        const id = property(node, "id");
        const anchor = id && ts.isStringLiteralLike(id) ? `${href}#${id.text}` : target;
        if (label) add(headings, label, anchor);
        add(passages, [label, ...body].filter(Boolean).join(". "), anchor);
      }
    }

    const expansions = mapExpansions(node, scope);
    if (expansions) {
      for (const item of expansions) walk(item.body, target, item.scope);
      return;
    }

    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const opening = ts.isJsxElement(node) ? node.openingElement : node;
      const tag = tagName(opening);
      if (SKIP_TAGS.has(tag) || FORM_TAGS.has(tag)) return;
      const id = staticId(opening);
      const current = id && (tag === "DocSection" || /^[a-z]/.test(tag)) ? `${href}#${id}` : target;
      const title = attribute(opening, "title", scope);
      if ((tag === "DocHeader" || tag === "DocSection") && title) add(headings, title, current);
      if (/^[A-Z]/.test(tag) && tag !== "DocHeader" && tag !== "DocSection") {
        for (const part of opening.attributes.properties) {
          if (!ts.isJsxAttribute(part) || NON_COPY_PROPS.test(part.name.getText())) continue;
          const value = attribute(opening, part.name.getText(), scope);
          if (value.split(" ").length >= 3) add(passages, value, current);
        }
      }
      for (const part of opening.attributes.properties) {
        if (!ts.isJsxAttribute(part) || !part.initializer) continue;
        walk(part.initializer, current, scope);
        // A prop bound to data declared elsewhere (`groups={accessComparison}`) is rendered content.
        const expression = ts.isJsxExpression(part.initializer) ? part.initializer.expression : null;
        const data = expression && ts.isIdentifier(expression) ? resolve(expression, scope) : null;
        if (data?.node && data.node !== expression && (ts.isArrayLiteralExpression(data.node) || ts.isObjectLiteralExpression(data.node))
          && !NON_COPY_PROPS.test(part.name.getText())) {
          walkData(data.node, data.scope, current, headings, passages, add);
        }
      }
      const call = componentCall(opening, scope);
      if (call && !active.has(call.fn)) {
        active.add(call.fn);
        walk(call.body, current, call.scope);
        active.delete(call.fn);
      }
      if (ts.isJsxSelfClosingElement(node)) return;

      if (/^h[1-4]$/.test(tag)) {
        const value = clean(visibleText(node, scope));
        if (tag === "h1" && value && !h1) h1 = value;
        add(headings, value, current);
        return;
      }
      if (tag === "tr") {
        const cells = node.children.filter((item) => ts.isJsxElement(item) || ts.isJsxExpression(item))
          .map((item) => clean(visibleText(item, scope))).filter(Boolean);
        add(passages, cells.join(" · "), current);
        return;
      }
      if (BLOCK_TAGS.has(tag) || (!CHROME_TAGS.has(tag) && hasDirectText(node, scope))) {
        if (!isDynamic(node, scope)) add(passages, visibleText(node, scope), current);
        return;
      }
      for (const item of node.children) walk(item, current, scope);
      return;
    }
    ts.forEachChild(node, (item) => walk(item, target, scope));
  }

  walk(parse(file), href, moduleScope(file));
  for (const component of pageImports(file).filter((target) => followed.has(target))) {
    walk(parse(component), href, moduleScope(component));
  }

  const title = href === "/" ? "ATRX Overview" : metadataTitle || h1;
  if (!title) throw new Error(`Search index needs a page title: ${file}`);
  return { href, title, category: category(href), summary, headings: headings.filter((item) => item.text !== title), passages };
}

const files = (await pages(app)).sort();
// Content components that belong to one or two pages are part of those pages' copy;
// anything shared more widely is a primitive whose content arrives through page props.
const importers = new Map();
for (const file of files) for (const target of new Set(pageImports(file))) importers.set(target, (importers.get(target) ?? 0) + 1);
const followed = new Set([...importers].filter(([, count]) => count <= 2).map(([target]) => target));

const index = files.map((file) => indexPage(file, followed)).filter(Boolean)
  .sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) || a.href.localeCompare(b.href));
const output = path.join(root, "content", "search-index.generated.json");
await writeFile(output, `${JSON.stringify(index, null, 2)}\n`);
console.log(`Indexed ${index.length} ATRX pages (${index.reduce((sum, page) => sum + page.passages.length, 0)} passages) from route source.`);
