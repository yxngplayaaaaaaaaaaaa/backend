import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';

function xorEncrypt(data, key) {
    return Buffer.from(
        data.split('').map((char, i) =>
            String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('')
    ).toString('base64');
}

export default function handler(req, res) {
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: "Missing key" });

    const filePath = path.resolve("./keys.json");

    let keys = {};
    if (fs.existsSync(filePath)) {
        keys = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    const savedTime = keys[key];
    const currentTime = Date.now();
    const fourHours = 1000 * 60 * 60 * 4;

    let valid = false;
    if (savedTime && (currentTime - savedTime) <= fourHours) {
        valid = true;
    }

    const result = valid ? "whitelisted" : "denied";
    const encrypted = xorEncrypt(result, "phaze830630");

    res.status(200).json({ valid, encrypted });
}
