// Email service for sending automated alerts to parents and staff
// This service handles various types of notifications for the student management system

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

class EmailService {
  private apiKey: string
  private fromEmail: string
  private fromName: string

  constructor() {
    // Replace with your actual email service credentials
    this.apiKey = process.env.EMAIL_API_KEY || ""
    this.fromEmail = process.env.FROM_EMAIL || "noreply@studentmanagement.edu"
    this.fromName = process.env.FROM_NAME || "Student Management System"
  }

  /**
   * Send high-risk student alert to parents and counselors
   */
  async sendHighRiskAlert(alertData: StudentAlertData): Promise<boolean> {
    try {
      const template = this.generateHighRiskTemplate(alertData)
      const recipients: EmailRecipient[] = [
        { email: alertData.parentEmail, name: alertData.parentName || "Parent", role: "parent" },
      ]

      // Add counselors and relevant staff
      // In a real implementation, you'd fetch these from your database
      const staffRecipients = await this.getRelevantStaff(alertData.studentId)
      recipients.push(...staffRecipients)

      const emailAlert: EmailAlert = {
        id: `alert_${Date.now()}_${alertData.studentId}`,
        type: "high_risk",
        studentId: alertData.studentId,
        recipients,
        subject: template.subject,
        content: template.htmlContent,
        status: "pending",
        scheduledAt: new Date().toISOString(),
      }

      return await this.sendEmail(emailAlert)
    } catch (error) {
      console.error("Error sending high-risk alert:", error)
      return false
    }
  }

  /**
   * Send attendance warning to parents
   */
  async sendAttendanceWarning(
    studentId: string,
    studentName: string,
    attendancePercentage: number,
    parentEmail: string,
    parentName?: string,
  ): Promise<boolean> {
    try {
      const template = this.generateAttendanceWarningTemplate(studentName, attendancePercentage)
      const recipients: EmailRecipient[] = [{ email: parentEmail, name: parentName || "Parent", role: "parent" }]

      const emailAlert: EmailAlert = {
        id: `attendance_${Date.now()}_${studentId}`,
        type: "attendance_warning",
        studentId,
        recipients,
        subject: template.subject,
        content: template.htmlContent,
        status: "pending",
        scheduledAt: new Date().toISOString(),
      }

      return await this.sendEmail(emailAlert)
    } catch (error) {
      console.error("Error sending attendance warning:", error)
      return false
    }
  }

  /**
   * Send fee reminder to parents
   */
  async sendFeeReminder(
    studentId: string,
    studentName: string,
    pendingAmount: number,
    dueDate: string,
    parentEmail: string,
    parentName?: string,
  ): Promise<boolean> {
    try {
      const template = this.generateFeeReminderTemplate(studentName, pendingAmount, dueDate)
      const recipients: EmailRecipient[] = [{ email: parentEmail, name: parentName || "Parent", role: "parent" }]

      const emailAlert: EmailAlert = {
        id: `fee_${Date.now()}_${studentId}`,
        type: "fee_reminder",
        studentId,
        recipients,
        subject: template.subject,
        content: template.htmlContent,
        status: "pending",
        scheduledAt: new Date().toISOString(),
      }

      return await this.sendEmail(emailAlert)
    } catch (error) {
      console.error("Error sending fee reminder:", error)
      return false
    }
  }

  /**
   * Send counseling session notification
   */
  async sendCounselingNotification(
    studentId: string,
    studentName: string,
    sessionDate: string,
    sessionType: string,
    parentEmail: string,
    parentName?: string,
  ): Promise<boolean> {
    try {
      const template = this.generateCounselingNotificationTemplate(studentName, sessionDate, sessionType)
      const recipients: EmailRecipient[] = [{ email: parentEmail, name: parentName || "Parent", role: "parent" }]

      const emailAlert: EmailAlert = {
        id: `counseling_${Date.now()}_${studentId}`,
        type: "counseling_scheduled",
        studentId,
        recipients,
        subject: template.subject,
        content: template.htmlContent,
        status: "pending",
        scheduledAt: new Date().toISOString(),
      }

      return await this.sendEmail(emailAlert)
    } catch (error) {
      console.error("Error sending counseling notification:", error)
      return false
    }
  }

  /**
   * Send bulk alerts for multiple students
   */
  async sendBulkAlerts(alerts: StudentAlertData[]): Promise<{ sent: number; failed: number }> {
    let sent = 0
    let failed = 0

    for (const alert of alerts) {
      const success = await this.sendHighRiskAlert(alert)
      if (success) sent++
      else failed++

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    return { sent, failed }
  }

  /**
   * Core email sending function
   */
  private async sendEmail(emailAlert: EmailAlert): Promise<boolean> {
    try {
      // Mock email sending - replace with actual email service integration
      console.log(`[EMAIL SERVICE] Sending email:`, {
        id: emailAlert.id,
        type: emailAlert.type,
        recipients: emailAlert.recipients.map((r) => r.email),
        subject: emailAlert.subject,
      })

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // In a real implementation, you would integrate with services like:
      // - SendGrid
      // - AWS SES
      // - Mailgun
      // - Resend
      // - Nodemailer with SMTP

      /*
      // Example with SendGrid:
      const sgMail = require('@sendgrid/mail')
      sgMail.setApiKey(this.apiKey)

      const msg = {
        to: emailAlert.recipients.map(r => ({ email: r.email, name: r.name })),
        from: { email: this.fromEmail, name: this.fromName },
        subject: emailAlert.subject,
        html: emailAlert.content,
      }

      await sgMail.send(msg)
      */

      // Mock success (90% success rate for demo)
      const success = Math.random() > 0.1

      if (success) {
        emailAlert.status = "sent"
        emailAlert.sentAt = new Date().toISOString()
        console.log(`[EMAIL SERVICE] Email sent successfully: ${emailAlert.id}`)
      } else {
        emailAlert.status = "failed"
        emailAlert.error = "Mock failure for demonstration"
        console.log(`[EMAIL SERVICE] Email failed: ${emailAlert.id}`)
      }

      // Store email log in database (implement as needed)
      await this.logEmailAlert(emailAlert)

      return success
    } catch (error) {
      console.error("Error in sendEmail:", error)
      emailAlert.status = "failed"
      emailAlert.error = error instanceof Error ? error.message : "Unknown error"
      await this.logEmailAlert(emailAlert)
      return false
    }
  }

  /**
   * Generate high-risk alert email template
   */
  private generateHighRiskTemplate(alertData: StudentAlertData): EmailTemplate {
    const subject = `URGENT: Academic Support Needed for ${alertData.studentName}`

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Student Alert</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .risk-score { background: #fee2e2; border: 1px solid #fecaca; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .factors { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .recommendations { background: #eff6ff; border: 1px solid #dbeafe; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            ul { padding-left: 20px; }
            li { margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Student Academic Alert</h1>
              <p>Immediate attention required for ${alertData.studentName}</p>
            </div>
            
            <div class="content">
              <p>Dear Parent/Guardian,</p>
              
              <p>Our AI-powered student monitoring system has identified that <strong>${alertData.studentName}</strong> (ID: ${alertData.studentId}) is currently at <strong>${alertData.riskLevel} risk</strong> for academic challenges.</p>
              
              <div class="risk-score">
                <h3>Risk Assessment</h3>
                <p><strong>Risk Level:</strong> ${alertData.riskLevel}</p>
                <p><strong>Risk Score:</strong> ${alertData.riskScore}/100</p>
              </div>
              
              <div class="factors">
                <h3>Contributing Factors:</h3>
                <ul>
                  ${alertData.riskFactors.map((factor) => `<li>${factor}</li>`).join("")}
                </ul>
              </div>
              
              <div class="recommendations">
                <h3>Recommended Actions:</h3>
                <ul>
                  ${alertData.recommendations.map((rec) => `<li>${rec}</li>`).join("")}
                </ul>
              </div>
              
              <p>We strongly encourage you to contact our counseling team to discuss support options for ${alertData.studentName}. Early intervention can make a significant difference in academic outcomes.</p>
              
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Schedule a meeting with the academic counselor</li>
                <li>Review ${alertData.studentName}'s current academic standing</li>
                <li>Discuss available support resources</li>
                <li>Create a personalized improvement plan</li>
              </ul>
              
              <p>Please contact us at your earliest convenience to arrange a meeting.</p>
              
              <p>Best regards,<br>
              Student Support Team<br>
              Academic Affairs Office</p>
            </div>
            
            <div class="footer">
              <p>This is an automated message from the Student Management System.</p>
              <p>If you have questions, please contact our support team.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const textContent = `
      STUDENT ACADEMIC ALERT - IMMEDIATE ATTENTION REQUIRED
      
      Dear Parent/Guardian,
      
      Our student monitoring system has identified that ${alertData.studentName} (ID: ${alertData.studentId}) is currently at ${alertData.riskLevel} risk for academic challenges.
      
      Risk Assessment:
      - Risk Level: ${alertData.riskLevel}
      - Risk Score: ${alertData.riskScore}/100
      
      Contributing Factors:
      ${alertData.riskFactors.map((factor) => `- ${factor}`).join("\n")}
      
      Recommended Actions:
      ${alertData.recommendations.map((rec) => `- ${rec}`).join("\n")}
      
      Please contact our counseling team immediately to discuss support options.
      
      Best regards,
      Student Support Team
    `

    return { subject, htmlContent, textContent }
  }

  /**
   * Generate attendance warning email template
   */
  private generateAttendanceWarningTemplate(studentName: string, attendancePercentage: number): EmailTemplate {
    const subject = `Attendance Concern: ${studentName}`

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Attendance Warning</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .attendance-info { background: #fef3c7; border: 1px solid #fde68a; padding: 15px; margin: 15px 0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Attendance Warning</h1>
            </div>
            
            <div class="content">
              <p>Dear Parent/Guardian,</p>
              
              <p>We are writing to inform you about ${studentName}'s attendance record.</p>
              
              <div class="attendance-info">
                <h3>Current Attendance: ${attendancePercentage}%</h3>
                <p>This is below our minimum requirement of 75% attendance.</p>
              </div>
              
              <p>Regular attendance is crucial for academic success. Please contact us to discuss any challenges that may be affecting attendance.</p>
              
              <p>Best regards,<br>Academic Affairs Office</p>
            </div>
          </div>
        </body>
      </html>
    `

    const textContent = `
      ATTENDANCE WARNING
      
      Dear Parent/Guardian,
      
      ${studentName}'s current attendance is ${attendancePercentage}%, which is below our minimum requirement.
      
      Please contact us to discuss this matter.
      
      Best regards,
      Academic Affairs Office
    `

    return { subject, htmlContent, textContent }
  }

  /**
   * Generate fee reminder email template
   */
  private generateFeeReminderTemplate(studentName: string, pendingAmount: number, dueDate: string): EmailTemplate {
    const subject = `Fee Payment Reminder: ${studentName}`

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Fee Reminder</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .fee-info { background: #dbeafe; border: 1px solid #93c5fd; padding: 15px; margin: 15px 0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Fee Payment Reminder</h1>
            </div>
            
            <div class="content">
              <p>Dear Parent/Guardian,</p>
              
              <p>This is a reminder about pending fee payment for ${studentName}.</p>
              
              <div class="fee-info">
                <h3>Payment Details:</h3>
                <p><strong>Pending Amount:</strong> $${pendingAmount}</p>
                <p><strong>Due Date:</strong> ${dueDate}</p>
              </div>
              
              <p>Please arrange payment at your earliest convenience to avoid any academic disruptions.</p>
              
              <p>Best regards,<br>Finance Office</p>
            </div>
          </div>
        </body>
      </html>
    `

    const textContent = `
      FEE PAYMENT REMINDER
      
      Dear Parent/Guardian,
      
      Pending fee payment for ${studentName}:
      Amount: $${pendingAmount}
      Due Date: ${dueDate}
      
      Please arrange payment soon.
      
      Best regards,
      Finance Office
    `

    return { subject, htmlContent, textContent }
  }

  /**
   * Generate counseling notification email template
   */
  private generateCounselingNotificationTemplate(
    studentName: string,
    sessionDate: string,
    sessionType: string,
  ): EmailTemplate {
    const subject = `Counseling Session Scheduled: ${studentName}`

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Counseling Session</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .session-info { background: #d1fae5; border: 1px solid #a7f3d0; padding: 15px; margin: 15px 0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Counseling Session Scheduled</h1>
            </div>
            
            <div class="content">
              <p>Dear Parent/Guardian,</p>
              
              <p>A counseling session has been scheduled for ${studentName}.</p>
              
              <div class="session-info">
                <h3>Session Details:</h3>
                <p><strong>Student:</strong> ${studentName}</p>
                <p><strong>Session Type:</strong> ${sessionType}</p>
                <p><strong>Date & Time:</strong> ${sessionDate}</p>
              </div>
              
              <p>This session is designed to provide academic and personal support. Your child's wellbeing and success are our priority.</p>
              
              <p>Best regards,<br>Counseling Services</p>
            </div>
          </div>
        </body>
      </html>
    `

    const textContent = `
      COUNSELING SESSION SCHEDULED
      
      Dear Parent/Guardian,
      
      Session scheduled for ${studentName}:
      Type: ${sessionType}
      Date: ${sessionDate}
      
      Best regards,
      Counseling Services
    `

    return { subject, htmlContent, textContent }
  }

  /**
   * Get relevant staff members for notifications
   */
  private async getRelevantStaff(studentId: string): Promise<EmailRecipient[]> {
    // Mock staff data - replace with actual database queries
    return [
      { email: "counselor@school.edu", name: "Sarah Wilson", role: "counselor" },
      { email: "academic.advisor@school.edu", name: "Dr. Johnson", role: "teacher" },
    ]
  }

  /**
   * Log email alert to database
   */
  private async logEmailAlert(emailAlert: EmailAlert): Promise<void> {
    // In a real implementation, save to database
    console.log(`[EMAIL LOG] ${emailAlert.status.toUpperCase()}: ${emailAlert.id}`)
  }
}

export const emailService = new EmailService()
