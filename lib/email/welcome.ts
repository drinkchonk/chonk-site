export const welcomeSubject = "You're on the list.";

// Shown in the Gmail/Outlook inbox preview snippet next to the subject.
const PREHEADER = "Welcome to the chonkiverse.";

export function welcomeText(unsubscribeUrl: string) {
  return [
    "Welcome to the chonkiverse.",
    "",
    "You'll be the first to know when our pop-ups go live, and you'll get the occasional dispatch on protein, training, and the science we obsess over so you don't have to.",
    "",
    "No fluff. No daily emails. Just the things worth knowing.",
    "",
    "50 grams closer,",
    "Sam",
    "founder, chonk.",
    "",
    "Perth, Western Australia",
    "hello@chonkshakes.com.au",
    "",
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");
}

export function welcomeHtml(unsubscribeUrl: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="color-scheme" content="dark light" />
    <meta name="supported-color-schemes" content="dark light" />
    <title>You're on the list.</title>
  </head>
  <body style="margin:0;padding:0;background:#0E0C0D;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#FEF6EC;">
    <div style="display:none;font-size:1px;color:#0E0C0D;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
      ${PREHEADER}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0E0C0D;">
      <tr>
        <td align="center" style="padding:56px 20px;">
          <table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;width:100%;background:#0E0C0D;">
            <tr>
              <td style="padding:0 0 28px 0;">
                <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:40px;line-height:1.1;letter-spacing:-0.02em;font-weight:600;color:#FEF6EC;">
                  Welcome to the chonkiverse<span style="color:#F2B8CC;">.</span>
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 20px 0;font-size:16px;line-height:1.65;color:rgba(254,246,236,0.85);">
                You'll be the first to know when our pop-ups go live, and you'll get the occasional dispatch on protein, training, and the science we obsess over so you don't have to.
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 28px 0;font-size:16px;line-height:1.65;color:rgba(254,246,236,0.85);">
                No fluff. No daily emails. Just the things worth knowing.
              </td>
            </tr>
            <tr>
              <td style="padding:24px 0 0 0;border-top:1px solid #F2B8CC;font-size:15px;line-height:1.65;color:#FEF6EC;">
                50 grams closer,<br/>
                <strong style="color:#F2B8CC;font-weight:600;">Sam</strong><br/>
                <span style="color:rgba(254,246,236,0.62);font-size:13px;">founder, chonk.</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 0 0 0;font-size:12px;line-height:1.65;color:rgba(254,246,236,0.62);">
                Perth, Western Australia<br/>
                <a href="mailto:hello@chonkshakes.com.au" style="color:#F2B8CC;text-decoration:underline;">hello@chonkshakes.com.au</a><br/><br/>
                Don't want these? <a href="${unsubscribeUrl}" style="color:#F2B8CC;text-decoration:underline;">Unsubscribe with one click</a>.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
