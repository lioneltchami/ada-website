import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import {
  collectInlineStyleAttributeHashes,
  collectInlineStyleElementHashes,
} from "../src/lib/csp-meta.mjs";

const clientDir = path.resolve("dist/client");

async function htmlFiles(directory) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...(await htmlFiles(entryPath)));
    else if (entry.isFile() && entry.name.endsWith(".html"))
      found.push(entryPath);
  }
  return found;
}

function decodeAttribute(value) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");
}

function isExecutableInlineScript(attributes) {
  if (/\s+src\s*=/i.test(attributes)) return false;
  const type = attributes.match(/\s+type\s*=\s*["']?([^\s"'>]+)/i)?.[1];
  if (!type) return true;
  return !/^(application\/(ld\+json|json)|text\/(template|html))$/i.test(type);
}

const headers = await readFile(path.join(clientDir, "_headers"), "utf8");
const cspLines = headers
  .split(/\r?\n/)
  .filter((line) => /^\s+Content-Security-Policy:/i.test(line));
if (
  cspLines.length !== 1 ||
  !/Content-Security-Policy:\s*frame-ancestors\s+'none'\s*$/i.test(cspLines[0])
) {
  throw new Error(
    "Static _headers must retain only frame-ancestors; page-specific CSP is emitted by Astro.",
  );
}

const pages = await htmlFiles(clientDir);
if (pages.length < 20) {
  throw new Error(
    `Expected at least 20 generated HTML pages; found ${pages.length}.`,
  );
}

let pagesWithMeta = 0;
let checkedInlineScripts = 0;
let checkedStyleAttributes = 0;
for (const pagePath of pages) {
  const html = await readFile(pagePath, "utf8");
  const metaMatch = html.match(
    /<meta\b(?=[^>]*\bhttp-equiv="content-security-policy")[^>]*\bcontent="([^"]*)"[^>]*>/i,
  );
  const metaCount = [
    ...html.matchAll(/<meta\b[^>]*http-equiv="content-security-policy"/gi),
  ].length;
  const inlineScripts = [
    ...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi),
  ].filter((match) => isExecutableInlineScript(match[1] ?? ""));

  if (!metaMatch) {
    throw new Error(
      `${path.relative(clientDir, pagePath)} has no CSP meta policy.`,
    );
  }

  pagesWithMeta += 1;
  const metaIndex = html.indexOf(metaMatch[0]);
  const headMatch = html.match(/<head\b[^>]*>/i);
  const headEnd = headMatch ? headMatch.index + headMatch[0].length : -1;
  const charsetMatch = html.match(/<meta\b[^>]*\bcharset\s*=[^>]*>/i);
  const earliestMeta = charsetMatch
    ? charsetMatch.index + charsetMatch[0].length
    : headEnd;
  const firstResource = html.search(
    /<(?:link|script|style|img|video|audio|iframe|source)\b/i,
  );
  if (
    metaCount !== 1 ||
    earliestMeta < 0 ||
    metaIndex < earliestMeta ||
    metaIndex > firstResource
  ) {
    throw new Error(
      `${path.relative(clientDir, pagePath)} must have one CSP meta after charset and before resource loads.`,
    );
  }
  const scriptSrc = decodeAttribute(metaMatch[1] ?? "")
    .split(";")
    .map((directive) => directive.trim())
    .find((directive) => directive.startsWith("script-src "));
  if (!scriptSrc) {
    throw new Error(
      `${path.relative(clientDir, pagePath)} has no script-src directive.`,
    );
  }
  const metaDirectives = decodeAttribute(metaMatch[1] ?? "")
    .split(";")
    .map((directive) => directive.trim());
  if (/'unsafe-(?:inline|eval)'/.test(metaDirectives.join("; "))) {
    throw new Error(
      `${path.relative(clientDir, pagePath)} must not use unsafe-inline or unsafe-eval.`,
    );
  }
  const styleSrc = metaDirectives.find((directive) =>
    directive.startsWith("style-src "),
  );
  const styleAttrSrc = metaDirectives.find((directive) =>
    directive.startsWith("style-src-attr "),
  );
  if (
    !styleSrc ||
    /'unsafe-(?:inline|eval)'/.test(styleSrc) ||
    /'unsafe-(?:inline|eval)'/.test(styleAttrSrc ?? "") ||
    !styleAttrSrc?.includes("'unsafe-hashes'")
  ) {
    throw new Error(
      `${path.relative(clientDir, pagePath)} must use hashes for style elements and emitted style attributes.`,
    );
  }
  if (/'unsafe-(?:inline|eval)'/.test(scriptSrc)) {
    throw new Error(
      `${path.relative(clientDir, pagePath)} weakens script-src with an unsafe directive.`,
    );
  }
  if (/\bframe-ancestors\b/i.test(metaMatch[1] ?? "")) {
    throw new Error(
      "frame-ancestors must remain in the HTTP header, not CSP meta.",
    );
  }

  const allowedHashes = new Set(
    [...scriptSrc.matchAll(/'sha256-([A-Za-z0-9+/=]+)'/g)].map(
      (match) => match[1],
    ),
  );
  const allowedStyleAttributeHashes = new Set(
    [...(styleAttrSrc ?? "").matchAll(/'sha256-([A-Za-z0-9+/=]+)'/g)].map(
      (match) => match[1],
    ),
  );
  const allowedStyleElementHashes = new Set(
    [...styleSrc.matchAll(/'sha256-([A-Za-z0-9+/=]+)'/g)].map(
      (match) => match[1],
    ),
  );
  for (const expectedHash of await collectInlineStyleElementHashes(html)) {
    if (!allowedStyleElementHashes.has(expectedHash)) {
      throw new Error(
        `${path.relative(clientDir, pagePath)} is missing the hash for an emitted style element.`,
      );
    }
  }
  for (const expectedHash of await collectInlineStyleAttributeHashes(html)) {
    checkedStyleAttributes += 1;
    if (!allowedStyleAttributeHashes.has(expectedHash)) {
      throw new Error(
        `${path.relative(clientDir, pagePath)} is missing the hash for an emitted style attribute.`,
      );
    }
  }
  for (const script of inlineScripts) {
    checkedInlineScripts += 1;
    if (script.index < metaIndex) {
      throw new Error(
        `${path.relative(clientDir, pagePath)} has an executable inline script before its CSP meta policy.`,
      );
    }
    const expectedHash = createHash("sha256")
      .update(script[2] ?? "", "utf8")
      .digest("base64");
    if (!allowedHashes.has(expectedHash)) {
      throw new Error(
        `${path.relative(clientDir, pagePath)} is missing the hash for an emitted inline script.`,
      );
    }
  }
}

console.log(
  `Static CSP verified: ${pages.length} HTML files, ${pagesWithMeta} CSP meta policies, ${checkedInlineScripts} inline scripts and ${checkedStyleAttributes} inline style attributes hash-authorized.`,
);
