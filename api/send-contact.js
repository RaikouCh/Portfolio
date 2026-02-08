// api/send-contact.js — Vercel Serverless Function for Gmail API
const { google } = require('googleapis');

// Enable CORS and allow POST requests
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, message } = req.body || {};

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'name, email and message are required'
    });
  }

  // Validate environment variables
  const REQUIRED = ['CLIENT_ID', 'CLIENT_SECRET', 'REFRESH_TOKEN', 'SENDER_EMAIL', 'TO_EMAIL'];
  const missing = REQUIRED.filter(k => !process.env[k]);
  if (missing.length > 0) {
    console.error(`Missing environment variables: ${missing.join(', ')}`);
    return res.status(500).json({
      success: false,
      message: 'Server configuration error'
    });
  }

  try {
    // Create OAuth2 client
    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI || 'https://developers.google.com/oauthplayground'
    );

    // Set refresh token
    oAuth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN
    });

    // Create Gmail client
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    // Prepare email
    const fromEmail = process.env.SENDER_EMAIL;
    const toEmail = process.env.TO_EMAIL || fromEmail;
    const replyToEmail = email;

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

    // Encode message to base64url format
    const encodedMessage = Buffer.from(raw)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Send email
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage }
    });

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      id: result.data.id
    });
  } catch (err) {
    console.error('Gmail API error:', err?.message || err);
    const errMsg = err?.response?.data?.error?.message || err?.message || String(err);
    return res.status(500).json({
      success: false,
      message: `Gmail API error: ${errMsg}`
    });
  }
}
