import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";
import { getCspPolicy, getGoatCounterEndpoint } from "../src/lib/csp-policy.mjs";

const endpoint = "https://ada-test.goatcounter.com/count";
const script = readFileSync(new URL("../public/scripts/goatcounter.js", import.meta.url), "utf8");

function emulate(path: string, options: { optedOut?: boolean; host?: string } = {}) {
  const calls: { url: URL; options: RequestInit }[] = [];
  const listeners = new Map<string, (event: unknown) => void>();
  const win = {};
  class Element {
    constructor(private href: string) {}
    closest() { return { href: this.href }; }
  }
  const location = new URL(path, "https://" + (options.host ?? "apotidev.org"));
  runInNewContext(script, {
    URL, location, Element, window: { top: win, self: win },
    navigator: { globalPrivacyControl: options.optedOut },
    document: {
      currentScript: { dataset: { endpoint } },
      visibilityState: "visible",
      addEventListener: (type: string, handler: (event: unknown) => void) => listeners.set(type, handler),
    },
    fetch: async (url: URL, options: RequestInit) => { calls.push({ url, options }); },
  });
  return { calls, click: (href: string, isTrusted = true) => listeners.get("click")?.({ isTrusted, target: new Element(href) }) };
}

describe("limited public GoatCounter metrics", () => {
  it("allows only the configured hosted collector path and does not load third-party scripts", () => {
    expect(getGoatCounterEndpoint(endpoint)).toBe(endpoint);
    for (const rejected of ["", "http://ada-test.goatcounter.com/count", "https://evil.example/count", endpoint + "?p=/test", "https://ada-test.goatcounter.com:8443/count", "https://ada-test.goatcounter.com.evil.test/count"]) expect(getGoatCounterEndpoint(rejected)).toBeNull();
    const policy = getCspPolicy({ PUBLIC_GOATCOUNTER_ENDPOINT: endpoint });
    expect(policy.directives.find(x => x.startsWith("connect-src "))).toContain(endpoint);
    expect(policy.scriptSources.join(" ")).not.toContain("goatcounter");
    expect(getCspPolicy().directives.join(" ")).not.toContain("goatcounter");
  });

  it("sends a clean public path and fixed event names with no referrer or credentials", () => {
    const { calls, click } = emulate("/fr/projects/?email=private@example.org");
    click("https://apotidev.org/fr/donate/?extra=private");
    click("https://wa.me/237676282346?text=private");
    click("https://apotidev.org/docs/projects/back-to-school/tor.pdf?filename=private");
    click("https://wa.me/?text=private");
    click("https://apotidev.org/fr/donate/", false);
    expect(calls.map(x => x.url.searchParams.get("p"))).toEqual(["/fr/projects/", "donate-click", "whatsapp-contact-click", "outreach-document-click"]);
    expect(calls.map(x => x.url.searchParams.get("e"))).toEqual([null, "true", "true", "true"]);
    for (const call of calls) {
      expect([...call.url.searchParams.keys()].every(k => ["p", "e", "rnd"].includes(k))).toBe(true);
      expect(call.options).toMatchObject({ credentials: "omit", referrerPolicy: "no-referrer" });
    }
  });

  it("does not measure sensitive routes, previews or Global Privacy Control visitors", () => {
    for (const path of ["/donate", "/fr/donate/merci", "/auth/login", "/fr/dashboard", "/api", "/account", "/preview/test", "/studio"]) expect(emulate(path).calls).toEqual([]);
    expect(emulate("/", { optedOut: true }).calls).toEqual([]);
    expect(emulate("/", { host: "ada-preview.workers.dev" }).calls).toEqual([]);
  });
});
