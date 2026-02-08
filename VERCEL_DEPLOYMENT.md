# Vercel Deployment Guide for Gmail Contact Form

## Setup Steps

### 1. **Get OAuth Credentials from Google Cloud Console**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Gmail API: Search for "Gmail API" and enable it
4. Create OAuth 2.0 credentials:
   - Type: Web Application
   - Authorized redirect URIs:
     - `https://developers.google.com/oauthplayground` (for getting refresh token)
     - `https://yourdomain.vercel.app/callback` (replace with your Vercel domain once deployed)
5. Copy: **Client ID** and **Client Secret**

### 2. **Get Refresh Token**

Run this locally to get the refresh token:

```bash
node getToken.js
```

This will:
1. Print a Google authorization URL
2. Open the link in your browser
3. Authorize the app
4. Return an authorization code
5. Exchange it for a **REFRESH_TOKEN**

Save this token — you'll need it for Vercel.

### 3. **Deploy to Vercel**

```bash
npm install -g vercel
vercel
```

### 4. **Set Environment Variables in Vercel Dashboard**

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Settings → Environment Variables
4. Add these variables:

```
CLIENT_ID=<your_client_id>
CLIENT_SECRET=<your_client_secret>
REFRESH_TOKEN=<your_refresh_token>
SENDER_EMAIL=<your_gmail_address>
TO_EMAIL=<where_to_receive_messages>
REDIRECT_URI=https://developers.google.com/oauthplayground
```

### 5. **Update Google Console**

Update your OAuth redirect URIs in [Google Cloud Console](https://console.cloud.google.com/):
- Add: `https://yourdomain.vercel.app/api/send-contact`

### 6. **Test It**

- Deploy a new version: `vercel --prod`
- Fill out your contact form
- Check your email!

## Local Development

Update `.env.local` with your credentials and run:

```bash
node server.js
```

Then visit `http://localhost:3000` and test the contact form.

## File Structure

- `api/send-contact.js` - Vercel serverless function (handles form submissions)
- `server.js` - Local development server (Express)
- `contacts.js` - Frontend (automatically detects prod vs local)
- `.env.local` - Local environment variables (ignored by Vercel)
- `vercel.json` - Vercel configuration

## Troubleshooting

**"Server configuration error"**
- Check all environment variables are set in Vercel dashboard

**"Gmail API error"**
- Refresh token may have expired
- Run `node getToken.js` again to get a new one

**CORS errors on frontend**
- The API endpoint already handles CORS

**"Messages not sending"**
- Check SENDER_EMAIL and TO_EMAIL are correct
- Verify "Less secure app access" is enabled (or use Gmail App Password)
