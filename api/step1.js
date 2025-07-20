export default function handler(req, res) {
    const auth = req.query.auth;

    const html = `
    <html>
      <body style="background:#111;color:white;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;">
        <div style="text-align:center;">
          <h1>Checking Step 1...</h1>
          <script>
            const token = sessionStorage.getItem("phaze_step1_token");
            if (token !== "${auth}") {
              document.body.innerHTML = "<h1 style='color:red;'>You must complete Step 1 first!</h1><p>Redirecting to Linkvertise...</p>";
              setTimeout(() => window.location.href = "hhttps://link-center.net/1372272/rWDel939cTR8", 3000);
            } else {
              window.location.href = "https://link-target.net/1372272/6gAQ9ejg9IDz";
            }
          </script>
        </div>
      </body>
    </html>
    `;

    res.status(200).send(html);
}
