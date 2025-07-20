import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://legiixnutpcnmleewqqj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  try {
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

    const { error } = await supabase.from("keys").insert([{ key: encodedKey, created_at: now }]);
    if (error) {
      console.error("Supabase Insert Error:", error);
      return res.status(500).json({ error: "Failed to save key to database" });
    }

    return res.status(200).json({ key: encodedKey, message: "Key generated successfully" });

  } catch (err) {
    console.error("Unhandled error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
