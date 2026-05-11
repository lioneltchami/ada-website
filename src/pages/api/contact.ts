import type { APIRoute } from 'astro';
import { z } from 'zod';
import { sendContactNotification } from '../../lib/email';

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

    await sendContactNotification(data);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return new Response(JSON.stringify({ error: 'Invalid submission' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'Failed to send message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const prerender = false;
