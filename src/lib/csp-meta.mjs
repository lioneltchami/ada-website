function decodeAttribute(value) {
  return value.replace(/&(?:amp|quot|apos|#39|#x27|lt|gt);/gi, (entity) => {
    const decoded = {
      "&amp;": "&",
      "&quot;": '"',
      "&apos;": "'",
      "&#39;": "'",
      "&#x27;": "'",
      "&lt;": "<",
      "&gt;": ">",
    }[entity.toLowerCase()];
    return decoded ?? entity;
  });
}

async function sha256Base64(value) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return btoa(String.fromCharCode(...new Uint8Array(digest)));
}

/** Hash exact emitted style attributes after HTML parsing. */
export async function collectInlineStyleAttributeHashes(html) {
  const markup = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  const hashes = new Set();
  for (const match of markup.matchAll(
    /<[a-z][^>]*?\sstyle\s*=\s*(["'])(.*?)\1/gi,
  )) {
    hashes.add(await sha256Base64(decodeAttribute(match[2] ?? "")));
  }
  return [...hashes];
}

/** Hash inline <style> bodies for a per-response style-src allowlist. */
export async function collectInlineStyleElementHashes(html) {
  const markup = html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
  const hashes = new Set();
  for (const match of markup.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    hashes.add(await sha256Base64(match[1] ?? ""));
  }
  return [...hashes];
}

function hashSources(directive, hashes) {
  const base = directive.split(/\s+/);
  const sources = new Set(base.slice(1));
  for (const hash of hashes) sources.add(`'sha256-${hash}'`);
  return [base[0], ...sources].join(" ");
}

/**
 * Put a complete per-document policy at the start of <head> and authorize only
 * the inline script/style bytes actually emitted in that document. Astro's
 * generated meta is preserved as the source allowlist when it exists; static
 * brochure HTML can pass the shared base directives to receive the same policy.
 */
export async function normalizeCspMetaPolicy(html, baseDirectives = []) {
  const existingMeta = html.match(
    /<meta\b[^>]*http-equiv="content-security-policy"[^>]*>/i,
  )?.[0];
  const existingContent = existingMeta?.match(/\bcontent="([^"]*)"/i)?.[1];
  const directives = (
    existingContent ? existingContent.split(";") : baseDirectives
  )
    .map((directive) => directive.trim())
    .filter(
      (directive) => directive && !directive.startsWith("frame-ancestors "),
    );

  if (!directives.length) return html;

  const inlineScripts = [];
  for (const match of html.matchAll(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
  )) {
    if (/\s+src\s*=/i.test(match[1] ?? "")) continue;
    inlineScripts.push(await sha256Base64(match[2] ?? ""));
  }
  const styleElementHashes = await collectInlineStyleElementHashes(html);
  const styleAttributeHashes = await collectInlineStyleAttributeHashes(html);
  const scriptIndex = directives.findIndex((directive) =>
    directive.startsWith("script-src "),
  );
  if (scriptIndex >= 0)
    directives[scriptIndex] = hashSources(
      directives[scriptIndex],
      inlineScripts,
    );
  const styleIndex = directives.findIndex((directive) =>
    directive.startsWith("style-src "),
  );
  if (styleIndex >= 0) {
    const safeStyleDirective = directives[styleIndex]
      .split(/\s+/)
      .filter((source) => source !== "'unsafe-inline'")
      .join(" ");
    directives[styleIndex] = hashSources(
      safeStyleDirective,
      styleElementHashes,
    );
  }

  const styleAttrSources = [
    "style-src-attr",
    "'unsafe-hashes'",
    ...styleAttributeHashes.map((hash) => `'sha256-${hash}'`),
  ];
  const styleAttrIndex = directives.findIndex((directive) =>
    directive.startsWith("style-src-attr "),
  );
  if (styleAttrIndex >= 0) directives.splice(styleAttrIndex, 1);
  directives.push(styleAttrSources.join(" "));

  const meta = `<meta http-equiv="Content-Security-Policy" content="${directives.join("; ")}">`;
  const withoutOldMeta = existingMeta ? html.replace(existingMeta, "") : html;
  const charsetTag = withoutOldMeta.match(
    /<meta\b[^>]*\bcharset\s*=[^>]*>/i,
  )?.[0];
  if (charsetTag) {
    return withoutOldMeta.replace(charsetTag, `${charsetTag}${meta}`);
  }
  return withoutOldMeta.replace(/<head\b[^>]*>/i, (head) => `${head}${meta}`);
}
