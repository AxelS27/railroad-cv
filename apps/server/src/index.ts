import { serve } from '@hono/node-server';
import { Hono } from 'hono';

export const app = new Hono().basePath('/api/v1');

app.get('/health', (c) => c.json({ data: { status: 'ok' } }));

const port = Number(process.env.PORT ?? 3000);

serve({
  fetch: app.fetch,
  port,
});
