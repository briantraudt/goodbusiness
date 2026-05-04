const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ESC[char as keyof typeof ESC]);

const TO = "briantraudt@gmail.com";
const FROM = "Good Business <hello@goodbusinesshq.com>";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !email || !message) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return Response.json({ error: "Input too long" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Email service not configured" }, { status: 500 });
  }

  const subject = `New project inquiry - ${name}`;
  const text = `New project inquiry\n\nFrom: ${name}\nEmail: ${email}\n\n${message}\n`;
  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;color:#111;padding:24px">
  <h2 style="margin:0 0 20px;font-size:20px;font-weight:600">New project inquiry</h2>
  <p><strong>From:</strong> ${escapeHtml(name)}</p>
  <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
  <div style="border-top:1px solid #e0e0da;padding-top:20px;white-space:pre-wrap">${escapeHtml(message)}</div>
</div>`.trim();

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: FROM,
      to: TO,
      reply_to: email,
      subject,
      html,
      text
    })
  });

  if (!response.ok) {
    return Response.json({ error: "Failed to send email" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
