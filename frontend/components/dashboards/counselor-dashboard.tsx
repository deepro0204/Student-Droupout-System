"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  AlertTriangle,
  Heart,
  MessageSquare,
  Calendar,
  Search,
  Mail,
  Phone,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  User,
  BarChart3,
  PieChart,
} from "lucide-react"

const highRiskStudents = [
  {
    id: "STU003",
    name: "Student3",
    age: 21,
    gender: "Male",
    course: "Computer Science",
    semester: "8th",
    gpa: 2.1,
    attendance: 45,
    riskLevel: "High",
    riskScore: 85,
    parentEmail: "parent3@email.com",
    parentPhone: "+91-98765-43210",
    lastCounseling: "2024-01-10",
    riskFactors: [
      "Very low attendance (45%)",
      "Declining GPA (2.1)",
      "Multiple failed subjects",
      "Overdue fees",
      "No recent parent contact",
    ],
    interventions: [
      {
        date: "2024-01-10",
        type: "Individual Counseling",
        status: "completed",
        notes: "Discussed academic challenges",
      },
      { date: "2024-01-05", type: "Parent Meeting", status: "scheduled", notes: "Meeting with parents scheduled" },
    ],
    aiRecommendations: [
      "Schedule immediate academic support sessions",
      "Arrange parent-teacher conference",
      "Consider reduced course load",
      "Provide mental health resources",
    ],
  },
  {
    id: "STU007",
    name: "Student7",
    age: 19,
    gender: "Male",
    course: "Electrical Engineering",
    semester: "4th",
    gpa: 2.3,
    attendance: 62,
    riskLevel: "High",
    riskScore: 78,
    parentEmail: "parent7@email.com",
    parentPhone: "+91-98765-43211",
    lastCounseling: "2024-01-12",
    riskFactors: ["Low attendance", "Struggling with core subjects", "Social isolation", "Financial stress"],
    interventions: [
      {
        date: "2024-01-12",
        type: "Group Counseling",
        status: "completed",
        notes: "Participated in peer support group",
      },
      { date: "2024-01-08", type: "Academic Planning", status: "completed", notes: "Created study schedule" },
    ],
    aiRecommendations: [
      "Connect with peer mentoring program",
      "Explore financial aid options",
      "Schedule regular check-ins",
      "Refer to academic tutoring services",
    ],
  },
  {
    id: "STU012",
    name: "Student12",
    age: 20,
    gender: "Female",
    course: "Mechanical Engineering",
    semester: "6th",
    gpa: 2.5,
    attendance: 58,
    riskLevel: "High",
    riskScore: 72,
    parentEmail: "parent12@email.com",
    parentPhone: "+91-98765-43212",
    lastCounseling: "Never",
    riskFactors: ["Inconsistent attendance", "Personal issues", "Academic probation", "Lack of engagement"],
    interventions: [],
    aiRecommendations: [
      "Schedule initial counseling session",
      "Assess personal circumstances",
      "Develop personalized support plan",
      "Connect with campus resources",
    ],
  },
]

const mediumRiskStudents = [
  {
    id: "STU001",
    name: "Student1",
    age: 20,
    gender: "Male",
    course: "Computer Science",
    semester: "6th",
    gpa: 3.2,
    attendance: 78,
    riskLevel: "Medium",
    riskScore: 55,
    parentEmail: "parent1@email.com",
    lastCounseling: "2024-01-08",
    riskFactors: ["Declining attendance", "Pending fees", "Stress indicators"],
  },
]

const counselingStats = {
  totalHighRisk: highRiskStudents.length,
  totalMediumRisk: mediumRiskStudents.length,
  sessionsThisWeek: 12,
  successfulInterventions: 8,
  pendingFollowUps: 5,
  parentMeetingsScheduled: 3,
}

const upcomingAppointments = [
  { id: 1, student: "Student3", time: "10:00 AM", date: "Today", type: "Individual Counseling" },
  { id: 2, student: "Student7", time: "2:00 PM", date: "Today", type: "Follow-up Session" },
  { id: 3, student: "Student12", time: "11:00 AM", date: "Tomorrow", type: "Initial Assessment" },
  { id: 4, student: "Student1", time: "3:00 PM", date: "Tomorrow", type: "Academic Planning" },
]

export function CounselorDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<(typeof highRiskStudents)[0] | null>(null)
  const [isInterventionOpen, setIsInterventionOpen] = useState(false)
  const [isScheduleSessionOpen, setIsScheduleSessionOpen] = useState(false)
  const { toast } = useToast()

  const allRiskStudents = [...highRiskStudents, ...mediumRiskStudents]
  const filteredStudents = allRiskStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-100 border-red-200"
      case "medium":
        return "text-amber-600 bg-amber-100 border-amber-200"
      case "low":
        return "text-green-600 bg-green-100 border-green-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const getInterventionStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100 border-green-200"
      case "scheduled":
        return "text-blue-600 bg-blue-100 border-blue-200"
      case "pending":
        return "text-amber-600 bg-amber-100 border-amber-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const handleScheduleSession = () => {
    toast({
      title: "Session Scheduled Successfully",
      description: "The counseling session has been added to your calendar.",
      className: "bg-green-50 border-green-200 text-green-800",
    })
    setIsScheduleSessionOpen(true)
  }

  const handleScheduleSessionSubmit = () => {
    toast({
      title: "Session Scheduled Successfully",
      description: "The counseling session has been added to your calendar.",
      className: "bg-green-50 border-green-200 text-green-800",
    })
    setIsScheduleSessionOpen(false)
  }

  const handleGenerateWeeklyReport = () => {
    const reportData = `
WEEKLY SUMMARY REPORT
====================
Generated on: ${new Date().toLocaleString()}

COUNSELING STATISTICS:
- High Risk Students: ${counselingStats.totalHighRisk}
- Medium Risk Students: ${counselingStats.totalMediumRisk}
- Sessions This Week: ${counselingStats.sessionsThisWeek}
- Successful Interventions: ${counselingStats.successfulInterventions}
- Pending Follow-ups: ${counselingStats.pendingFollowUps}

RISK DISTRIBUTION CHART:
High Risk: ${"█".repeat(Math.round((counselingStats.totalHighRisk / (counselingStats.totalHighRisk + counselingStats.totalMediumRisk)) * 20))} (${counselingStats.totalHighRisk})
Medium Risk: ${"▓".repeat(Math.round((counselingStats.totalMediumRisk / (counselingStats.totalHighRisk + counselingStats.totalMediumRisk)) * 20))} (${counselingStats.totalMediumRisk})

SESSION EFFECTIVENESS:
Success Rate: ${Math.round((counselingStats.successfulInterventions / counselingStats.sessionsThisWeek) * 100)}%
${"█".repeat(Math.round((counselingStats.successfulInterventions / counselingStats.sessionsThisWeek) * 20))}

HIGH RISK STUDENTS DETAILS:
${highRiskStudents
  .map(
    (student) => `
- ${student.name} (${student.id})
  Risk Score: ${student.riskScore}/100
  GPA: ${student.gpa}
  Attendance: ${student.attendance}%
  Last Counseling: ${student.lastCounseling}
`,
  )
  .join("")}
    `

    const blob = new Blob([reportData], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Weekly_Summary_Report_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Weekly Summary Report Generated",
      description: "Report has been downloaded successfully with charts and analytics.",
      className: "bg-green-50 border-green-200 text-green-800",
    })
  }

  const handleGenerateInterventionReport = () => {
    const reportData = `
INTERVENTION OUTCOMES REPORT
===========================
Generated on: ${new Date().toLocaleString()}

INTERVENTION EFFECTIVENESS CHART:
Successful: ${"█".repeat(Math.round((counselingStats.successfulInterventions / counselingStats.sessionsThisWeek) * 20))} (${counselingStats.successfulInterventions})
In Progress: ${"▓".repeat(Math.round((counselingStats.pendingFollowUps / counselingStats.sessionsThisWeek) * 20))} (${counselingStats.pendingFollowUps})

INTERVENTION TYPES BREAKDOWN:
Individual Counseling: ${"█".repeat(15)} (60%)
Group Sessions: ${"▓".repeat(8)} (30%)
Parent Meetings: ${"░".repeat(3)} (10%)

STUDENT PROGRESS TRACKING:
${highRiskStudents
  .map(
    (student) => `
${student.name} (${student.id}):
- Risk Score Trend: ${student.riskScore}/100
- Interventions: ${student.interventions.length}
- Status: ${student.interventions.length > 0 ? "Active" : "Pending"}
- Progress: ${"█".repeat(Math.round((100 - student.riskScore) / 5))}
`,
  )
  .join("")}
    `

    const blob = new Blob([reportData], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Intervention_Outcomes_Report_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Intervention Outcomes Report Generated",
      description: "Detailed intervention analysis with progress charts downloaded.",
      className: "bg-green-50 border-green-200 text-green-800",
    })
  }

  const handleGenerateRiskAssessmentReport = () => {
    const reportData = `
RISK ASSESSMENT REPORT
=====================
Generated on: ${new Date().toLocaleString()}

RISK LEVEL DISTRIBUTION:
High Risk: ${counselingStats.totalHighRisk} students (${Math.round((counselingStats.totalHighRisk / (counselingStats.totalHighRisk + counselingStats.totalMediumRisk)) * 100)}%)
Medium Risk: ${counselingStats.totalMediumRisk} students (${Math.round((counselingStats.totalMediumRisk / (counselingStats.totalHighRisk + counselingStats.totalMediumRisk)) * 100)}%)

PIE CHART REPRESENTATION:
High Risk: ${"█".repeat(Math.round((counselingStats.totalHighRisk / (counselingStats.totalHighRisk + counselingStats.totalMediumRisk)) * 20))}
Medium Risk: ${"▓".repeat(Math.round((counselingStats.totalMediumRisk / (counselingStats.totalHighRisk + counselingStats.totalMediumRisk)) * 20))}

RISK FACTORS ANALYSIS:
Academic Performance: ${"█".repeat(18)} (90%)
Attendance Issues: ${"█".repeat(16)} (80%)
Financial Stress: ${"█".repeat(12)} (60%)
Social Issues: ${"█".repeat(8)} (40%)

DETAILED RISK ASSESSMENTS:
${highRiskStudents
  .map(
    (student) => `
${student.name} (${student.id}):
- Risk Score: ${student.riskScore}/100
- Primary Factors: ${student.riskFactors.slice(0, 3).join(", ")}
- Recommendation Priority: ${student.riskScore > 80 ? "URGENT" : "HIGH"}
`,
  )
  .join("")}
    `

    const blob = new Blob([reportData], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Risk_Assessment_Report_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Risk Assessment Report Generated",
      description: "Comprehensive risk analysis with visual charts downloaded.",
      className: "bg-green-50 border-green-200 text-green-800",
    })
  }

  const handleGenerateWellbeingReport = () => {
    const reportData = `
STUDENT WELLBEING REPORT
=======================
Generated on: ${new Date().toLocaleString()}

WELLBEING METRICS:
Overall Wellbeing Score: 72/100
Mental Health Support: ${counselingStats.sessionsThisWeek} sessions this week
Student Satisfaction: 85%

WELLBEING TREND CHART:
Excellent: ${"█".repeat(6)} (30%)
Good: ${"▓".repeat(8)} (40%)
Fair: ${"░".repeat(4)} (20%)
Poor: ${"▒".repeat(2)} (10%)

SUPPORT SERVICES UTILIZATION:
Counseling Services: ${"█".repeat(15)} (75%)
Academic Support: ${"▓".repeat(12)} (60%)
Financial Aid: ${"░".repeat(8)} (40%)
Health Services: ${"▒".repeat(6)} (30%)

STUDENT FEEDBACK SUMMARY:
- Counseling Effectiveness: 4.2/5.0
- Accessibility of Services: 4.0/5.0
- Response Time: 3.8/5.0
- Overall Satisfaction: 4.1/5.0

INTERVENTION SUCCESS STORIES:
${highRiskStudents
  .filter((s) => s.interventions.length > 0)
  .map(
    (student) => `
${student.name}: Improved from risk score ${student.riskScore + 15} to ${student.riskScore}
- Interventions: ${student.interventions.length}
- Progress: ${"█".repeat(Math.round((100 - student.riskScore) / 10))}
`,
  )
  .join("")}
    `

    const blob = new Blob([reportData], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Student_Wellbeing_Report_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Student Wellbeing Report Generated",
      description: "Comprehensive wellbeing analysis with satisfaction metrics downloaded.",
      className: "bg-green-50 border-green-200 text-green-800",
    })
  }

  const handleViewStudent = (student: (typeof highRiskStudents)[0]) => {
    console.log("[v0] Viewing student details:", student.name)
    setSelectedStudent(student)
  }

  const handleStartCounseling = (student: (typeof highRiskStudents)[0]) => {
    toast({
      title: "Counseling Session Started",
      description: `Session initiated with ${student.name}. Session room prepared.`,
      className: "bg-green-50 border-green-200 text-green-800",
    })
  }

  const handleContactParent = (student: (typeof highRiskStudents)[0]) => {
    toast({
      title: "Parent Contact Initiated",
      description: `Email sent to ${student.parentEmail} regarding ${student.name}.`,
      className: "bg-green-50 border-green-200 text-green-800",
    })
  }

  const handleScheduleIntervention = () => {
    toast({
      title: "Intervention Scheduled",
      description: "The intervention has been added to your calendar successfully.",
      className: "bg-green-50 border-green-200 text-green-800",
    })
    setIsInterventionOpen(false)
  }

  const handleAppointmentAction = (appointment: (typeof upcomingAppointments)[0], action: string) => {
    toast({
      title: `${action} Initiated`,
      description: `${action} for ${appointment.student} at ${appointment.time}`,
      className: "bg-green-50 border-green-200 text-green-800",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Counselor Dashboard
            </h1>
            <p className="text-gray-600">Support high-risk students and track intervention outcomes</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isScheduleSessionOpen} onOpenChange={setIsScheduleSessionOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-pink-200 bg-white hover:bg-pink-50 text-pink-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Session
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-pink-200">
                <DialogHeader>
                  <DialogTitle className="text-pink-700">Schedule New Counseling Session</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Create a new counseling session appointment
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-select" className="text-gray-700">
                      Select Student
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-white border-gray-300 focus:border-pink-500">
                        <SelectValue placeholder="Choose a student" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {highRiskStudents.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} - {student.riskLevel} Risk
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-type" className="text-gray-700">
                      Session Type
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-white border-gray-300 focus:border-pink-500">
                        <SelectValue placeholder="Select session type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="individual">Individual Counseling</SelectItem>
                        <SelectItem value="group">Group Session</SelectItem>
                        <SelectItem value="parent">Parent Meeting</SelectItem>
                        <SelectItem value="academic">Academic Planning</SelectItem>
                        <SelectItem value="crisis">Crisis Intervention</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-date" className="text-gray-700">
                      Date & Time
                    </Label>
                    <Input
                      id="session-date"
                      type="datetime-local"
                      className="bg-white border-gray-300 focus:border-pink-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-notes" className="text-gray-700">
                      Session Notes
                    </Label>
                    <Textarea
                      id="session-notes"
                      placeholder="Session objectives and preparation notes..."
                      className="bg-white border-gray-300 focus:border-pink-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleScheduleSessionSubmit}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    >
                      Schedule Session
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-white border-gray-300 hover:bg-gray-50"
                      onClick={() => setIsScheduleSessionOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              onClick={handleGenerateWeeklyReport}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">High Risk Students</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800">{counselingStats.totalHighRisk}</div>
              <p className="text-xs text-red-600">Requiring immediate attention</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Sessions This Week</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{counselingStats.sessionsThisWeek}</div>
              <p className="text-xs text-blue-600">Individual and group sessions</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Successful Interventions</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{counselingStats.successfulInterventions}</div>
              <p className="text-xs text-green-600">This month</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-700">Pending Follow-ups</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-800">{counselingStats.pendingFollowUps}</div>
              <p className="text-xs text-amber-600">Require attention</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="high-risk" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-pink-200">
            <TabsTrigger
              value="high-risk"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              High Risk Students
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              Appointments
            </TabsTrigger>
            <TabsTrigger
              value="interventions"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              Interventions
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="high-risk" className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* High Risk Students Table */}
            <Card className="border-pink-200 bg-white hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  High Risk Students
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Students requiring immediate counseling intervention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-pink-200">
                      <TableHead className="text-gray-700">Student</TableHead>
                      <TableHead className="text-gray-700">Risk Score</TableHead>
                      <TableHead className="text-gray-700">GPA</TableHead>
                      <TableHead className="text-gray-700">Attendance</TableHead>
                      <TableHead className="text-gray-700">Last Session</TableHead>
                      <TableHead className="text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents
                      .filter((s) => s.riskLevel === "High")
                      .map((student) => (
                        <TableRow key={student.id} className="border-pink-100 hover:bg-pink-50">
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-800">{student.name}</p>
                              <p className="text-sm text-gray-600">
                                {student.course} - {student.semester} Sem
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={student.riskScore}
                                className="h-2 w-16 bg-red-100 [&>div]:bg-gradient-to-r [&>div]:from-red-400 [&>div]:to-red-600"
                              />
                              <span className="text-red-600 font-bold">{student.riskScore}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-red-600 font-medium">{student.gpa}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-red-600 font-medium">{student.attendance}%</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-700">{student.lastCounseling}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewStudent(student)}
                                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                              >
                                <User className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStartCounseling(student)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleContactParent(student)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
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

            {/* Student Details Modal */}
            {selectedStudent && (
              <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
                <DialogContent className="bg-card border-border max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      {selectedStudent.name} - Detailed Assessment
                    </DialogTitle>
                    <DialogDescription>Comprehensive view and intervention planning</DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Student Information */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Student Information</h3>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="text-muted-foreground">ID:</span> {selectedStudent.id}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Age:</span> {selectedStudent.age}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Course:</span> {selectedStudent.course}
                          </p>
                          <p>
                            <span className="text-muted-foreground">GPA:</span>{" "}
                            <span className="text-red-600 font-medium">{selectedStudent.gpa}</span>
                          </p>
                          <p>
                            <span className="text-muted-foreground">Attendance:</span>{" "}
                            <span className="text-red-600 font-medium">{selectedStudent.attendance}%</span>
                          </p>
                          <p>
                            <span className="text-muted-foreground">Risk Score:</span>{" "}
                            <span className="text-red-600 font-bold">{selectedStudent.riskScore}/100</span>
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="text-muted-foreground">Parent Email:</span> {selectedStudent.parentEmail}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Parent Phone:</span> {selectedStudent.parentPhone}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Risk Factors</h3>
                        <div className="space-y-2">
                          {selectedStudent.riskFactors.map((factor, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <AlertTriangle className="h-3 w-3 text-red-600" />
                              <span>{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Interventions and Recommendations */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Previous Interventions</h3>
                        <div className="space-y-3">
                          {selectedStudent.interventions.length > 0 ? (
                            selectedStudent.interventions.map((intervention, index) => (
                              <div key={index} className="p-3 rounded-lg bg-muted/30 border border-border">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-sm">{intervention.type}</span>
                                  <Badge className={getInterventionStatusColor(intervention.status)}>
                                    {intervention.status}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-1">{intervention.date}</p>
                                <p className="text-sm">{intervention.notes}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No previous interventions recorded</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">AI Recommendations</h3>
                        <div className="space-y-2">
                          {selectedStudent.aiRecommendations.map((rec, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Dialog open={isInterventionOpen} onOpenChange={setIsInterventionOpen}>
                          <DialogTrigger asChild>
                            <Button className="flex-1 bg-primary hover:bg-primary/90">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Schedule Session
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card border-border">
                            <DialogHeader>
                              <DialogTitle>Schedule Counseling Session</DialogTitle>
                              <DialogDescription>Plan intervention for {selectedStudent.name}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Session Type</Label>
                                <Select>
                                  <SelectTrigger className="bg-input border-border">
                                    <SelectValue placeholder="Select session type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="individual">Individual Counseling</SelectItem>
                                    <SelectItem value="group">Group Session</SelectItem>
                                    <SelectItem value="parent">Parent Meeting</SelectItem>
                                    <SelectItem value="academic">Academic Planning</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Notes</Label>
                                <Textarea
                                  placeholder="Session objectives and notes..."
                                  className="bg-input border-border"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={handleScheduleIntervention}
                                  className="flex-1 bg-primary hover:bg-primary/90"
                                >
                                  Schedule
                                </Button>
                                <Button
                                  variant="outline"
                                  className="flex-1 bg-transparent"
                                  onClick={() => setIsInterventionOpen(false)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          onClick={() => selectedStudent && handleContactParent(selectedStudent)}
                          variant="outline"
                          className="flex-1 bg-transparent border-border"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Contact Parent
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <Card className="border-purple-200 bg-white hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Upcoming Appointments
                </CardTitle>
                <CardDescription className="text-gray-600">Scheduled counseling sessions and meetings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200">
                          <span className="text-xs text-purple-600 font-medium">{appointment.date}</span>
                          <span className="text-sm font-bold text-purple-700">{appointment.time}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{appointment.student}</p>
                          <p className="text-sm text-gray-600">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAppointmentAction(appointment, "Start Session")}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAppointmentAction(appointment, "Call Student")}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interventions" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Intervention Tracking</CardTitle>
                <CardDescription>Monitor the effectiveness of counseling interventions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-green-400/10 border border-green-400/20">
                      <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-400">8</p>
                      <p className="text-sm text-muted-foreground">Successful Interventions</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                      <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-yellow-400">5</p>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-blue-400/10 border border-blue-400/20">
                      <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-400">12</p>
                      <p className="text-sm text-muted-foreground">Sessions This Week</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Counseling Reports
                </CardTitle>
                <CardDescription>Generate and download comprehensive counseling reports with charts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={handleGenerateWeeklyReport}
                    variant="outline"
                    className="h-24 flex-col gap-2 border-border bg-transparent hover:bg-blue-50"
                  >
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-blue-700 font-medium">Weekly Summary Report</span>
                  </Button>
                  <Button
                    onClick={handleGenerateInterventionReport}
                    variant="outline"
                    className="h-24 flex-col gap-2 border-border bg-transparent hover:bg-green-50"
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                      <BarChart3 className="h-6 w-6 text-green-600" />
                    </div>
                    <span className="text-green-700 font-medium">Intervention Outcomes</span>
                  </Button>
                  <Button
                    onClick={handleGenerateRiskAssessmentReport}
                    variant="outline"
                    className="h-24 flex-col gap-2 border-border bg-transparent hover:bg-red-50"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                      <PieChart className="h-6 w-6 text-red-600" />
                    </div>
                    <span className="text-red-700 font-medium">Risk Assessment Report</span>
                  </Button>
                  <Button
                    onClick={handleGenerateWellbeingReport}
                    variant="outline"
                    className="h-24 flex-col gap-2 border-border bg-transparent hover:bg-purple-50"
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="h-6 w-6 text-purple-600" />
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                    <span className="text-purple-700 font-medium">Student Wellbeing Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
