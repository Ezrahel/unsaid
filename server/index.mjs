import 'dotenv/config';

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const isProduction = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT || 3000);
const app = express();

const RESEND_API_URL = 'https://api.resend.com/emails';
const CONTACT_RECIPIENT = 'unsaidburden@gmail.com';

app.use(express.json({ limit: '1mb' }));

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

app.post('/api/contact', async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || 'UNSAID <onboarding@resend.dev>';

  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message are required.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (!resendApiKey) {
    return res.status(500).json({ error: 'Server email is not configured yet.' });
  }

  try {
    const resendResponse = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [CONTACT_RECIPIENT],
        subject: `UNSAID message from ${email}`,
        reply_to: email,
        text: `New UNSAID message\n\nFrom: ${email}\n\nMessage:\n${message}`,
        html: `
          <h1>New UNSAID message</h1>
          <p><strong>From:</strong> ${escapeHtml(email)}</p>
          <p><strong>Message:</strong></p>
          <pre style="white-space: pre-wrap; font-family: sans-serif;">${escapeHtml(message)}</pre>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorPayload = await resendResponse.json().catch(() => null);
      const errorMessage =
        errorPayload?.message ||
        errorPayload?.error ||
        'Resend rejected the request.';

      return res.status(502).json({ error: errorMessage });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return res.status(500).json({ error: 'Failed to send your message right now.' });
  }
});

async function start() {
  if (!isProduction) {
    const vite = await createViteServer({
      root: rootDir,
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(rootDir, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`UNSAID server listening on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
