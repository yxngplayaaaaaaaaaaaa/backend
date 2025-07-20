import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://legiixnutpcnmleewqqj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2lpeG51dHBjbm1sZWV3cXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNDI0ODAsImV4cCI6MjA2ODYxODQ4MH0.sE6VDWCoh5lpWDQNBxvOk-Jg9NyDkaWTQ02qb7m8k1k'; // use your full anon key here
const supabase = createClient(supabaseUrl, supabaseKey);

function xorEncrypt(data, key) {
  return Buffer.from(
    data
      .split('')
      .map((char, i) =>
        String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
      )
      .join('')
  ).toString('base64');
}

export default async function handler(req, res) {
  const { key } = req.query;
  if (!key) return res.status(400).json({ error: 'Missing key' });

  const { data, error } = await supabase
    .from('keys')
    .select('created_at')
    .eq('key', key)
    .single();

  if (error || !data) {
    return res.status(200).json({
      valid: false,
      encrypted: xorEncrypt('notwhitelisted', process.env.SECRET_KEY || 'phaze830630')
    });
  }

  const keyTime = new Date(data.created_at).getTime();
  const now = Date.now();
  const valid = now - keyTime <= 1000 * 60 * 60 * 4;

  const encrypted = xorEncrypt(
    valid ? 'whitelisted' : 'notwhitelisted',
    process.env.SECRET_KEY || 'phaze830630'
  );

  res.status(200).json({ valid, encrypted });
}
