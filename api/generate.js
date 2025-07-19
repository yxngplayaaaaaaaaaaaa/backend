import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const { clientid } = req.query;
    if (!clientid) return res.status(400).json({ error: "Missing clientid" });

    const key = Math.random().toString(36).substring(2, 34); // 32-char key
    const now = Date.now();
    const filePath = path.resolve("./keys.json");

    let keys = {};
    if (fs.existsSync(filePath)) {
        keys = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    keys[key] = now;
    fs.writeFileSync(filePath, JSON.stringify(keys));

    const encrypted = xorEncrypt("whitelisted", process.env.SECRET_KEY || "phaze830630");
    res.status(200).json({ key, encrypted });
}

function xorEncrypt(data, key) {
    return Buffer.from(
        data.split('').map((char, i) =>
            String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('')
    ).toString('base64');
}