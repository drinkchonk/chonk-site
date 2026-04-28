export const welcomeSubject = "You're on the list.";

export function welcomeText() {
  return [
    "Welcome to chonk.",
    "",
    "You'll be the first to know when our pop-ups go live, and you'll get the occasional dispatch on protein, training, and the science we obsess over so you don't have to.",
    "",
    "No fluff. No daily emails. Just the things worth knowing.",
    "",
    "50 grams closer,",
    "chonk.",
    "",
    "—",
    "Perth, Western Australia",
    "Reply any time: hello@chonkshakes.com.au",
  ].join("\n");
}

export function welcomeHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>You're on the list.</title>
  </head>
  <body style="margin:0;padding:0;background:#FEF6EC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0E0C0D;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FEF6EC;">
      <tr>
        <td align="center" style="padding:48px 20px;">
          <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#FEF6EC;">
            <tr>
              <td style="padding:0 0 32px 0;">
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:44px;line-height:1;letter-spacing:-0.02em;font-weight:600;color:#0E0C0D;">
                  chonk<span style="color:#F2B8CC;">.</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 24px 0;">
                <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:36px;line-height:1.1;letter-spacing:-0.02em;font-weight:600;color:#0E0C0D;">
                  You're on the list.
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 20px 0;font-size:16px;line-height:1.6;color:#0E0C0D;">
                Welcome to chonk.
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 20px 0;font-size:16px;line-height:1.6;color:rgba(14,12,13,0.78);">
                You'll be the first to know when our pop-ups go live, and you'll get the occasional dispatch on protein, training, and the science we obsess over so you don't have to.
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 32px 0;font-size:16px;line-height:1.6;color:rgba(14,12,13,0.78);">
                No fluff. No daily emails. Just the things worth knowing.
              </td>
            </tr>
            <tr>
              <td style="padding:24px 0 0 0;border-top:1px solid rgba(14,12,13,0.12);font-size:14px;line-height:1.6;color:rgba(14,12,13,0.62);">
                50 grams closer,<br/>
                <strong style="color:#0E0C0D;">chonk.</strong>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 0 0 0;font-size:12px;line-height:1.6;color:rgba(14,12,13,0.62);">
                Perth, Western Australia<br/>
                Reply any time: <a href="mailto:hello@chonkshakes.com.au" style="color:#0E0C0D;text-decoration:underline;">hello@chonkshakes.com.au</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
