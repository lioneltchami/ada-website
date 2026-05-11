import type { APIRoute } from 'astro';
import { z } from 'zod';
import { sendNewsletterConfirmation } from '../../lib/email';

const Schema = z.object({
  email: z.string().email(),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = Schema.parse(body);

    await sendNewsletterConfirmation(email);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'Subscription failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const prerender = false;
