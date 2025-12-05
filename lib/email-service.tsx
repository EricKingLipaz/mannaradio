// Email service for sending prayer request replies
// Uses Resend API (free tier available) or NodeMailer

export interface EmailPayload {
  to: string
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail(payload: EmailPayload) {
  // Use environment variable to determine email provider
  const emailProvider = process.env.EMAIL_PROVIDER || "resend"

  if (emailProvider === "resend") {
    return sendViaResend(payload)
  } else if (emailProvider === "smtp") {
    return sendViaSMTP(payload)
  } else {
    // Fallback: log to console for development
    console.log("[EMAIL SERVICE] Would send:", payload)
    return { success: true, messageId: "dev-mode" }
  }
}

async function sendViaResend(payload: EmailPayload) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error("RESEND_API_KEY not configured")
      return { success: false, error: "Email service not configured" }
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.SENDER_EMAIL || "info@mannatemple.co.za",
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        reply_to: payload.replyTo || process.env.SENDER_EMAIL,
      }),
    })

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, messageId: data.id }
  } catch (error) {
    console.error("Error sending email via Resend:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
}

async function sendViaSMTP(payload: EmailPayload) {
  // Implement SMTP if using Nodemailer or similar
  console.log("[SMTP] Would send email:", payload)
  return { success: true, messageId: "smtp-mock" }
}

export function generatePrayerReplyEmail(
  recipientName: string,
  prayerRequest: string,
  reply: string,
  pastorName: string,
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6B46C1 0%, #EC4899 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; margin: 20px 0; border-left: 4px solid #6B46C1; border-radius: 4px; }
          .label { font-weight: bold; color: #6B46C1; }
          .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
          a { color: #6B46C1; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Prayer Request Response</h1>
            <p>Manna Radio & TV - Manna Temple Church</p>
          </div>

          <p>Dear ${recipientName},</p>

          <p>We want to thank you for submitting your prayer request to Manna Temple Church. Our pastoral team has been praying with you, and we have received a response to your request:</p>

          <div class="content">
            <p><span class="label">Your Prayer Request:</span></p>
            <p>${prayerRequest}</p>
          </div>

          <div class="content">
            <p><span class="label">Pastor's Response:</span></p>
            <p>${reply}</p>
          </div>

          <p>May God bless you and your family. If you have any questions, please don't hesitate to reach out to us.</p>

          <p>In Christ's Love,<br>
          <strong>${pastorName}</strong><br>
          Manna Temple Church</p>

          <div class="footer">
            <p>
              <strong>Contact Information:</strong><br>
              Email: info@mannatemple.co.za<br>
              Phone: +27 73 851 4499<br>
              Website: www.mannatemple.co.za<br>
              Location: 83VC+8WX The Orchards, Akasia, Pretoria North
            </p>
            <p style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
              This is an automated email response from Manna Temple Church. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}
