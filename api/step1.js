export default function handler(req, res) {
    const referer = req.headers.referer || "";
    const allowedDomains = ["linkvertise.com", "link-target.net"];

    const isAuthorized = allowedDomains.some(domain => referer.includes(domain));
    if (!isAuthorized) {
        return res.status(403).send(`
            <html>
              <body style="font-family: sans-serif; background: #111; color: white; display: flex; justify-content: center; align-items: center; height: 100vh;">
                <div>
                  <h1>Step 1 Not Completed!</h1>
                  <p>Please complete the first Linkvertise step to proceed.</p>
                </div>
              </body>
            </html>
        `);
    }

    // Show the final step 2 Linkvertise URL
    return res.status(200).send(`
        <html>
          <body style="font-family: sans-serif; background: #111; color: white; display: flex; justify-content: center; align-items: center; height: 100vh;">
            <div>
              <h1>Step 1 Complete</h1>
              <p>Click below to continue to Step 2.</p>
              <a href="https://link-target.net/1372272/6gAQ9ejg9IDz" style="color: lime; font-size: 20px;">→ Continue to Final Step</a>
            </div>
          </body>
        </html>
    `);
}