export default function handler(req, res) {
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: "Missing key" });

    let decoded = "";
    try {
        decoded = Buffer.from(key, "base64").toString("utf-8");
    } catch (e) {
        return res.status(400).json({ valid: false, error: "Invalid base64" });
    }

    const parts = decoded.split(":");
    if (parts.length !== 2) return res.status(400).json({ valid: false, error: "Malformed key" });

    const timestamp = parseInt(parts[1]);
    const now = Date.now();
    const ageMs = now - timestamp;
    const fourHoursMs = 1000 * 60 * 60 * 4;

    const isValid = ageMs <= fourHoursMs;

    const result = isValid ? "whitelisted" : "notwhitelisted";
    const encrypted = xorEncrypt(result, process.env.SECRET_KEY || "velocity2025");

    res.status(200).json({ valid: isValid, encrypted });
}

function xorEncrypt(data, key) {
    return Buffer.from(
        data.split('').map((char, i) =>
            String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('')
    ).toString('base64');
}