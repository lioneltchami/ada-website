import type { APIRoute } from 'astro';
import { z } from 'zod';

const Schema = z.object({
  email: z.string().email(),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = Schema.parse(body);

    // TODO: Connect to Supabase newsletter_subscribers table
    // TODO: Send confirmation email via Resend
    console.log(`[newsletter] New subscriber: ${email}`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const prerender = false;
