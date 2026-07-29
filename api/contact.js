const RESEND_ENDPOINT = "https://api.resend.com/emails";
const CONTACT_RECIPIENT = "brian@goodbusinesshq.com";
const CONTACT_SENDER = "Good Business <hello@goodbusinesshq.com>";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("Contact form: RESEND_API_KEY is not configured.");
    return res.status(503).json({ error: "Email is temporarily unavailable." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

    // Honeypot fields are invisible to people but commonly filled by bots.
    if (body.website) {
      return res.status(200).json({ ok: true });
    }

    const name = cleanText(body.name, 100);
    const company = cleanText(body.company, 140);
    const email = cleanText(body.email, 254).toLowerCase();
    const message = cleanText(body.message, 3000);

    if (!name || !company || !isValidEmail(email) || !message) {
      return res.status(400).json({ error: "Please complete every field with a valid email." });
    }

    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: CONTACT_SENDER,
        to: [CONTACT_RECIPIENT],
        reply_to: email,
        subject: `Good Business inquiry — ${company}`,
        html: createEmailHtml({ name, company, email, message }),
        text: createEmailText({ name, company, email, message }),
      }),
    });

    const result = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
      console.error("Contact form: Resend rejected the email.", {
        status: resendResponse.status,
        message: result?.message,
      });
      return res.status(502).json({ error: "We couldn't send that message. Please try again." });
    }

    return res.status(200).json({ ok: true, id: result.id });
  } catch (error) {
    console.error("Contact form submission failed.", error);
    return res.status(500).json({ error: "We couldn't send that message. Please try again." });
  }
}

function cleanText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.replace(/\0/g, "").trim().slice(0, maxLength);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createEmailHtml({ name, company, email, message }) {
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");

  return `
    <div style="background:#f4f1eb;padding:40px 20px;font-family:Arial,sans-serif;color:#171714">
      <div style="max-width:620px;margin:0 auto;background:#ffffff;padding:36px;border:1px solid #dedad2">
        <p style="margin:0 0 28px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#837d73">New website inquiry</p>
        <h1 style="margin:0 0 30px;font-size:28px;line-height:1.15">A note from ${escapeHtml(name)}</h1>
        <table style="width:100%;border-collapse:collapse;margin-bottom:28px;font-size:15px">
          <tr><td style="padding:10px 0;border-bottom:1px solid #ece8e1;color:#837d73">Company</td><td style="padding:10px 0;border-bottom:1px solid #ece8e1;text-align:right">${escapeHtml(company)}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #ece8e1;color:#837d73">Email</td><td style="padding:10px 0;border-bottom:1px solid #ece8e1;text-align:right"><a href="mailto:${escapeHtml(email)}" style="color:#171714">${escapeHtml(email)}</a></td></tr>
        </table>
        <div style="font-size:16px;line-height:1.65">${safeMessage}</div>
        <p style="margin:32px 0 0;padding-top:20px;border-top:1px solid #ece8e1;font-size:12px;color:#837d73">Reply directly to this email to respond to ${escapeHtml(name)}.</p>
      </div>
    </div>`;
}

function createEmailText({ name, company, email, message }) {
  return `New Good Business website inquiry

Name: ${name}
Company: ${company}
Email: ${email}

What's not working:
${message}

Reply directly to this email to respond to ${name}.`;
}
