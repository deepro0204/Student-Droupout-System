import { type NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, studentData, alertData } = body

    if (!type || !studentData) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    let result = false

    switch (type) {
      case "high_risk":
        if (!alertData) {
          return NextResponse.json({ error: "Alert data required for high risk alerts" }, { status: 400 })
        }
        result = await emailService.sendHighRiskAlert(alertData)
        break

      case "attendance_warning":
        const { attendancePercentage, parentEmail, parentName } = alertData
        result = await emailService.sendAttendanceWarning(
          studentData.id,
          studentData.name,
          attendancePercentage,
          parentEmail,
          parentName,
        )
        break

      case "fee_reminder":
        const { pendingAmount, dueDate } = alertData
        result = await emailService.sendFeeReminder(
          studentData.id,
          studentData.name,
          pendingAmount,
          dueDate,
          studentData.parentEmail,
        )
        break

      case "counseling_notification":
        const { sessionDate, sessionType } = alertData
        result = await emailService.sendCounselingNotification(
          studentData.id,
          studentData.name,
          sessionDate,
          sessionType,
          studentData.parentEmail,
        )
        break

      default:
        return NextResponse.json({ error: "Invalid alert type" }, { status: 400 })
    }

    return NextResponse.json({ success: result, message: result ? "Email sent successfully" : "Failed to send email" })
  } catch (error) {
    console.error("Email alert error:", error)
    return NextResponse.json({ error: "Failed to send email alert" }, { status: 500 })
  }
}
