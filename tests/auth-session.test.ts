import { describe, expect, it, vi } from "vitest";
import { POST } from "../src/pages/api/auth/set-session";

function call(body: string, headers: HeadersInit = {}) {
  const set = vi.fn();
  return {
    set,
    response: POST({
      request: new Request("https://apotidev.org/api/auth/set-session", {
        method: "POST",
        headers: { origin: "https://apotidev.org", ...headers },
        body,
      }),
      cookies: { set },
      url: new URL("https://apotidev.org/api/auth/set-session"),
    } as any),
  };
}

describe("auth session cookie endpoint", () => {
  it("rejects non-string tokens without setting cookies", async () => {
    const { response, set } = call(
      JSON.stringify({ accessToken: 123, refreshToken: "refresh" }),
    );
    expect((await response).status).toBe(400);
    expect(set).not.toHaveBeenCalled();
  });

  it("rejects oversized bodies before parsing", async () => {
    const { response, set } = call("{}", { "content-length": "20000" });
    expect((await response).status).toBe(413);
    expect(set).not.toHaveBeenCalled();
  });

  it("sets bounded tokens as HTTP-only cookies for same-origin requests", async () => {
    const { response, set } = call(
      JSON.stringify({ accessToken: "access", refreshToken: "refresh" }),
    );
    expect((await response).status).toBe(200);
    expect(set).toHaveBeenCalledTimes(2);
    expect(set).toHaveBeenCalledWith(
      "sb-access-token",
      "access",
      expect.objectContaining({ httpOnly: true }),
    );
  });
});
