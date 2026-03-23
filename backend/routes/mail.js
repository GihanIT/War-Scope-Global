// backend/routes/mail.js
// Register in server.js:
//   const mail = require('./routes/mail');
//   app.use('/api/mail', mail);

'use strict';

const { Router }     = require('express');
const nodemailer     = require('nodemailer');
const router         = Router();

// ── Transporter (created once, reused) ───────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, // info.warscope@gmail.com
    pass: process.env.MAIL_PASS, // Gmail App Password
  },
});

// ── Rate limiting — max 10 emails per hour per IP ────────────────────────────
const _sent = new Map();
function rateLimit(ip) {
  const now    = Date.now();
  const window = 3600000; // 1 hour
  const max    = 10;
  const hits   = (_sent.get(ip) ?? []).filter(t => now - t < window);
  if (hits.length >= max) return false;
  _sent.set(ip, [...hits, now]);
  return true;
}

// ── Sanitize input ────────────────────────────────────────────────────────────
function sanitize(str = '', max = 2000) {
  return String(str).replace(/<[^>]*>/g, '').slice(0, max).trim();
}

// ── POST /api/mail/contact ────────────────────────────────────────────────────
router.post('/contact', async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] ?? req.socket.remoteAddress;

  if (!rateLimit(ip)) {
    return res.status(429).json({ ok: false, error: 'Too many requests. Try again later.' });
  }

  const name    = sanitize(req.body.name,    80);
  const email   = sanitize(req.body.email,   120);
  const subject = sanitize(req.body.subject, 100);
  const message = sanitize(req.body.message, 2000);

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Name, email and message are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Invalid email address.' });
  }
  if (message.length < 10) {
    return res.status(400).json({ ok: false, error: 'Message too short.' });
  }

  const mailOpts = {
    from:     `"WarScope Contact" <${process.env.MAIL_USER}>`,
    to:       process.env.MAIL_TO,
    replyTo:  email,
    subject:  `[WarScope Contact] ${subject || 'General Enquiry'} — ${name}`,
    text: `
New contact form submission from warscopeglobal.com

──────────────────────────────────────
NAME:    ${name}
EMAIL:   ${email}
SUBJECT: ${subject || 'General Enquiry'}
──────────────────────────────────────

MESSAGE:
${message}

──────────────────────────────────────
Sent from: WarScope Contact Form
IP: ${ip}
Time: ${new Date().toUTCString()}
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#04040a;font-family:'Segoe UI',Arial,sans-serif">
  <div style="max-width:580px;margin:32px auto;background:#0a0c14;border:1px solid #1e2433;border-radius:10px;overflow:hidden">
    <div style="background:linear-gradient(135deg,#0a0c14,#0d1120);padding:24px 28px;border-bottom:1px solid #1e2433">
      <div style="font-size:11px;letter-spacing:.18em;color:#00d4ff;text-transform:uppercase;margin-bottom:8px;font-family:monospace">WarScope — Contact Form</div>
      <div style="font-size:22px;font-weight:700;color:#e8eaf0">${subject || 'General Enquiry'}</div>
    </div>
    <div style="padding:28px">
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        ${[['Name', name], ['Email', `<a href="mailto:${email}" style="color:#00d4ff">${email}</a>`], ['Subject', subject || 'General Enquiry']].map(([k,v]) => `
        <tr>
          <td style="font-size:10px;letter-spacing:.12em;color:#4a5568;text-transform:uppercase;padding:8px 0;border-bottom:1px solid #161b2e;width:90px;font-family:monospace">${k}</td>
          <td style="font-size:14px;color:#e8eaf0;padding:8px 0 8px 16px;border-bottom:1px solid #161b2e">${v}</td>
        </tr>`).join('')}
      </table>
      <div style="font-size:11px;letter-spacing:.12em;color:#4a5568;text-transform:uppercase;margin-bottom:10px;font-family:monospace">Message</div>
      <div style="background:#04040a;border:1px solid #161b2e;border-radius:6px;padding:16px 18px;font-size:14px;color:#c8cad4;line-height:1.75;white-space:pre-wrap">${message}</div>
    </div>
    <div style="padding:16px 28px;border-top:1px solid #161b2e;font-size:11px;color:#2d3748;font-family:monospace;letter-spacing:.06em">
      Sent ${new Date().toUTCString()} · IP ${ip}
    </div>
  </div>
</body>
</html>
    `,
  };

  try {
    await transporter.sendMail(mailOpts);
    console.log(`[mail] Contact email sent from ${email}`);
    res.json({ ok: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('[mail] Send failed:', err.message);
    res.status(500).json({ ok: false, error: 'Failed to send email. Please try again or email us directly.' });
  }
});

// ── POST /api/mail/contribute ─────────────────────────────────────────────────
router.post('/contribute', async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] ?? req.socket.remoteAddress;

  if (!rateLimit(ip)) {
    return res.status(429).json({ ok: false, error: 'Too many requests. Try again later.' });
  }

  const name        = sanitize(req.body.name,        80);
  const email       = sanitize(req.body.email,       120);
  const country     = sanitize(req.body.country,     80);
  const dataset     = sanitize(req.body.dataset,     80);
  const source      = sanitize(req.body.source,      500);
  const data        = sanitize(req.body.data,        5000);
  const expertise   = sanitize(req.body.expertise,   200);
  const language    = sanitize(req.body.language,    100);
  const notes       = sanitize(req.body.notes,       1000);

  if (!country || !dataset || !data) {
    return res.status(400).json({ ok: false, error: 'Country, dataset and data are required.' });
  }

  const fields = [
    ['Contributor Name',  name    || '(anonymous)'],
    ['Email',             email   || '(not provided)'],
    ['Country',           country],
    ['Dataset',           dataset],
    ['Language',          language || '(not specified)'],
    ['Expertise',         expertise || '(not specified)'],
    ['Source / Citation', source  || '(not provided)'],
  ];

  const mailOpts = {
    from:    `"WarScope Data" <${process.env.MAIL_USER}>`,
    to:      process.env.MAIL_TO,
    replyTo: email || process.env.MAIL_USER,
    subject: `[WarScope DATA] ${country} — ${dataset}`,
    text: `
New data contribution from warscopeglobal.com/contribute

${fields.map(([k,v]) => `${k.padEnd(22)}: ${v}`).join('\n')}

──────────────────────────────────────
DATA SUBMITTED:
${data}

──────────────────────────────────────
ADDITIONAL NOTES:
${notes || '(none)'}

──────────────────────────────────────
Sent: ${new Date().toUTCString()}
IP: ${ip}
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#04040a;font-family:'Segoe UI',Arial,sans-serif">
  <div style="max-width:640px;margin:32px auto;background:#0a0c14;border:1px solid #1e2433;border-radius:10px;overflow:hidden">
    <div style="background:linear-gradient(135deg,#0d1120,#0a1628);padding:24px 28px;border-bottom:1px solid #1e2433">
      <div style="font-size:11px;letter-spacing:.18em;color:#00d4ff;text-transform:uppercase;margin-bottom:8px;font-family:monospace">WarScope — Data Contribution</div>
      <div style="font-size:22px;font-weight:700;color:#e8eaf0">${country} · ${dataset}</div>
    </div>
    <div style="padding:28px">
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        ${fields.map(([k,v]) => `
        <tr>
          <td style="font-size:10px;letter-spacing:.12em;color:#4a5568;text-transform:uppercase;padding:8px 0;border-bottom:1px solid #161b2e;width:140px;font-family:monospace">${k}</td>
          <td style="font-size:14px;color:#e8eaf0;padding:8px 0 8px 16px;border-bottom:1px solid #161b2e">${v}</td>
        </tr>`).join('')}
      </table>
      <div style="font-size:11px;letter-spacing:.12em;color:#00d4ff;text-transform:uppercase;margin-bottom:10px;font-family:monospace">Data Submitted</div>
      <div style="background:#04040a;border:1px solid rgba(0,212,255,0.2);border-radius:6px;padding:16px 18px;font-size:13px;color:#7dd3fc;line-height:1.8;white-space:pre-wrap;font-family:monospace">${data}</div>
      ${notes ? `
      <div style="font-size:11px;letter-spacing:.12em;color:#4a5568;text-transform:uppercase;margin:20px 0 10px;font-family:monospace">Additional Notes</div>
      <div style="background:#04040a;border:1px solid #161b2e;border-radius:6px;padding:14px 18px;font-size:14px;color:#c8cad4;line-height:1.75">${notes}</div>
      ` : ''}
    </div>
    <div style="padding:16px 28px;border-top:1px solid #161b2e;font-size:11px;color:#2d3748;font-family:monospace;letter-spacing:.06em">
      Sent ${new Date().toUTCString()} · IP ${ip}
    </div>
  </div>
</body>
</html>
    `,
  };

  try {
    await transporter.sendMail(mailOpts);
    console.log(`[mail] Contribution email sent — ${country} / ${dataset}`);
    res.json({ ok: true, message: 'Contribution received. Thank you!' });
  } catch (err) {
    console.error('[mail] Contribute send failed:', err.message);
    res.status(500).json({ ok: false, error: 'Failed to send. Please email us directly at contact@warscopeglobal.com' });
  }
});

module.exports = router;