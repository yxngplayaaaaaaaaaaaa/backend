import { createClient } from "@supabase/supabase-js";
import { Buffer } from "buffer";

// Initialize Supabase
const supabaseUrl = "https://legiixnutpcnmleewqqj.supabase.co";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY"; // Replace this with full anon key
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const referer = req.headers.referer || "";
  const allowedDomains = ["linkvertise.com", "link-target.net"];

  const isAuthorized = allowedDomains.some(domain => referer.includes(domain));
  if (!isAuthorized) {
    return res.status(403).send(`
      <html>
        <body style="font-family: sans-serif; background: #111; color: white; display: flex; justify-content: center; align-items: center; height: 100vh;">
          <div style="text-align:center;">
            <h1>Unauthorized Access</h1>
            <p>You must complete the Linkvertise step before generating a key!</p>
          </div>
        </body>
      </html>
    `);
  }

  const { clientid } = req.query;
  if (!clientid) {
    return res.status(400).send("Missing clientid");
  }

  const now = Date.now();
  const rawKey = `${clientid}:${now}`;
  const encodedKey = Buffer.from(rawKey).toString("base64");

  // Save encoded key to Supabase
  const { error } = await supabase.from("keys").insert([
    { key: encodedKey } // Must match what verify.js checks for
  ]);

  if (error) {
    console.error("Error saving to Supabase:", error);
    return res.status(500).send("Internal Server Error");
  }

  return res.status(200).send(`
    <html>
      <body style="font-family: sans-serif; background: #111; color: white; display: flex; justify-content: center; align-items: center; height: 100vh;">
        <div style="text-align: center;">
          <h1>Your Key Is Ready!</h1>
          <p style="font-size: 1.2em;">Copy and paste this into the executor:</p>
          <div style="margin-top: 10px; background: #222; padding: 10px 20px; border: 1px solid #444; display: inline-block; font-size: 1.3em; user-select: all;">
            ${encodedKey}
          </div>
          <p style="margin-top: 20px; color: #aaa;">This key is valid for 4 hours.</p>
        </div>
      </body>
    </html>
  `);
}
