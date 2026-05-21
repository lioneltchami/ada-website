import { isAllowedOrigin } from "./origin";

export const DEFAULT_MAX_BODY_SIZE = 10 * 1024;

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function rejectInvalidOrigin(request: Request, requestUrl: string, configuredOrigin?: string): Response | null {
  const origin = request.headers.get("origin");
  if (isAllowedOrigin(origin, new URL(requestUrl).origin, configuredOrigin)) return null;
  return jsonResponse({ error: "Forbidden" }, 403);
}

export function rejectOversizedBody(request: Request, maxBodySize = DEFAULT_MAX_BODY_SIZE): Response | null {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength <= maxBodySize) return null;
  return jsonResponse({ error: "Payload too large" }, 413);
}

export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new Error("INVALID_JSON");
  }
}
