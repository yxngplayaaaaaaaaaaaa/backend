import { createClient } from "@supabase/supabase-js";
import { Buffer } from "buffer";

const supabaseUrl = "https://legiixnutpcnmleewqqj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2lpeG51dHBjbm1sZWV3cXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNDI0ODAsImV4cCI6MjA2ODYxODQ4MH0.sE6VDWCoh5lpWDQNBxvOk-Jg9NyDkaWTQ02qb7m8k1k"; // Replace with your actual anon key
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const referer = req.headers.referer || "";
  const allowedDomains = ["linkvertise.com", "link-target.net"];

  const isAuthorized = allowedDomains.some(domain => referer.includes(domain));
  if (!isAuthorized) {
    return res.status(403).send(\`
      <html><body style="background:#111;color:white;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;">
        <div style="text-align:center;"><h1>Unauthorized Access</h1>
        <p>You must complete the Linkvertise step before generating a key!</p></div>
      </body></html>
    \`);
  }

  const { clientid } = req.query;
  if (!clientid) return res.status(400).send("Missing clientid");

  const now = Date.now();
  const rawKey = \`\${clientid}:\${now}\`;
  const encodedKey = Buffer.from(rawKey).toString("base64");

  const { error } = await supabase.from("keys").insert([
    { key: encodedKey, created: now }
  ]);

  if (error) {
    console.error("Supabase insert error:", error);
    return res.status(500).send("Internal Server Error");
  }

  return res.status(200).send(\`
    <html><body style="background:#111;color:white;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;">
      <div style="text-align:center;">
        <h1>Your Key Is Ready!</h1>
        <p style="font-size:1.2em;">Copy and paste this into the executor:</p>
        <div style="margin-top:10px;background:#222;padding:10px 20px;border:1px solid #444;font-size:1.3em;">\${encodedKey}</div>
        <p style="margin-top:20px;color:#aaa;">This key is valid for 4 hours.</p>
      </div>
    </body></html>
  \`);
}
