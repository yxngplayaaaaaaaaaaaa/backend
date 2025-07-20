import { createClient } from "@supabase/supabase-js";
import { Buffer } from "buffer";

const supabase = createClient(
  "https://legiixnutpcnmleewqqj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2lpeG51dHBjbm1sZWV3cXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNDI0ODAsImV4cCI6MjA2ODYxODQ4MH0.sE6VDWCoh5lpWDQNBxvOk-Jg9NyDkaWTQ02qb7m8k1k"
);

function xorEncrypt(data, key) {
  return Buffer.from(
    data.split('').map((char, i) =>
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join('')
  ).toString('base64');
}

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
  if (!clientid) return res.status(400).send("Missing clientid");

  const timestamp = Date.now();
  const rawKey = `${clientid}:${timestamp}`;
  const encodedKey = Buffer.from(rawKey).toString("base64");

  // Save the key
  await supabase.from("keys").insert([{ key: encodedKey, timestamp }]);

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
