import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies, url }) => {
  const origin = request.headers.get("origin");
  if (!origin || origin !== url.origin) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (declaredLength > 16 * 1024) {
      return new Response("Payload too large", { status: 413 });
    }
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > 16 * 1024) {
      return new Response("Payload too large", { status: 413 });
    }
    const body = JSON.parse(rawBody);
    const accessToken = body?.accessToken;
    const refreshToken = body?.refreshToken;

    if (
      typeof accessToken !== "string" ||
      accessToken.length === 0 ||
      accessToken.length > 8 * 1024 ||
      typeof refreshToken !== "string" ||
      refreshToken.length === 0 ||
      refreshToken.length > 4 * 1024
    ) {
      return new Response("Missing tokens", { status: 400 });
    }

    cookies.set("sb-access-token", accessToken, {
      path: "/",
      httpOnly: true,
      secure: url.protocol === "https:",
      sameSite: "lax",
      maxAge: 60 * 60,
    });

    cookies.set("sb-refresh-token", refreshToken, {
      path: "/",
      httpOnly: true,
      secure: url.protocol === "https:",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return new Response("OK", { status: 200 });
  } catch {
    return new Response("Invalid request", { status: 400 });
  }
};

export const prerender = false;
