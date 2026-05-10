import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies, url }) => {
  const origin = request.headers.get("origin");
  if (!origin || origin !== url.origin) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const { accessToken, refreshToken } = await request.json();

    if (!accessToken || !refreshToken) {
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
