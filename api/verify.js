import { createClient } from "@supabase/supabase-js";
import { Buffer } from "buffer";

// Create Supabase client
const supabase = createClient(
  "https://legiixnutpcnmleewqqj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2lpeG51dHBjbm1sZWV3cXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNDI0ODAsImV4cCI6MjA2ODYxODQ4MH0.sE6VDWCoh5lpWDQNBxvOk-Jg9NyDkaWTQ02qb7m8k1k"
);

// XOR Encryption helper
function xorEncrypt(data, key) {
  return Buffer.from(
    data.split('').map((char, i) =>
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join('')
  ).toString("base64");
}

export default async function handler(req, res) {
  const { key } = req.query;
  if (!key) return res.status(400).json({ error: "Missing key" });

  // Look up key in Supabase
  const { data, error } = await supabase
    .from("keys")
    .select("timestamp")
    .eq("key", key)
    .single();

  if (error || !data) {
    return res.status(200).json({
      valid: false,
      encrypted: xorEncrypt("notwhitelisted", process.env.SECRET_KEY || "phaze830630")
    });
  }

  const savedTime = parseInt(data.timestamp);
  const currentTime = Date.now();
  const fourHours = 1000 * 60 * 60 * 4;

  const valid = (currentTime - savedTime) <= fourHours;

  const result = valid ? "whitelisted" : "notwhitelisted";
  const encrypted = xorEncrypt(result, process.env.SECRET_KEY || "phaze830630");

  return res.status(200).json({ valid, encrypted });
}
