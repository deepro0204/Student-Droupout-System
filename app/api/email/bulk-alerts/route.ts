import { type NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { alerts } = body

    if (!alerts || !Array.isArray(alerts)) {
      return NextResponse.json({ error: "Invalid alerts data" }, { status: 400 })
    }

    const result = await emailService.sendBulkAlerts(alerts)

    return NextResponse.json({
      success: true,
      message: `Bulk email operation completed: ${result.sent} sent, ${result.failed} failed`,
      data: result,
    })
  } catch (error) {
    console.error("Bulk email error:", error)
    return NextResponse.json({ error: "Failed to send bulk emails" }, { status: 500 })
  }
}
