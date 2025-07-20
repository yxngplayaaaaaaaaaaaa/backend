import { Buffer } from "buffer";
import fs from "fs";
import path from "path";

const KEYS_FILE = path.join(process.cwd(), "keys.json");

function xorEncrypt(data, key) {
  return Buffer.from(
    data.split("").map((char, i) =>
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join("")
  ).toString("base64");
}

function saveKey(key, timestamp) {
  let keys = {};
  if (fs.existsSync(KEYS_FILE)) {
    keys = JSON.parse(fs.readFileSync(KEYS_FILE, "utf8"));
  }
  keys[key] = timestamp;
  fs.writeFileSync(KEYS_FILE, JSON.stringify(keys, null, 2));
}

export default function handler(req, res) {
  const referer = req.headers.referer || "";
  const allowedDomains = ["linkvertise.com", "link-target.net"];
  const isAuthorized = allowedDomains.some(domain => referer.includes(domain));

  if (!isAuthorized) {
    return res.status(403).send(`
      <html>
              <body style="font-family: sans-serif; background: #111; color: white; display: flex; justify-content: center; align-items: center; height: 100vh;">
                <div style="text-align:center;">
                  <h1>Unauthorized Access</h1>
                  <p>You must complete the Linkvertise step before generating a key!</p>
                </div>
              </body>
            </html>
    `);
  }

  const { clientid } = req.query;
  if (!clientid) return res.status(400).json({ error: "Missing clientid" });

  const now = Date.now();
  const rawKey = \`\${clientid}:\${now}\`;
  const encodedKey = Buffer.from(rawKey).toString("base64");

  saveKey(encodedKey, now);

  return res.status(200).send(\`
    <html>
          <body style="font-family: sans-serif; background: #111; color: white; display: flex; justify-content: center; align-items: center; height: 100vh;">
            <div style="text-align: center;">
              <h1>Your Key Is Ready!</h1>
              <p style="font-size: 1.2em;">Copy and paste in Phaze:</p>
              <div style="margin-top: 10px; background: #222; padding: 10px 20px; border: 1px solid #444; display: inline-block; font-size: 1.3em; user-select: all;">
                ${encodedKey}
              </div>
              <p style="margin-top: 20px; color: #aaa;">This key is valid for 4 hours!</p>
            </div>
          </body>
        </html>
  `);
}
