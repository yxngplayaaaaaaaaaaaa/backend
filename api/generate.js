import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://legiixnutpcnmleewqqj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  console.log('🚀 generate.js called');
  try {
    const referer = req.headers.referer || '';
    console.log('referer:', referer);

    const isAuthorized = ['linkvertise.com','link-target.net']
      .some(domain => referer.includes(domain));

    console.log('isAuthorized:', isAuthorized);
    if (!isAuthorized) return res.status(403).send('Must complete Linkvertise.');

    const { clientid } = req.query;
    console.log('clientid:', clientid);
    if (!clientid) return res.status(400).json({ error: 'Missing clientid' });

    const now = Date.now();
    const rawKey = `${clientid}:${now}`;
    const encodedKey = Buffer.from(rawKey).toString('base64');
    console.log('encodedKey:', encodedKey);

    const sup = supabase.from('keys').insert([{ key: encodedKey, created_at: now }]);
    console.log('insert result placeholder');
    const { error } = await sup;
    console.log('supabase error:', error);
    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save key' });
    }

    res.status(200).json({ key: encodedKey, message: 'Key generated!' });
  } catch (err) {
    console.error('🛑 Uncaught error in generate.js:', err.stack || err);
    return res.status(500).json({ error: 'Server error' });
  }
}
