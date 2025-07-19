export default function handler(req, res) {
    const { clientid } = req.query;

    if (!clientid) {
        return res.status(400).json({ error: "Missing clientid" });
    }

    const crypto = require("crypto");
    const key = crypto.randomBytes(16).toString("hex");
    const encrypted = xorEncrypt("whitelisted", process.env.SECRET_KEY || "phaze830630");

    // In real deployment: store the key/clientid pair in a database
    res.status(200).json({ key, encrypted });
}

function xorEncrypt(data, key) {
    return Buffer.from(
        data.split('').map((char, i) => 
            String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('')
    ).toString('base64');
}