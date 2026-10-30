import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { saveLeadToDb } from "@/lib/firebase";
import { enforceRateLimit, getClientIp } from "@/lib/auth-guard";

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  // 1. In-Memory IP Rate Limiting (max 5 requests per 10 minutes)
  const rateLimitError = enforceRateLimit(req, "contact-submission", 5, 10 * 60 * 1000);
  if (rateLimitError) return rateLimitError;

  try {
    const body = await req.json();
    const {
      name,
      email,
      projectType,
      budget,
      message,
      website_honeypot,
      // Backward compatibility with previous form payload
      volume,
      details,
    } = body;

    // 2. Silent Bot Honeypot Detection
    // If the hidden honeypot field is filled, silently return 200 without processing
    if (website_honeypot && String(website_honeypot).trim().length > 0) {
      console.info("[contact] Bot honeypot triggered; discarding submission silently.");
      return NextResponse.json({ success: true, message: "Inquiry received." }, { status: 200 });
    }

    // 3. Field validation
    if (!name || !String(name).trim() || !email || !String(email).trim()) {
      return NextResponse.json(
        { error: "Full name and work email are required fields." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const finalProjectType = projectType || volume || "Starter (30 Reels)";
    const finalBudget = budget || "Standard Retainer";
    const finalMessage = message || details || "";
    const clientIp = getClientIp(req);
    const userAgent = req.headers.get("user-agent") || "";

    // 4. Persist Lead to Firestore 'leads' collection
    let leadId = `lead-${Date.now()}`;
    try {
      leadId = await saveLeadToDb({
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        projectType: finalProjectType,
        budget: finalBudget,
        message: finalMessage,
        ip: clientIp,
        userAgent,
        createdAt: new Date().toISOString(),
      });
    } catch (fsErr) {
      console.warn("[contact] Firestore lead save warning:", fsErr);
    }

    // 5. Immediate Webhook Dispatch (Discord / Slack / Make / Telegram)
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.startsWith("http")) {
      try {
        const isDiscord = webhookUrl.includes("discord.com/api/webhooks");
        const webhookPayload = isDiscord
          ? {
              content: "🎬 **New Video Editing Client Brief Received!**",
              embeds: [
                {
                  title: `Lead Inquiry: ${name}`,
                  color: 0xd4af37, // Midnight Gold (#D4AF37)
                  fields: [
                    { name: "Client Name", value: name, inline: true },
                    { name: "Client Email", value: email, inline: true },
                    { name: "Package / Scope", value: finalProjectType, inline: true },
                    { name: "Estimated Budget", value: finalBudget, inline: true },
                    {
                      name: "Project Overview & Notes",
                      value: finalMessage.substring(0, 1024) || "No notes provided.",
                    },
                  ],
                  footer: { text: "Zenith Video Editing Studio · Lead ID: " + leadId },
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : {
              text: `🎬 *New Zenith Studio Lead:* ${name} (<mailto:${email}|${email}>) — *${finalProjectType}* [Budget: ${finalBudget}]\n>${finalMessage.replace(/\n/g, "\n>")}`,
              blocks: [
                {
                  type: "header",
                  text: { type: "plain_text", text: "🎬 New Video Editing Lead" },
                },
                {
                  type: "section",
                  fields: [
                    { type: "mrkdwn", text: `*Client:*\n${escapeHtml(name)}` },
                    { type: "mrkdwn", text: `*Email:*\n${escapeHtml(email)}` },
                    { type: "mrkdwn", text: `*Scope:*\n${escapeHtml(finalProjectType)}` },
                    { type: "mrkdwn", text: `*Budget:*\n${escapeHtml(finalBudget)}` },
                  ],
                },
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: `*Project Overview:*\n${escapeHtml(finalMessage || "No notes provided.")}`,
                  },
                },
              ],
            };

        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(webhookPayload),
        });
      } catch (webhookErr) {
        console.warn("[contact] Webhook delivery skipped/failed:", webhookErr);
      }
    }

    // 6. Optional Resend Email Delivery
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && !resendApiKey.includes("your_api_key")) {
      try {
        const resend = new Resend(resendApiKey);
        const recipient =
          process.env.CONTACT_RECEIVER_EMAIL ||
          process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
          "zeniithdigitalworks@gmail.com";
        const sender =
          process.env.RESEND_FROM_EMAIL ||
          "Zenith Video Studio <onboarding@resend.dev>";

        const htmlContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #09090B; color: #F4F4F6; padding: 32px 20px;">
            <div style="max-width: 580px; margin: 0 auto; background: #121216; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden;">
              <div style="background: #18181E; padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.08);">
                <div style="color: #D4AF37; font-family: monospace; font-size: 11px; letter-spacing: 0.2em; font-weight: bold;">
                  ZENITH STUDIO // NEW INQUIRY
                </div>
              </div>
              <div style="padding: 24px;">
                <h2 style="font-size: 20px; font-weight: 700; color: #FFFFFF; margin: 0 0 16px 0;">
                  Project Brief from ${escapeHtml(name)}
                </h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); font-size: 12px; font-family: monospace; width: 130px;">CLIENT NAME</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; font-size: 14px; font-weight: 600;">${escapeHtml(name)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); font-size: 12px; font-family: monospace;">CLIENT EMAIL</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #D4AF37; font-size: 14px;">${escapeHtml(email)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); font-size: 12px; font-family: monospace;">SCOPE / PACKAGE</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; font-size: 14px;">${escapeHtml(finalProjectType)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); font-size: 12px; font-family: monospace;">ESTIMATED BUDGET</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; font-size: 14px;">${escapeHtml(finalBudget)}</td>
                  </tr>
                </table>
                <div style="margin-top: 16px;">
                  <div style="font-size: 11px; font-family: monospace; color: rgba(255,255,255,0.5); margin-bottom: 8px;">OVERVIEW & NOTES:</div>
                  <div style="background: #09090B; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 14px; font-size: 14px; color: rgba(255,255,255,0.85); white-space: pre-wrap;">${escapeHtml(finalMessage || "No notes provided.")}</div>
                </div>
              </div>
            </div>
          </div>
        `;

        await resend.emails.send({
          from: sender,
          to: [recipient],
          replyTo: email,
          subject: `[Zenith Lead] ${name} — ${finalProjectType}`,
          html: htmlContent,
        });
      } catch (emailErr) {
        console.warn("[contact] Resend email delivery failed:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      leadId,
      message: "Project brief successfully submitted. We will reply within 24 hours.",
    });
  } catch (error: any) {
    console.error("[api/contact] Internal error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process contact inquiry." },
      { status: 500 }
    );
  }
}
