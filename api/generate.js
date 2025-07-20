// ✅ /api/generate.js (uses Supabase to store keys)

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://legiixnutpcnmleewqqj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2lpeG51dHBjbm1sZWV3cXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNDI0ODAsImV4cCI6MjA2ODYxODQ4MH0.sE6VDWCoh5lpWDQNBxvOk-Jg9NyDkaWTQ02qb7m8k1k';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const referer = req.headers.referer || "";
  const allowedDomains = ["linkvertise.com", "link-target.net"];
  const isAuthorized = allowedDomains.some(domain => referer.includes(domain));

  if (!isAuthorized) {
    return res.status(403).send("You must complete Linkvertise.");
  }

  const { clientid } = req.query;
  if (!clientid) return res.status(400).json({ error: "Missing clientid" });

  const now = Date.now();
  const rawKey = `${clientid}:${now}`;
  const encodedKey = Buffer.from(rawKey).toString("base64");

  await supabase.from("keys").insert([{ key: encodedKey, created_at: now }]);

  return res.status(200).json({ key: encodedKey, message: "Key generated successfully" });
}
