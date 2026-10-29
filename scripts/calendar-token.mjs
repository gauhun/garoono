// One-time: lets Cloud Functions read free/busy and create call invites on garoonotech@gmail.com.
// Usage: node scripts/calendar-token.mjs (after GOOGLE_CAL_CLIENT_ID / _SECRET are set in Secret Manager)
// Sign in as garoonotech@gmail.com. The refresh token goes straight into Secret Manager, never to the screen.
import { execFileSync, spawn } from "node:child_process";
import { createServer } from "node:http";

const secret = (name) =>
  process.env[name] ??
  execFileSync("firebase", ["functions:secrets:access", name, "--project", "baseproject-25dbe", "--account", "garoonotech@gmail.com"], { encoding: "utf8" }).trim();
const clientId = secret("GOOGLE_CAL_CLIENT_ID");
const clientSecret = secret("GOOGLE_CAL_CLIENT_SECRET");
if (!clientId || !clientSecret) {
  console.error("Set the GOOGLE_CAL_CLIENT_ID and GOOGLE_CAL_CLIENT_SECRET secrets first.");
  process.exit(1);
}

const SCOPES = "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.freebusy";

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  const code = url.searchParams.get("code");
  if (!code) return res.end("No code. Close this tab and run the script again.");

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }),
  });
  const token = await tokenRes.json();
  if (!token.refresh_token) {
    res.end("Google returned no refresh token. Remove the app's access at myaccount.google.com/permissions and retry.");
    console.error("No refresh token:", token.error ?? tokenRes.status);
    process.exit(1);
  }

  const set = spawn("firebase", ["functions:secrets:set", "GOOGLE_CAL_REFRESH_TOKEN", "--data-file", "-", "--project", "baseproject-25dbe", "--account", "garoonotech@gmail.com"], {
    stdio: ["pipe", "inherit", "inherit"],
  });
  set.stdin.end(token.refresh_token);
  set.on("exit", (code) => {
    res.end(code === 0 ? "Calendar connected. You can close this tab." : "Saving the secret failed, see the terminal.");
    server.close();
    process.exit(code ?? 1);
  });
});

let redirectUri;
server.listen(0, "127.0.0.1", () => {
  redirectUri = `http://127.0.0.1:${server.address().port}`;
  const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  auth.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES,
    access_type: "offline",
    prompt: "consent",
    login_hint: "garoonotech@gmail.com",
  }).toString();
  console.log("Opening Google sign-in. Use garoonotech@gmail.com.");
  spawn("open", [auth.toString()]);
});
