import type { APIRoute } from 'astro';
import { z } from 'zod';
import { sendNewsletterConfirmation } from '../../lib/email';
import { jsonResponse, readJsonBody, rejectInvalidOrigin, rejectOversizedBody } from '../../lib/api-requests';

const PRIMARY_ORIGIN = import.meta.env.PUBLIC_SITE_URL;

const Schema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export const POST: APIRoute = async ({ request, url }) => {
  const originError = rejectInvalidOrigin(request, url.href, PRIMARY_ORIGIN);
  if (originError) return originError;

  const sizeError = rejectOversizedBody(request);
  if (sizeError) return sizeError;

  try {
    const body = await readJsonBody(request);
    const { email } = Schema.parse(body);

    await sendNewsletterConfirmation(email);

    return jsonResponse({ success: true });
  } catch (err: any) {
    if (err.message === 'INVALID_JSON') {
      return jsonResponse({ error: 'Invalid JSON' }, 400);
    }
    if (err.name === 'ZodError') {
      return jsonResponse({ error: 'Invalid email' }, 400);
    }
    return jsonResponse({ error: 'Subscription failed' }, 500);
  }
};

export const prerender = false;
