import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, volume, details } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey || apiKey === "re_your_api_key_here") {
      console.warn("RESEND_API_KEY is not configured yet in .env.local.");
      return NextResponse.json(
        {
          error:
            "RESEND_API_KEY is not configured in .env.local. Please add your Resend API key to start receiving emails directly.",
          needsKey: true,
        },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const recipient =
      process.env.CONTACT_RECEIVER_EMAIL ||
      process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
      "zeniithdigitalworks@gmail.com";

    const sender =
      process.env.RESEND_FROM_EMAIL ||
      "Zenith Video Studio <onboarding@resend.dev>";

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #09090B; color: #F4F4F6; padding: 32px 20px;">
        <div style="max-width: 580px; margin: 0 auto; background: #121216; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <div style="background: #18181E; padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center;">
            <div style="color: #D4AF37; font-family: monospace; font-size: 11px; letter-spacing: 0.2em; font-weight: bold;">
              ZENITH STUDIO // NEW INQUIRY
            </div>
          </div>

          <div style="padding: 24px;">
            <h2 style="font-size: 20px; font-weight: 700; color: #FFFFFF; margin: 0 0 16px 0; letter-spacing: -0.02em;">
              Project Brief from ${escapeHtml(name)}
            </h2>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); font-size: 12px; font-family: monospace; width: 130px;">
                  CLIENT NAME
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; font-size: 14px; font-weight: 600;">
                  ${escapeHtml(name)}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); font-size: 12px; font-family: monospace;">
                  CLIENT EMAIL
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #D4AF37; font-size: 14px;">
                  <a href="mailto:${escapeHtml(email)}" style="color: #D4AF37; text-decoration: none;">
                    ${escapeHtml(email)}
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); font-size: 12px; font-family: monospace;">
                  PACKAGE / SCOPE
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; font-size: 14px; font-weight: 500;">
                  ${escapeHtml(volume || "Not specified")}
                </td>
              </tr>
            </table>

            <div style="margin-top: 20px;">
              <div style="font-size: 11px; font-family: monospace; color: rgba(255,255,255,0.5); letter-spacing: 0.15em; margin-bottom: 8px;">
                PROJECT OVERVIEW & NOTES:
              </div>
              <div style="background: #09090B; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 14px 16px; font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.85); white-space: pre-wrap;">${escapeHtml(details || "No additional details provided.")}</div>
            </div>

            <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08); text-align: center;">
              <a href="mailto:${escapeHtml(email)}?subject=Re:%20Zenith%20Video%20Editing%20Project" style="display: inline-block; background: #D4AF37; color: #09090B; font-weight: bold; font-family: monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; padding: 12px 24px; border-radius: 4px; text-decoration: none;">
                Reply Directly to ${escapeHtml(name)} →
              </a>
            </div>
          </div>

          <div style="background: #09090B; padding: 14px 24px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; font-size: 11px; font-family: monospace; color: rgba(255,255,255,0.4);">
            Direct lead generated from Zenith Portfolio · Destination: ${recipient}
          </div>
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: sender,
      to: [recipient],
      replyTo: email,
      subject: `[Zenith Lead] ${name} — ${volume || "Project Inquiry"}`,
      html: htmlContent,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return NextResponse.json(
        { error: result.error.message || "Failed to send email via Resend." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.data?.id,
    });
  } catch (error: any) {
    console.error("Unexpected error in /api/contact:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
