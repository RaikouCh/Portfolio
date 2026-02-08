const { google } = require('googleapis');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Read .env file directly
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && !key.startsWith('#')) {
    env[key.trim()] = value?.trim();
  }
});

const CLIENT_ID = env.CLIENT_ID;
const CLIENT_SECRET = env.CLIENT_SECRET;
const REDIRECT_URI = env.REDIRECT_URI || 'urn:ietf:wg:oauth:2.0:oob';

// Validate credentials
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('\n❌ Error: CLIENT_ID or CLIENT_SECRET missing in .env\n');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Generate authorization URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/gmail.send'],
});

console.log('\n========================================');
console.log('Gmail OAuth2 Authorization Setup');
console.log('========================================\n');
console.log('1. Visit this URL in your browser:\n');
console.log(authUrl);
console.log('\n2. Authorize the application');
console.log('3. Copy the authorization code\n');

rl.question('Paste your authorization code here: ', async (authCode) => {
  try {
    // Exchange authorization code for tokens
    const { tokens } = await oAuth2Client.getToken(authCode);

    if (!tokens.refresh_token) {
      console.error(
        '\n❌ Error: No refresh token received.\n' +
        'Make sure you:\n' +
        '- Selected "Offline" access\n' +
        '- Authorized with the correct Gmail account\n'
      );
      rl.close();
      process.exit(1);
    }

    // Update .env with the refresh token
    let updatedEnv = fs.readFileSync(envPath, 'utf-8');
    updatedEnv = updatedEnv.replace(
      /REFRESH_TOKEN=.*/,
      `REFRESH_TOKEN=${tokens.refresh_token}`
    );
    fs.writeFileSync(envPath, updatedEnv);

    console.log('\n✅ Success!\n');
    console.log('Refresh token saved to .env file:');
    console.log(`REFRESH_TOKEN=${tokens.refresh_token}\n`);
    console.log('You can now use: npm start\n');

    rl.close();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error getting token:', err.message);
    console.error('Make sure your CLIENT_ID and CLIENT_SECRET in .env are correct.\n');
    rl.close();
    process.exit(1);
  }
});
