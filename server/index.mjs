import 'dotenv/config';

import express from 'express';
import net from 'net';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { addStory, incrementReaction, listStories } from './database.mjs';

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

function isPortAvailable(portToCheck) {
  return new Promise((resolve) => {
    const tester = net.createServer();

    tester.once('error', (error) => {
      resolve(error.code === 'EADDRINUSE' ? false : false);
    });

    tester.once('listening', () => {
      tester.close(() => resolve(true));
    });

    tester.listen(portToCheck);
  });
}

async function findOpenPort(startPort, attempts = 10) {
  for (let candidate = startPort; candidate < startPort + attempts; candidate += 1) {
    if (await isPortAvailable(candidate)) {
      return candidate;
    }
  }

  throw new Error(`No open port found between ${startPort} and ${startPort + attempts - 1}.`);
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

app.get('/api/stories', async (req, res) => {
  const limit = Number.parseInt(String(req.query.limit ?? '20'), 10);
  const offset = Number.parseInt(String(req.query.offset ?? '0'), 10);
  const emotion =
    typeof req.query.emotion === 'string' && req.query.emotion.trim()
      ? req.query.emotion.trim()
      : undefined;

  try {
    const stories = await listStories({
      limit: Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 20,
      offset: Number.isFinite(offset) ? Math.max(offset, 0) : 0,
      emotion,
    });

    return res.status(200).json({ stories });
  } catch (error) {
    console.error('Failed to fetch stories:', error);
    return res.status(500).json({ error: 'Failed to fetch stories.' });
  }
});

app.post('/api/stories', async (req, res) => {
  const content = typeof req.body?.content === 'string' ? req.body.content.trim() : '';
  const emotion = typeof req.body?.emotion === 'string' ? req.body.emotion.trim() : 'unspecified';
  const isPublic = Boolean(req.body?.isPublic);
  const authorId =
    typeof req.body?.authorId === 'string' && req.body.authorId.trim()
      ? req.body.authorId.trim()
      : undefined;

  if (!content) {
    return res.status(400).json({ error: 'Story content is required.' });
  }

  try {
    const id = await addStory({
      content,
      emotion: emotion || 'unspecified',
      isPublic,
      authorId,
    });

    return res.status(201).json({ ok: true, id });
  } catch (error) {
    console.error('Failed to save story:', error);
    return res.status(500).json({ error: 'Failed to save story.' });
  }
});

app.post('/api/stories/:storyId/reactions', async (req, res) => {
  const storyId = Number.parseInt(req.params.storyId, 10);
  const reactionType = typeof req.body?.reactionType === 'string' ? req.body.reactionType : '';

  if (!Number.isInteger(storyId) || storyId <= 0) {
    return res.status(400).json({ error: 'Invalid story id.' });
  }

  try {
    await incrementReaction(storyId, reactionType);
    return res.status(200).json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid reaction type') {
      return res.status(400).json({ error: error.message });
    }

    console.error('Failed to update reaction:', error);
    return res.status(500).json({ error: 'Failed to update reaction.' });
  }
});

async function start() {
  const resolvedPort = isProduction ? port : await findOpenPort(port);

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

  app.listen(resolvedPort, () => {
    if (!isProduction && resolvedPort !== port) {
      console.log(`Port ${port} is busy, using http://localhost:${resolvedPort} instead.`);
    }

    console.log(`UNSAID server listening on http://localhost:${resolvedPort}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
