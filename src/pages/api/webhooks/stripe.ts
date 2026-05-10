import type { APIRoute } from "astro";

const WEBHOOK_SECRET = (import.meta as any).env?.STRIPE_WEBHOOK_SECRET;

async function verifySignature(payload: string, header: string, secret: string): Promise<boolean> {
  // Extract timestamp and all v1 signatures
  const timestamp = header.split(',').find(p => p.startsWith('t='))?.slice(2);
  const signatures = header.split(',').filter(p => p.startsWith('v1=')).map(p => p.slice(3));
  if (!timestamp || signatures.length === 0) return false;

  // Reject timestamps older than 5 minutes
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const expected = new Uint8Array(signed);

  for (const signature of signatures) {
    if (!signature.match(/^[0-9a-f]+$/i) || signature.length % 2 !== 0) continue;
    const received = new Uint8Array(signature.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
    if (expected.byteLength !== received.byteLength) continue;
    // Constant-time comparison
    let diff = 0;
    for (let i = 0; i < expected.byteLength; i++) diff |= expected[i] ^ received[i];
    if (diff === 0) return true;
  }
  return false;
}

export const POST: APIRoute = async ({ request }) => {
  const sigHeader = request.headers.get("stripe-signature");
  if (!sigHeader || !WEBHOOK_SECRET) {
    return new Response("Bad request", { status: 400 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 1024 * 1024) {
    return new Response("Payload too large", { status: 413 });
  }

  const body = await request.text();
  const valid = await verifySignature(body, sigHeader, WEBHOOK_SECRET);
  if (!valid) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);

  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object;
      console.log(`[webhook] payment_intent.succeeded: ${pi.id} amount=${pi.amount}`);
      break;
    }
    case "invoice.payment_succeeded": {
      const invoice = event.data.object;
      console.log(`[webhook] invoice.payment_succeeded: ${invoice.id} subscription=${invoice.subscription}`);
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" } });
};

export const prerender = false;
