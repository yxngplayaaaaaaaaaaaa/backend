export default function handler(req, res) {
const allowedReferers = ["linkvertise.com", "link-target.net"];
const refererValid = allowedReferers.some(r => referer.includes(r));

    const refererValid = allowedReferers.some(r => referer.includes(r));
    if (!refererValid) {
        return res.status(403).json({ error: "Unauthorized access. Please complete Linkvertise." });
    }

    const { clientid } = req.query;
    if (!clientid) return res.status(400).json({ error: "Missing clientid" });

    const now = Date.now();
    const rawKey = `${clientid}:${now}`;
    const encodedKey = Buffer.from(rawKey).toString("base64");

    const encrypted = xorEncrypt("whitelisted", process.env.SECRET_KEY || "phaze830630");

    res.status(200).json({ key: encodedKey, encrypted });
}

function xorEncrypt(data, key) {
    return Buffer.from(
        data.split('').map((char, i) =>
            String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('')
    ).toString('base64');
}
