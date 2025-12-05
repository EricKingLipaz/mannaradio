import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { sendEmail, generatePrayerReplyEmail } from "@/lib/email-service"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      },
    )

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify pastor
    const { data: pastor, error: pastorError } = await supabase
      .from("pastors")
      .select("name")
      .eq("id", user.id)
      .single()

    if (pastorError || !pastor) {
      return NextResponse.json({ error: "Not authorized as pastor" }, { status: 403 })
    }

    // Parse request body
    const { prayerRequestId, replyText, sendEmail: shouldSendEmail } = await request.json()

    if (!prayerRequestId || !replyText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get prayer request details
    const { data: prayerRequest, error: fetchError } = await supabase
      .from("prayer_requests")
      .select("*")
      .eq("id", prayerRequestId)
      .single()

    if (fetchError || !prayerRequest) {
      return NextResponse.json({ error: "Prayer request not found" }, { status: 404 })
    }

    // Save reply to database
    const { error: insertError } = await supabase.from("prayer_request_replies").insert({
      prayer_request_id: prayerRequestId,
      pastor_id: user.id,
      reply_text: replyText,
      email_sent: false,
    })

    if (insertError) throw insertError

    // Update prayer request status and reply
    const { error: updateError } = await supabase
      .from("prayer_requests")
      .update({
        status: "answered",
        pastor_reply: replyText,
        replied_at: new Date().toISOString(),
        replied_by_pastor_id: user.id,
      })
      .eq("id", prayerRequestId)

    if (updateError) throw updateError

    // Send email if requested
    if (shouldSendEmail) {
      const emailHtml = generatePrayerReplyEmail(
        prayerRequest.full_name,
        prayerRequest.prayer_request,
        replyText,
        pastor.name,
      )

      const emailResult = await sendEmail({
        to: prayerRequest.email,
        subject: `Prayer Request Response from Manna Temple Church`,
        html: emailHtml,
        replyTo: process.env.SENDER_EMAIL || "info@mannatemple.co.za",
      })

      if (emailResult.success) {
        // Update email_sent flag
        await supabase
          .from("prayer_request_replies")
          .update({ email_sent: true })
          .eq("prayer_request_id", prayerRequestId)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Reply saved" + (shouldSendEmail ? " and email sent" : ""),
    })
  } catch (error) {
    console.error("Error in prayer request reply:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
