import type { APIRoute } from 'astro';
import { z } from 'zod';

const Schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const data = Schema.parse(body);

    // TODO: Store in Supabase contacts table
    // TODO: Send notification email via Resend to info@apotidev.org
    console.log(`[contact] From: ${data.name} <${data.email}> Subject: ${data.subject}`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Invalid submission' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const prerender = false;
