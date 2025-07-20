function xorEncrypt(data, key) {
    return Buffer.from(
        data.split('').map((char, i) =>
            String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('')
    ).toString('base64');
}

export default function handler(req, res) {
    const referer = req.headers.referer || "";
    const allowedDomains = ["linkvertise.com", "link-target.net"];

    const isAuthorized = allowedDomains.some(domain => referer.includes(domain));
    if (!isAuthorized) {
        return res.status(403).send(\`
            <html>
              <body style="font-family: sans-serif; background: #111; color: white; display: flex; justify-content: center; align-items: center; height: 100vh;">
                <div>
                  <h1>Unauthorized Access</h1>
                  <p>You must complete the Linkvertise step before generating a key!</p>
                </div>
              </body>
            </html>
        \`);
    }

    const { clientid } = req.query;
    if (!clientid) return res.status(400).json({ error: "Missing clientid" });

    const now = Date.now();
    const rawKey = \`\${clientid}:\${now}\`;
    const encodedKey = Buffer.from(rawKey).toString("base64");

    const encrypted = xorEncrypt("whitelisted", process.env.SECRET_KEY || "phaze830630");

    return res.status(200).json({ key: encodedKey, encrypted });
}
