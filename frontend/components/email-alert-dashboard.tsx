"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { EmailAlert } from "@/lib/email-service"
import { Mail, Send, CheckCircle, Clock, XCircle, Search, Plus, Users } from "lucide-react"

// Mock email alerts data
const mockEmailAlerts: EmailAlert[] = [
  {
    id: "alert_1704123456_STU003",
    type: "high_risk",
    studentId: "STU003",
    recipients: [
      { email: "mike.parent@email.com", name: "Parent", role: "parent" },
      { email: "counselor@school.edu", name: "Sarah Wilson", role: "counselor" },
    ],
    subject: "URGENT: Academic Support Needed for Mike Johnson",
    content: "High risk alert content...",
    status: "sent",
    scheduledAt: "2024-01-15T10:30:00Z",
    sentAt: "2024-01-15T10:31:00Z",
  },
  {
    id: "attendance_1704123457_STU007",
    type: "attendance_warning",
    studentId: "STU007",
    recipients: [{ email: "alex.parent@email.com", name: "Parent", role: "parent" }],
    subject: "Attendance Concern: Alex Brown",
    content: "Attendance warning content...",
    status: "sent",
    scheduledAt: "2024-01-15T09:15:00Z",
    sentAt: "2024-01-15T09:16:00Z",
  },
  {
    id: "fee_1704123458_STU001",
    type: "fee_reminder",
    studentId: "STU001",
    recipients: [{ email: "john.parent@email.com", name: "Parent", role: "parent" }],
    subject: "Fee Payment Reminder: John Doe",
    content: "Fee reminder content...",
    status: "pending",
    scheduledAt: "2024-01-15T14:00:00Z",
  },
  {
    id: "counseling_1704123459_STU012",
    type: "counseling_scheduled",
    studentId: "STU012",
    recipients: [{ email: "emma.parent@email.com", name: "Parent", role: "parent" }],
    subject: "Counseling Session Scheduled: Emma Davis",
    content: "Counseling notification content...",
    status: "failed",
    scheduledAt: "2024-01-15T11:45:00Z",
    error: "Invalid email address",
  },
]

const alertStats = {
  totalSent: mockEmailAlerts.filter((a) => a.status === "sent").length,
  totalPending: mockEmailAlerts.filter((a) => a.status === "pending").length,
  totalFailed: mockEmailAlerts.filter((a) => a.status === "failed").length,
  todaysSent: mockEmailAlerts.filter(
    (a) => a.status === "sent" && new Date(a.scheduledAt).toDateString() === new Date().toDateString(),
  ).length,
}

export function EmailAlertDashboard() {
  const [alerts, setAlerts] = useState<EmailAlert[]>(mockEmailAlerts)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [isComposingEmail, setIsComposingEmail] = useState(false)
  const [isSendingBulk, setIsSendingBulk] = useState(false)

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.recipients.some((r) => r.email.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = filterStatus === "all" || alert.status === filterStatus
    const matchesType = filterType === "all" || alert.type === filterType

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "text-green-400 bg-green-400/10"
      case "pending":
        return "text-yellow-400 bg-yellow-400/10"
      case "failed":
        return "text-red-400 bg-red-400/10"
      default:
        return "text-foreground bg-muted"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-400" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "high_risk":
        return "High Risk Alert"
      case "attendance_warning":
        return "Attendance Warning"
      case "academic_concern":
        return "Academic Concern"
      case "fee_reminder":
        return "Fee Reminder"
      case "counseling_scheduled":
        return "Counseling Scheduled"
      default:
        return type
    }
  }

  const handleSendBulkAlerts = async () => {
    setIsSendingBulk(true)

    // Mock bulk sending process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update alerts status
    const updatedAlerts = alerts.map((alert) =>
      alert.status === "pending" ? { ...alert, status: "sent" as const, sentAt: new Date().toISOString() } : alert,
    )

    setAlerts(updatedAlerts)
    setIsSendingBulk(false)
  }

  const handleRetryFailed = async (alertId: string) => {
    const updatedAlerts = alerts.map((alert) =>
      alert.id === alertId
        ? { ...alert, status: "sent" as const, sentAt: new Date().toISOString(), error: undefined }
        : alert,
    )
    setAlerts(updatedAlerts)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Alert System</h2>
          <p className="text-muted-foreground">Manage automated notifications to parents and staff</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isComposingEmail} onOpenChange={setIsComposingEmail}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-border bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Compose Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-2xl">
              <DialogHeader>
                <DialogTitle>Compose Custom Alert</DialogTitle>
                <DialogDescription>Send a custom notification to parents or staff</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Alert Type</Label>
                    <Select>
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high_risk">High Risk Alert</SelectItem>
                        <SelectItem value="attendance_warning">Attendance Warning</SelectItem>
                        <SelectItem value="academic_concern">Academic Concern</SelectItem>
                        <SelectItem value="fee_reminder">Fee Reminder</SelectItem>
                        <SelectItem value="custom">Custom Message</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Student ID</Label>
                    <Input placeholder="Enter student ID" className="bg-input border-border" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input placeholder="Email subject" className="bg-input border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Recipients</Label>
                  <Input placeholder="Enter email addresses (comma separated)" className="bg-input border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea placeholder="Enter your message..." className="bg-input border-border min-h-[120px]" />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    <Send className="h-4 w-4 mr-2" />
                    Send Alert
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setIsComposingEmail(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleSendBulkAlerts} disabled={isSendingBulk} className="bg-primary hover:bg-primary/90">
            {isSendingBulk ? <Clock className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            {isSendingBulk ? "Sending..." : "Send Pending"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{alertStats.totalSent}</div>
            <p className="text-xs text-muted-foreground">{alertStats.todaysSent} sent today</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{alertStats.totalPending}</div>
            <p className="text-xs text-muted-foreground">Awaiting delivery</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{alertStats.totalFailed}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Alert History</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32 bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40 bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="high_risk">High Risk</SelectItem>
                <SelectItem value="attendance_warning">Attendance</SelectItem>
                <SelectItem value="fee_reminder">Fee Reminder</SelectItem>
                <SelectItem value="counseling_scheduled">Counseling</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Alerts Table */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Email Alert History
              </CardTitle>
              <CardDescription>Track all automated notifications sent to parents and staff</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{alert.subject}</p>
                          <p className="text-xs text-muted-foreground">Student: {alert.studentId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{getTypeLabel(alert.type)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {alert.recipients.slice(0, 2).map((recipient, index) => (
                            <div key={index} className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{recipient.email}</span>
                            </div>
                          ))}
                          {alert.recipients.length > 2 && (
                            <p className="text-xs text-muted-foreground">+{alert.recipients.length - 2} more</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(alert.status)}
                          <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
                        </div>
                        {alert.error && <p className="text-xs text-red-400 mt-1">{alert.error}</p>}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{new Date(alert.scheduledAt).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(alert.scheduledAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {alert.status === "failed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRetryFailed(alert.id)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Manage automated email templates for different alert types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <h3 className="font-medium mb-2">High Risk Alert Template</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Sent when AI identifies students at high risk of dropout
                  </p>
                  <Button variant="outline" size="sm" className="border-border bg-transparent">
                    Edit Template
                  </Button>
                </div>
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <h3 className="font-medium mb-2">Attendance Warning Template</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Sent when student attendance falls below threshold
                  </p>
                  <Button variant="outline" size="sm" className="border-border bg-transparent">
                    Edit Template
                  </Button>
                </div>
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <h3 className="font-medium mb-2">Fee Reminder Template</h3>
                  <p className="text-sm text-muted-foreground mb-3">Sent for overdue fee payments</p>
                  <Button variant="outline" size="sm" className="border-border bg-transparent">
                    Edit Template
                  </Button>
                </div>
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <h3 className="font-medium mb-2">Counseling Notification Template</h3>
                  <p className="text-sm text-muted-foreground mb-3">Sent when counseling sessions are scheduled</p>
                  <Button variant="outline" size="sm" className="border-border bg-transparent">
                    Edit Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Configure email service settings and automation rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>SMTP Server</Label>
                  <Input placeholder="smtp.example.com" className="bg-input border-border" />
                </div>
                <div className="space-y-2">
                  <Label>From Email</Label>
                  <Input placeholder="noreply@school.edu" className="bg-input border-border" />
                </div>
                <div className="space-y-2">
                  <Label>From Name</Label>
                  <Input placeholder="Student Management System" className="bg-input border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Reply-To Email</Label>
                  <Input placeholder="support@school.edu" className="bg-input border-border" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-medium">Automation Rules</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-sm">High Risk Alert Threshold</p>
                      <p className="text-xs text-muted-foreground">Send alert when risk score exceeds 70</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-border bg-transparent">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-sm">Attendance Warning Threshold</p>
                      <p className="text-xs text-muted-foreground">Send warning when attendance drops below 75%</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-border bg-transparent">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-sm">Fee Reminder Schedule</p>
                      <p className="text-xs text-muted-foreground">Send reminders 7 days before due date</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-border bg-transparent">
                      Configure
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="bg-primary hover:bg-primary/90">Save Configuration</Button>
                <Button variant="outline" className="border-border bg-transparent">
                  Test Email Service
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
