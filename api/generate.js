import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://legiixnutpcnmleewqqj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUz...'; // your anon key
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  console.log('✨ generate.js invoked');
  try {
    const referer = req.headers.referer;
    console.log('source referer:', referer);
    if (!referer) throw new Error('No referer header');

    const isAuthorized = ['linkvertise.com', 'link-target.net']
      .some(d => referer.includes(d));
    console.log('authorized:', isAuthorized);
    if (!isAuthorized) return res.status(403).send('Linkvertise step required');

    const clientid = req.query.clientid;
    console.log('clientid:', clientid);
    if (!clientid) return res.status(400).json({ error: 'Missing clientid' });

    const now = Date.now();
    const raw = `${clientid}:${now}`;
    const key = Buffer.from(raw).toString('base64');
    console.log('generated key:', key);

    const { error } = await supabase.from('keys').insert([{ key, created_at: now }]);
    console.log('supabase insert error:', error);
    if (error) return res.status(500).json({ error: 'DB insert failed' });

    console.log('🔥 insert succeeded');
    return res.status(200).json({ key });

  } catch (e) {
    console.error('❗ Unexpected error:', e.stack || e);
    return res.status(500).json({ error: 'Server error' });
  }
}
