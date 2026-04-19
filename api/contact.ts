function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || 'UNSAID <onboarding@resend.dev>';

  if (!resendApiKey) {
    return Response.json({ error: 'Server email is not configured yet.' }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (!email || !message) {
    return Response.json({ error: 'Email and message are required.' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: ['unsaidburden@gmail.com'],
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

    const payload = await resendResponse.json().catch(() => null);

    if (!resendResponse.ok) {
      return Response.json(
        { error: payload?.message || payload?.error || 'Resend rejected the request.' },
        { status: 502 },
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return Response.json({ error: 'Failed to send your message right now.' }, { status: 500 });
  }
}
