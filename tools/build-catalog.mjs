#!/usr/bin/env node
// Builds catalog.json and CATALOG.md: a machine-readable index of every component variant, so an agent can pick
// components and fill their CONFIG without opening each index.html.
//
// For each variant it records: file, canvas, duration, kind (overlay / full), the composition variables, the CONFIG
// defaults plus an inferred schema (with the inline comments on top-level keys), the footage files it expects,
// bundled media, the HyperFrames version to run it with, and the README's description, CONFIG docs and keywords.
//
// Usage: node tools/build-catalog.mjs        (run from anywhere; paths are relative to the repo root)

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");
const read = (p) => fs.readFileSync(p, "utf8");
const index = JSON.parse(read(path.join(ROOT, "components.json")));
const errors = [];

// ---------- HTML helpers ----------

function headerComment(html) {
  const m = html.match(/<!--([\s\S]*?)-->/);
  return m ? m[1].replace(/\s+/g, " ").trim() : "";
}

function variables(html, file) {
  const m = html.match(/data-composition-variables='([\s\S]*?)'/);
  if (!m) return [];
  try {
    return JSON.parse(m[1]);
  } catch (e) {
    errors.push(`${file}: composition variables are not valid JSON (${e.message})`);
    return [];
  }
}

function rootComposition(html) {
  const tag = (html.match(/<[^>]*data-composition-id="main"[^>]*>/) || [""])[0];
  const attr = (n) => (tag.match(new RegExp(`${n}="([^"]*)"`)) || [])[1];
  const num = (v) => (v === undefined ? null : Number(v));
  return { width: num(attr("data-width")), height: num(attr("data-height")), duration: num(attr("data-duration")) };
}

function aspectOf(w, h) {
  if (!w || !h) return null;
  if (w * 9 === h * 16) return "16:9";
  if (w * 16 === h * 9) return "9:16";
  return `${w}x${h}`;
}

// overlay = graphics over footage, clean with bg:none; full = a treatment of the footage itself (DESIGN-long-form.md §3)
function kindOf(header) {
  const full = header.match(
    /([^.;(]*full[- ]kind[^.;)]*|[^.;(]*kind[\s:=]*["']?full\b[^.;)]*|full-frame (component|shot|webcam)[^.;]*|[^.;(]*always shows[^.;]*|[^.;(]*keeps? the footage[^.;)]*)/i
  );
  if (full) return { kind: "full", evidence: full[0].trim() };
  const ov = header.match(/[^.;(]*overlay[^.;)]*/i);
  return { kind: "overlay", evidence: ov ? ov[0].trim() : "no full-frame marker in header comment" };
}

// ---------- CONFIG extraction ----------

// Returns the source text of the object literal assigned to `const CONFIG`, skipping strings, templates and comments.
function configSource(html) {
  const at = html.indexOf("const CONFIG");
  if (at < 0) return null;
  const start = html.indexOf("{", at);
  let depth = 0;
  for (let i = start; i < html.length; i++) {
    const c = html[i], n = html[i + 1];
    if (c === "/" && n === "/") { i = html.indexOf("\n", i); if (i < 0) return null; continue; }
    if (c === "/" && n === "*") { i = html.indexOf("*/", i + 2) + 1; continue; }
    if (c === '"' || c === "'" || c === "`") {
      for (i++; i < html.length && html[i] !== c; i++) if (html[i] === "\\") i++;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return html.slice(start, i + 1);
  }
  return null;
}

// Evaluates the literal in an empty sandbox. If it refers to a constant declared earlier in the script
// (e.g. `const W = 1080`), retries with the script text before CONFIG run first.
function evalConfig(src, html, file) {
  const opts = { timeout: 1000 };
  try {
    return vm.runInNewContext(`(${src})`, {}, opts);
  } catch (first) {
    const at = html.indexOf("const CONFIG");
    const scriptStart = html.lastIndexOf("<script>", at);
    const prelude = scriptStart >= 0 ? html.slice(scriptStart + 8, at) : "";
    try {
      return vm.runInNewContext(`${prelude}\n;(${src})`, { window: {}, document: undefined }, opts);
    } catch {
      errors.push(`${file}: CONFIG could not be evaluated (${first.message})`);
      return undefined;
    }
  }
}

// The comment on a top-level key: a trailing `// ...` on the key's line, or `//` lines directly above it.
function topLevelNotes(src) {
  const lines = src.split("\n").slice(1);
  const keyLine = /^(\s*)["']?([A-Za-z_$][\w$]*)["']?\s*:/;
  const first = lines.find((l) => keyLine.test(l));
  if (!first) return {};
  const indent = first.match(keyLine)[1].length;
  const notes = {};
  let pending = [];
  for (const line of lines) {
    const m = line.match(keyLine);
    const trimmed = line.trim();
    if (m && m[1].length === indent) {
      const trailing = line.match(/(?<![:"'])\/\/\s?(.*)$/);
      const text = [...pending, trailing ? trailing[1].trim() : ""].filter(Boolean).join(" ");
      if (text) notes[m[2]] = text;
      pending = [];
    } else if (trimmed.startsWith("//") && line.search(/\S/) === indent) {
      pending.push(trimmed.replace(/^\/\/\s?/, ""));
    } else if (trimmed) {
      pending = [];
    }
  }
  return notes;
}

// A short type name for a top-level CONFIG value.
function typeName(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return `array(${v.length})`;
  if (typeof v === "string" && /^#[0-9a-f]{3,8}$/i.test(v)) return "color";
  if (typeof v === "string" && /^assets\/(shots|clips|plates)\//.test(v)) return "footage-path";
  return typeof v;
}

// ---------- media ----------

function footage(html, dir) {
  const refs = [...new Set(html.match(/assets\/(?:shots|clips|plates)\/[\w.\-/]+\.(?:mp4|webm|mov|jpg|jpeg|png|webp)/g) || [])];
  return refs.sort().map((p) => ({ path: p, present: fs.existsSync(path.join(dir, p)) }));
}

function bundledMedia(html, dir) {
  const refs = [...new Set(html.match(/media\/[\w.\-/]+\.\w+/g) || [])];
  return refs.sort().map((p) => ({ path: p, present: fs.existsSync(path.join(dir, p)) }));
}

// ---------- README ----------

function readme(dir) {
  const f = path.join(dir, "README.md");
  if (!fs.existsSync(f)) return { summary: "", configDocs: "", keywords: [] };
  const md = read(f);
  const body = md.replace(/^#[^\n]*\n/, "");
  const summary = body.split(/\n## /)[0].replace(/\nKeywords:[^\n]*/, "").trim();
  const cfg = md.match(/\n## CONFIG[^\n]*\n([\s\S]*?)(?=\n## |\nKeywords:|$)/);
  // either a "Keywords: a, b" line or a "## Keywords" section
  const kw = md.match(/\nKeywords:\s*([^\n]*)/) || md.match(/\n## Keywords[^\n]*\n([\s\S]*?)(?=\n## |$)/);
  const keywords = kw
    ? kw[1].split(/[,\n]/).map((s) => s.replace(/^\s*[-*]\s*/, "").trim().replace(/\.$/, "")).filter(Boolean)
    : [];
  return { summary, configDocs: cfg ? cfg[1].trim() : "", keywords: [...new Set(keywords)] };
}

// ---------- build ----------

function variantRecord(file, label, hfVersion) {
  const dir = path.dirname(file);
  const html = read(file);
  const r = rel(file);
  const header = headerComment(html);
  const comp = rootComposition(html);
  const src = configSource(html);
  if (!src) errors.push(`${r}: no const CONFIG found`);
  const defaults = src ? evalConfig(src, html, r) : undefined;
  const vars = variables(html, r);
  const { kind, evidence } = kindOf(header);
  return {
    label,
    file: r,
    aspect: aspectOf(comp.width, comp.height),
    width: comp.width,
    height: comp.height,
    duration: comp.duration,
    durationVariable: vars.some((v) => v.id === "dur"),
    kind,
    kindEvidence: evidence,
    transparentWith: vars.some((v) => v.id === "bg") ? { bg: "none" } : null,
    variables: vars,
    usesThree: /three(\.min)?\.js/.test(html),
    hyperframes: hfVersion,
    config: {
      // top-level keys with their type (object/array shapes are visible in defaults)
      fields: defaults && typeof defaults === "object" ? Object.fromEntries(Object.entries(defaults).map(([k, x]) => [k, typeName(x)])) : null,
      notes: src ? topLevelNotes(src) : {},
      defaults: defaults === undefined ? null : defaults,
    },
    footage: footage(html, dir),
    bundledMedia: bundledMedia(html, dir),
  };
}

const entries = [];

for (const c of index.components) {
  const dir = path.join(ROOT, c.dir);
  const files = [
    ["long-form", path.join(dir, "long-form", "index.html")],
    ["shorts", path.join(dir, "shorts", "index.html")],
  ];
  const variants = files
    .map(([folder, f], i) => {
      if (!fs.existsSync(f)) { errors.push(`${c.dir}/${folder}: missing index.html`); return null; }
      return { folder, ...variantRecord(f, c.variants[i] ?? folder, "0.9.72") };
    })
    .filter(Boolean);
  entries.push({ id: path.basename(c.dir), collection: "long-form", name: c.name, group: c.group, job: c.job, three: c.three, ...readme(dir), variants });
}

for (const c of index.shorts) {
  const dir = path.join(ROOT, c.dir);
  const f = path.join(dir, "index.html");
  if (!fs.existsSync(f)) { errors.push(`${c.dir}: missing index.html`); continue; }
  let hf = "0.8.162";
  const pkg = path.join(dir, "package.json");
  if (fs.existsSync(pkg)) hf = (read(pkg).match(/hyperframes@([\d.]+)/) || [])[1] || hf;
  const v = variantRecord(f, c.variants.join(" / "), hf);
  // Shorts-only files hold several looks in one file, picked by the `variant` variable
  const variantVar = v.variables.find((x) => x.id === "variant");
  v.variantOptions = variantVar ? variantVar.options : [];
  entries.push({ id: path.basename(c.dir), collection: "shorts-only", name: c.name, group: c.group, job: c.job, three: c.three, ...readme(dir), variants: [v] });
}

const catalog = {
  generated: "by tools/build-catalog.mjs from components.json, each index.html and README.md; do not edit by hand",
  howToUse: [
    "Pick a component by group, job, keywords and kind; pick the variant matching your aspect (16:9 long-form, 9:16 Shorts).",
    "Copy its folder, run ./setup.sh on it, then edit only the `const CONFIG` object in index.html (config.schema / config.defaults / configDocs describe it).",
    "Variables (bg, variant, mode, dur) are passed at render: npx --yes hyperframes@<hyperframes> render . --variables '{\"bg\":\"none\"}'.",
    "kind 'overlay' renders transparent with bg:none; kind 'full' always shows footage, so supply clips at the footage paths listed (none are in the repo).",
    "Long-form components: the README's 'A' is the long-form/ folder and 'B' is shorts/ (the READMEs still say a/ and b/).",
  ],
  counts: {
    components: entries.length,
    variants: entries.reduce((n, e) => n + e.variants.length, 0),
    byGroup: entries.reduce((m, e) => ((m[e.group] = (m[e.group] || 0) + 1), m), {}),
    byKind: entries.flatMap((e) => e.variants).reduce((m, v) => ((m[v.kind] = (m[v.kind] || 0) + 1), m), {}),
  },
  components: entries,
};

fs.writeFileSync(path.join(ROOT, "catalog.json"), JSON.stringify(catalog, null, 1) + "\n");

// ---------- CATALOG.md: one line per variant, for a quick scan ----------

const md = [
  "# Component catalog",
  "",
  "Generated by `node tools/build-catalog.mjs`. Full detail (CONFIG schema, defaults, footage paths) is in `catalog.json`.",
  "",
  `${catalog.counts.components} components, ${catalog.counts.variants} variant files. Kind: ${Object.entries(catalog.counts.byKind).map(([k, n]) => `${n} ${k}`).join(", ")}.`,
  "",
];
const groups = [...new Set(entries.map((e) => `${e.collection}|${e.group}`))];
for (const g of groups) {
  const [collection, group] = g.split("|");
  md.push(`## ${group} (${collection})`, "", "| Component | Job | Variant | Aspect | Secs | Kind | CONFIG keys | Clips needed |", "|---|---|---|---|---|---|---|---|");
  for (const e of entries.filter((x) => x.collection === collection && x.group === group)) {
    for (const v of e.variants) {
      const keys = v.config.fields ? Object.keys(v.config.fields).join(", ") : "?";
      const cell = (s) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
      md.push(`| \`${e.id}\` ${cell(e.name)} | ${cell(e.job)} | ${cell(v.label)} | ${v.aspect} | ${v.duration ?? "?"} | ${v.kind} | ${cell(keys)} | ${v.footage.length} |`);
    }
  }
  md.push("");
}
fs.writeFileSync(path.join(ROOT, "CATALOG.md"), md.join("\n"));

console.log(`catalog.json: ${catalog.counts.components} components, ${catalog.counts.variants} variants`, catalog.counts.byKind);
if (errors.length) {
  console.log(`\n${errors.length} problem(s):`);
  for (const e of errors) console.log(" - " + e);
  process.exitCode = 1;
}
