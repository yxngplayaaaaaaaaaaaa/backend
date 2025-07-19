export default function handler(req, res) {
    const { key } = req.query;

    if (!key) {
        return res.status(400).json({ error: "Missing key" });
    }

    // For demo: all keys are valid
    const encrypted = xorEncrypt("whitelisted", process.env.SECRET_KEY || "phaze830630");
    res.status(200).json({ valid: true, encrypted });
}

function xorEncrypt(data, key) {
    return Buffer.from(
        data.split('').map((char, i) => 
            String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('')
    ).toString('base64');
}