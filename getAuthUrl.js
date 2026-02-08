const { google } = require("googleapis");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

// Read .env file directly
const envPath = path.join(__dirname, ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const [key, value] = line.split("=");
  if (key && !key.startsWith("#")) {
    env[key.trim()] = value?.trim();
  }
});

const CLIENT_ID = env.CLIENT_ID;
const CLIENT_SECRET = env.CLIENT_SECRET;
const REDIRECT_URI = "urn:ietf:wg:oauth:2.0:oob"; // Out-of-band - no URL registration needed

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("\n❌ Error: CLIENT_ID or CLIENT_SECRET missing in .env\n");
  process.exit(1);
}

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://www.googleapis.com/auth/gmail.send"],
});

console.log("\n========================================");
console.log("Gmail OAuth2 Authorization Setup");
console.log("========================================\n");
console.log("1. OPEN THIS URL IN YOUR BROWSER:\n");
console.log(authUrl);
console.log("\n2. Click 'Allow' to authorize\n");
console.log("3. Copy the authorization code you receive\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Paste your authorization code here: ", async (authCode) => {
  try {
    // Exchange code for tokens
    const { tokens } = await oAuth2Client.getToken(authCode);

    if (!tokens.refresh_token) {
      throw new Error("No refresh token received");
    }

    // Update .env with refresh token
    let envContent = fs.readFileSync(envPath, "utf-8");
    envContent = envContent.replace(
      /REFRESH_TOKEN=.*/,
      `REFRESH_TOKEN=${tokens.refresh_token}`
    );
    fs.writeFileSync(envPath, envContent);

    console.log("\n✅ Success!\n");
    console.log("Refresh token saved to .env:");
    console.log(`REFRESH_TOKEN=${tokens.refresh_token}\n`);
    console.log("You can now start the server: npm start\n");

    rl.close();
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Error:", err.message);
    console.error("Make sure you copied the correct authorization code.\n");
    rl.close();
    process.exit(1);
  }
});

// Handle Ctrl+C
process.on("SIGINT", () => {
  console.log("\n\nCancelled.");
  rl.close();
  process.exit(0);
});
