export const APPROVED_STORY_HERO =
	"https://cdn.sanity.io/images/rj2m21gk/production/02bd09413bd429a7cb9677a9368392642774671e-800x600.jpg";
export const APPROVED_ESTHER_PORTRAIT =
	"https://cdn.sanity.io/images/rj2m21gk/production/255a7b15b034d55c285edda099d7d1555b5ab347-600x900.jpg?w=400&auto=format";

const SITE_CHROME_IMAGES = new Set([
	"/brand/ada-symbol.png",
	"/brand/ada-logo.png",
	"https://apotidev.org/brand/ada-logo.png",
	"/favicon.png",
	"/favicon.png?v=4",
	"/brand/ada-primary-lockup.png",
	"https://apotidev.org/brand/ada-primary-lockup.png",
]);

function decodeHtml(value) {
	return value.replaceAll("&amp;", "&").replaceAll("&#38;", "&").replaceAll("&quot;", '"').replaceAll("&#39;", "'");
}

function parseAttributes(tag) {
	const start = tag.match(/^<[a-z][\w:-]*/i)?.[0];
	if (!start) throw new Error(`Invalid HTML start tag: ${tag.slice(0, 80)}`);
	const attrs = new Map();
	let i = start.length;
	while (i < tag.length) {
		while (/\s/.test(tag[i] || "")) i += 1;
		if (tag[i] === ">" || tag[i] === "/" || i >= tag.length) break;
		const nameStart = i;
		while (i < tag.length && !/[\s=/>]/.test(tag[i])) i += 1;
		if (i === nameStart) throw new Error(`Malformed attribute in HTML tag: ${tag.slice(0, 120)}`);
		const name = tag.slice(nameStart, i).toLowerCase();
		if (attrs.has(name)) throw new Error(`Duplicate HTML attribute '${name}' in ${tag.slice(0, 120)}`);
		while (/\s/.test(tag[i] || "")) i += 1;
		let value = "";
		if (tag[i] === "=") {
			i += 1;
			while (/\s/.test(tag[i] || "")) i += 1;
			const quote = tag[i] === '"' || tag[i] === "'" ? tag[i++] : "";
			const valueStart = i;
			if (quote) {
				while (i < tag.length && tag[i] !== quote) i += 1;
				if (tag[i] !== quote) throw new Error(`Unclosed quoted attribute '${name}'`);
				value = tag.slice(valueStart, i);
				i += 1;
			} else {
				while (i < tag.length && !/[\s>]/.test(tag[i])) i += 1;
				value = tag.slice(valueStart, i);
			}
		}
		attrs.set(name, decodeHtml(value));
	}
	return attrs;
}

function startTags(html, tagName) {
	const escaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const re = new RegExp(`<${escaped}(?=[\\s/>])(?:[^\"'<>]|\"[^\"]*\"|'[^']*')*>`, "gi");
	return [...html.replace(/<!--[\s\S]*?-->/g, "").matchAll(re)].map(([tag]) => tag);
}

function allStartTags(html) {
	const re = /<[a-z][\w:-]*(?=[\s/>])(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi;
	return [...html.replace(/<!--[\s\S]*?-->/g, "").matchAll(re)].map(([tag]) => tag);
}

function imgRecords(html) {
	return startTags(html, "img").map((tag) => ({ tag, attrs: parseAttributes(tag) }));
}

function isImageLikeUrl(value) {
	return /\.(?:avif|bmp|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i.test(value)
		|| /cdn\.sanity\.io\/images\/|images\.pexels\.com/i.test(value)
		|| /^data:image\//i.test(value);
}

function checkReference(reference, allowed, context) {
	const value = decodeHtml(reference.trim()).replace(/[.;]+$/, "");
	if (value && value !== "#" && !allowed.has(value)) {
		throw new Error(`Unapproved image reference in ${context}: ${value}`);
	}
}

function checkCssImageUrls(css, allowed, context) {
	const imageDeclarations = /(?:^|[;{}])\s*(?:background(?:-image)?|border-image(?:-source)?|list-style-image|mask(?:-image)?|clip-path|content|cursor)\s*:\s*([^;{}]*)/gi;
	for (const [, declaration] of css.matchAll(imageDeclarations)) {
		const urls = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]+))\s*\)/gi;
		for (const match of declaration.matchAll(urls)) {
			checkReference(match[1] ?? match[2] ?? match[3] ?? "", allowed, context);
		}
	}
}

/** Reject every non-whitelisted image reference, including metadata and lazy-load attributes. */
export function assertNoUnapprovedImageReferences(html, allowedImageUrls = []) {
	const allowed = new Set([...SITE_CHROME_IMAGES, ...allowedImageUrls]);
	const embeddedImageAllowed = SITE_CHROME_IMAGES;
	for (const { attrs } of imgRecords(html)) {
		const src = attrs.get("src");
		if (!src || !allowed.has(src)) throw new Error(`Unapproved Story <img> source: ${src || "missing src"}`);
		for (const attr of ["srcset", "data-src", "data-srcset", "data-original", "data-lazy-src"]) {
			if (attrs.has(attr)) throw new Error(`Unexpected image source attribute '${attr}' on Story image`);
		}
	}
	for (const tag of startTags(html, "source")) {
		const attrs = parseAttributes(tag);
		if (attrs.has("src") || attrs.has("srcset")) {
			throw new Error("Unexpected <source> image reference in Story markup");
		}
	}
	for (const tag of [...startTags(html, "meta"), ...startTags(html, "link")]) {
		const attrs = parseAttributes(tag);
		const property = (attrs.get("property") || attrs.get("name") || "").toLowerCase();
		const isSocialImage = property === "og:image" || property === "twitter:image";
		const isImagePreload = tag.startsWith("<link") && attrs.get("as") === "image";
		if (isSocialImage || isImagePreload) {
			const ref = attrs.get(isSocialImage ? "content" : "href");
			if (!ref || !allowed.has(ref)) throw new Error(`Unapproved image metadata reference: ${ref || "missing URL"}`);
		}
	}
	for (const tag of allStartTags(html)) {
		const tagName = tag.match(/^<([a-z][\w:-]*)/i)?.[1]?.toLowerCase();
		const attrs = parseAttributes(tag);
		for (const [name, value] of attrs) {
			if (name === "style") checkCssImageUrls(value, embeddedImageAllowed, `${tagName} style attribute`);
			const imageBearing = /^(?:data-(?:src|srcset|image|image-url|background|bg|poster|thumbnail)|background|poster|srcset)$/i.test(name)
				|| (tagName === "image" && /^(?:href|xlink:href)$/i.test(name));
			if (imageBearing) {
				for (const [reference] of value.matchAll(/(?:https?:\/\/[^\s"'<>),]+|\/\/[^\s"'<>),]+|\/(?!\/)[^\s"'<>),]+|data:image\/[^\s"'<>),]+)/gi)) {
					checkReference(reference, embeddedImageAllowed, `${tagName} ${name}`);
				}
			}
		}
	}
	for (const [, css] of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
		checkCssImageUrls(css, embeddedImageAllowed, "style element");
	}
	const normalized = decodeHtml(html);
	const urlPattern = /(?:https?:\/\/[^\s"'<>),]+|\/(?!\/)[^\s"'<>),]+|data:image\/[^\s"'<>),]+)/gi;
	for (const [raw] of normalized.matchAll(urlPattern)) {
		const ref = raw.replace(/[.;]+$/, "");
		if (isImageLikeUrl(ref) && !allowed.has(ref)) {
			throw new Error(`Unapproved image URL in Story markup: ${ref}`);
		}
	}
}

/** Allow Esther's confirmed portrait only on her existing index card or article. */
export function assertApprovedEstherPortrait(html, locale, placement) {
	const matches = imgRecords(html).filter(({ attrs }) => attrs.get("src") === APPROVED_ESTHER_PORTRAIT);
	if (!placement) {
		if (matches.length !== 0) throw new Error(`${locale} Story page has an unauthorized Esther portrait`);
		return null;
	}
	if (matches.length !== 1) throw new Error(`${locale} Esther ${placement} must contain exactly one confirmed portrait`);
	const [{ tag: portrait, attrs }] = matches;
	const expectedAlt = locale === "fr" || locale.toLowerCase() === "french" ? "Portrait d’Esther" : "Portrait of Esther";
	if (attrs.get("alt") !== expectedAlt) {
		throw new Error(`${locale} Esther portrait must use the confirmed asset and neutral localized alt text`);
	}
	const container = placement === "card"
		? html.match(/<a\b[^>]*href="\/(?:fr\/)?stories\/meet-esther-skills-training"[^>]*>[\s\S]*?<\/a>/i)?.[0]
		: html.match(/<article\b[^>]*>[\s\S]*?<\/article>/i)?.[0];
	if (!container?.includes(portrait)) throw new Error(`${locale} Esther portrait is outside its approved ${placement}`);
	return portrait;
}

/** Validate a rendered Story index: exactly one approved decorative hero, one Esther card portrait. */
export function assertApprovedStoryHero(html, locale) {
	const images = imgRecords(html);
	const heroes = images.filter(({ attrs }) => attrs.get("src") === APPROVED_STORY_HERO);
	if (heroes.length !== 1) {
		throw new Error(`${locale} Stories index must contain exactly one approved hero image; found ${heroes.length}`);
	}
	const [{ tag: hero, attrs }] = heroes;
	if (attrs.get("alt") !== "" || attrs.get("aria-hidden") !== "true") {
		throw new Error(`${locale} Stories hero must have an exact empty alt and aria-hidden=true`);
	}
	const heroSection = html.match(/<section\b[^>]*>[\s\S]*?<\/section>/gi)?.find((section) => section.includes(hero));
	if (!heroSection || !/relative[^"']*overflow-hidden[^"']*text-white/.test(heroSection)) {
		throw new Error(`${locale} approved image must appear only in the PageHero section`);
	}
	const portrait = assertApprovedEstherPortrait(html, locale, "card");
	assertNoUnapprovedImageReferences(html, [APPROVED_STORY_HERO, APPROVED_ESTHER_PORTRAIT]);
	return { hero, portrait };
}
