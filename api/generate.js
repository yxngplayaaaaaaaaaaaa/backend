export default function handler(req, res) {
  const referer = req.headers.referer || "";
  const allowedDomains = ["linkvertise.com", "link-target.net"];

  const isAuthorized = allowedDomains.some(domain => referer.includes(domain));
  if (!isAuthorized) {
    return res.status(403).json({ error: "Unauthorized access. Complete Linkvertise to get a key." });
  }

  const { clientid } = req.query;
  if (!clientid) return res.status(400).json({ error: "Missing clientid" });

  const now = Date.now();
  const rawKey = `${clientid}:${now}`;
  const encodedKey = Buffer.from(rawKey).toString("base64");

  // TEMPORARY key memory (not persistent)
  global.generatedKeys = global.generatedKeys || {};
  global.generatedKeys[encodedKey] = now;

  res.status(200).json({
    key: encodedKey,
    message: "Key generated successfully"
  });
}
