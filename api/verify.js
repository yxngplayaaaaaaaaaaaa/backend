import fs from "fs";
import path from "path";

const KEYS_FILE = path.join(process.cwd(), "keys.json");
const EXPIRATION_TIME_MS = 4 * 60 * 60 * 1000; // 4 hours

function loadKeys() {
  if (!fs.existsSync(KEYS_FILE)) return {};
  return JSON.parse(fs.readFileSync(KEYS_FILE, "utf8"));
}

function saveKeys(keys) {
  fs.writeFileSync(KEYS_FILE, JSON.stringify(keys, null, 2));
}

export default function handler(req, res) {
  const { key } = req.query;
  if (!key) return res.status(400).json({ error: "Missing key" });

  let keys = loadKeys();
  const timestamp = keys[key];

  if (!timestamp) {
    return res.status(403).json({ valid: false, reason: "Key not found or already used." });
  }

  const now = Date.now();
  if (now - timestamp > EXPIRATION_TIME_MS) {
    delete keys[key];
    saveKeys(keys);
    return res.status(403).json({ valid: false, reason: "Key expired." });
  }

  // One-time use: delete after check
  delete keys[key];
  saveKeys(keys);

  return res.status(200).json({ valid: true });
}
