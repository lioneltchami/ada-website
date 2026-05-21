import type { APIRoute } from 'astro';
import { z } from 'zod';
import { sendContactNotification } from '../../lib/email';
import { jsonResponse, readJsonBody, rejectInvalidOrigin, rejectOversizedBody } from '../../lib/api-requests';

const PRIMARY_ORIGIN = import.meta.env.PUBLIC_SITE_URL;

const Schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  subject: z.string().trim().min(2).max(150),
  message: z.string().trim().min(10).max(5000),
});

export const POST: APIRoute = async ({ request, url }) => {
  const originError = rejectInvalidOrigin(request, url.href, PRIMARY_ORIGIN);
  if (originError) return originError;

  const sizeError = rejectOversizedBody(request);
  if (sizeError) return sizeError;

  try {
    const body = await readJsonBody(request);
    const data = Schema.parse(body);

    await sendContactNotification(data);

    return jsonResponse({ success: true });
  } catch (err: any) {
    if (err.message === 'INVALID_JSON') {
      return jsonResponse({ error: 'Invalid JSON' }, 400);
    }
    if (err.name === 'ZodError') {
      return jsonResponse({ error: 'Invalid submission' }, 400);
    }
    return jsonResponse({ error: 'Failed to send message' }, 500);
  }
};

export const prerender = false;
