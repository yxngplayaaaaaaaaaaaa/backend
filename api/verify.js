import { isKeyValid } from "./data";

export default function handler(req, res) {
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: "Missing key" });

    const valid = isKeyValid(key);
    const result = valid ? "whitelisted" : "notwhitelisted";
    const encrypted = xorEncrypt(result, process.env.SECRET_KEY || "phaze830630");

    res.status(200).json({ valid, encrypted });
}

function xorEncrypt(data, key) {
    return Buffer.from(
        data.split('').map((char, i) => 
            String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('')
    ).toString('base64');
}