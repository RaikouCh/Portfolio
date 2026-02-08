// server.js — Node backend to send contact form via Gmail API (OAuth2)
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Validate required envs
const REQUIRED = ['CLIENT_ID','CLIENT_SECRET','REFRESH_TOKEN','SENDER_EMAIL','TO_EMAIL'];
for (const k of REQUIRED) {
  if (!process.env[k]) {
    console.warn(`Warning: environment variable ${k} is not set.`);
  }
}

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI || 'urn:ietf:wg:oauth:2.0:oob'
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

function encodeMessage(message) {
  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/send-contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'name, email and message are required' });
  }

  // Email is FROM your account, TO your email
  // But Reply-To will be the form submitter's email
  const fromEmail = process.env.SENDER_EMAIL;
  const toEmail = process.env.TO_EMAIL || fromEmail;
  const replyToEmail = email; // Form submitter's email

  const subject = `Contact form message from ${name}`;
  const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

  const raw = [
    `From: ${fromEmail}`,
    `To: ${toEmail}`,
    `Reply-To: ${replyToEmail}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=UTF-8',
    '',
    body
  ].join('\n');

  const encodedMessage = encodeMessage(raw);

  try {
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage }
    });

    return res.json({ success: true, message: 'Message sent', id: result.data.id });
  } catch (err) {
    console.error('Gmail API error:', err?.message || err);
    const msg = err?.response?.data || err?.message || String(err);
    return res.status(500).json({ success: false, message: 'Gmail API error: ' + JSON.stringify(msg) });
  }
});

app.listen(PORT, () => {
  console.log(`Contact server listening on http://localhost:${PORT}`);
});
