// Email service for sending automated alerts to parents and staff.
// Talks to the CareSphere FastAPI backend (see backend/app/routers/email.py).
// Email templates and SMTP delivery live on the backend.

import { apiFetch } from "./api-client"

export interface EmailRecipient {
  email: string
  name: string
  role?: "parent" | "teacher" | "counselor" | "admin"
}

export interface StudentAlertData {
  studentId: string
  studentName: string
  riskLevel: "Low" | "Medium" | "High"
  riskScore: number
  riskFactors: string[]
  recommendations: string[]
  parentEmail: string
  parentName?: string
}

export interface EmailTemplate {
  subject: string
  htmlContent: string
  textContent: string
}

export interface EmailAlert {
  id: string
  type: "high_risk" | "attendance_warning" | "academic_concern" | "fee_reminder" | "counseling_scheduled"
  studentId: string
  recipients: EmailRecipient[]
  subject: string
  content: string
  status: "pending" | "sent" | "failed"
  scheduledAt: string
  sentAt?: string
  error?: string
}

interface EmailResult {
  success: boolean
  message: string
  dry_run: boolean
}

class EmailService {
  /**
   * Send a high-risk student alert to the parent (and staff, on the backend).
   */
  async sendHighRiskAlert(alertData: StudentAlertData): Promise<boolean> {
    const res = await apiFetch<EmailResult>("/email/send-alert", {
      method: "POST",
      body: JSON.stringify({ type: "high_risk", alertData }),
    })
    return res.success
  }

  /**
   * Send an attendance warning to a parent.
   */
  async sendAttendanceWarning(
    studentId: string,
    studentName: string,
    attendancePercentage: number,
    parentEmail: string,
    parentName?: string,
  ): Promise<boolean> {
    const res = await apiFetch<EmailResult>("/email/send-alert", {
      method: "POST",
      body: JSON.stringify({
        type: "attendance_warning",
        alertData: { studentId, studentName, attendancePercentage, parentEmail, parentName },
      }),
    })
    return res.success
  }

  /**
   * Send a fee reminder to a parent.
   */
  async sendFeeReminder(
    studentId: string,
    studentName: string,
    pendingAmount: number,
    dueDate: string,
    parentEmail: string,
    parentName?: string,
  ): Promise<boolean> {
    const res = await apiFetch<EmailResult>("/email/send-alert", {
      method: "POST",
      body: JSON.stringify({
        type: "fee_reminder",
        alertData: { studentId, studentName, pendingAmount, dueDate, parentEmail, parentName },
      }),
    })
    return res.success
  }

  /**
   * Send a counseling session notification to a parent.
   */
  async sendCounselingNotification(
    studentId: string,
    studentName: string,
    sessionDate: string,
    sessionType: string,
    parentEmail: string,
    parentName?: string,
  ): Promise<boolean> {
    const res = await apiFetch<EmailResult>("/email/send-alert", {
      method: "POST",
      body: JSON.stringify({
        type: "counseling_notification",
        alertData: { studentId, studentName, sessionDate, sessionType, parentEmail, parentName },
      }),
    })
    return res.success
  }

  /**
   * Send high-risk alerts for multiple students in one request.
   */
  async sendBulkAlerts(alerts: StudentAlertData[]): Promise<{ sent: number; failed: number }> {
    const res = await apiFetch<{ sent: number; failed: number }>("/email/bulk-alerts", {
      method: "POST",
      body: JSON.stringify({ alerts }),
    })
    return { sent: res.sent, failed: res.failed }
  }
}

export const emailService = new EmailService()
