// Vercel serverless function — POST /api/contact
// Sends the modal form submission to brian@goodbusinesshq.com via Resend.
// Requires env var RESEND_API_KEY to be set in the Vercel project settings.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);

const TO = 'briantraudt@gmail.com';
const FROM = 'Good Business <hello@goodbusinesshq.com>';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vercel auto-parses JSON bodies when Content-Type is application/json.
  // Fall back to manual parse if a client sends it as a string.
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return res.status(400).json({ error: 'Input too long' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY not set');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const subject = `New project inquiry — ${name}`;
  const text =
    `New project inquiry\n\n` +
    `From: ${name}\n` +
    `Email: ${email}\n\n` +
    `${message}\n`;

  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;color:#111111;padding:24px">
  <h2 style="margin:0 0 20px;font-size:20px;font-weight:600;letter-spacing:-0.01em">New project inquiry</h2>
  <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
    <tr>
      <td style="padding:6px 16px 6px 0;color:#8A8A86;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;vertical-align:top;width:80px">From</td>
      <td style="padding:6px 0;font-size:15px;color:#111111">${escapeHtml(name)}</td>
    </tr>
    <tr>
      <td style="padding:6px 16px 6px 0;color:#8A8A86;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;vertical-align:top">Email</td>
      <td style="padding:6px 0;font-size:15px"><a href="mailto:${escapeHtml(email)}" style="color:#2E6BE6;text-decoration:none">${escapeHtml(email)}</a></td>
    </tr>
  </table>
  <div style="border-top:1px solid #E0E0DA;padding-top:20px;white-space:pre-wrap;font-size:15px;line-height:1.55;color:#111111">${escapeHtml(message)}</div>
</div>`.trim();

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: TO,
        reply_to: email,
        subject,
        html,
        text,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error('Resend API error:', r.status, detail);
      return res.status(502).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('contact handler error:', err);
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
