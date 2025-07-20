import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://legiixnutpcnmleewqqj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2lpeG51dHBjbm1sZWV3cXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNDI0ODAsImV4cCI6MjA2ODYxODQ4MH0.sE6VDWCoh5lpWDQNBxvOk-Jg9NyDkaWTQ02qb7m8k1k';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  try {
    const referer = req.headers.referer || '';
    const allowedDomains = ['linkvertise.com', 'link-target.net'];
    const isAuthorized = allowedDomains.some(domain => referer.includes(domain));

    if (!isAuthorized) {
      return res.status(403).send('You must complete Linkvertise.');
    }

    const { clientid } = req.query;
    if (!clientid) {
      return res.status(400).json({ error: 'Missing clientid' });
    }

    const now = Date.now();
    const rawKey = `${clientid}:${now}`;
    const encodedKey = Buffer.from(rawKey).toString('base64');

    const { error } = await supabase.from('keys').insert([
      { key: encodedKey, created_at: now }
    ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save key' });
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
  } catch (err) {
    console.error('Unhandled error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
