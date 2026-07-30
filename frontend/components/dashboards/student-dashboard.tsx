"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import {
  GraduationCap,
  Calendar,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  BookOpen,
  Download,
} from "lucide-react"

const mockStudentData = {
  personalInfo: {
    studentId: "STU001",
    name: "Student1",
    age: 20,
    gender: "Male",
    course: "Computer Science",
    semester: "6th Semester",
    parentEmail: "parent1@example.com",
  },
  academicPerformance: {
    currentGPA: 3.2,
    totalCredits: 120,
    completedCredits: 90,
    subjects: [
      { name: "Data Structures", grade: "B+", credits: 4 },
      { name: "Database Systems", grade: "A-", credits: 3 },
      { name: "Web Development", grade: "B", credits: 3 },
      { name: "Machine Learning", grade: "C+", credits: 4 },
    ],
  },
  attendance: {
    overall: 78,
    thisMonth: 85,
    subjects: [
      { name: "Data Structures", percentage: 82 },
      { name: "Database Systems", percentage: 90 },
      { name: "Web Development", percentage: 75 },
      { name: "Machine Learning", percentage: 65 },
    ],
  },
  fees: {
    totalAmount: 150000, // Changed to rupees (15000 * 10)
    paidAmount: 120000,
    pendingAmount: 30000,
    dueDate: "2024-02-15",
    status: "Partially Paid",
  },
  riskAssessment: {
    level: "Medium",
    factors: ["Low Attendance in ML", "Pending Fees", "Declining GPA"],
    recommendations: ["Attend counseling session", "Clear pending fees", "Focus on Machine Learning subject"],
  },
}

export function StudentDashboard() {
  const { user } = useAuth()
  const data = mockStudentData
  const { toast } = useToast()

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 85) return "text-emerald-600"
    if (percentage >= 75) return "text-amber-600"
    return "text-red-500"
  }

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "text-emerald-600 bg-emerald-100 border-emerald-200"
      case "medium":
        return "text-amber-600 bg-amber-100 border-amber-200"
      case "high":
        return "text-red-600 bg-red-100 border-red-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const downloadReport = () => {
    // Create a comprehensive report content
    const reportContent = `
STUDENT ACADEMIC REPORT
======================

Personal Information:
- Student ID: ${data.personalInfo.studentId}
- Name: ${data.personalInfo.name}
- Age: ${data.personalInfo.age}
- Gender: ${data.personalInfo.gender}
- Course: ${data.personalInfo.course}
- Semester: ${data.personalInfo.semester}
- Parent Email: ${data.personalInfo.parentEmail}

Academic Performance:
- Current GPA: ${data.academicPerformance.currentGPA}/4.0
- Total Credits: ${data.academicPerformance.totalCredits}
- Completed Credits: ${data.academicPerformance.completedCredits}
- Course Progress: ${Math.round((data.academicPerformance.completedCredits / data.academicPerformance.totalCredits) * 100)}%

Subject Grades:
${data.academicPerformance.subjects.map((subject) => `- ${subject.name}: ${subject.grade} (${subject.credits} credits)`).join("\n")}

Attendance Overview:
- Overall Attendance: ${data.attendance.overall}%
- This Month: ${data.attendance.thisMonth}%

Subject-wise Attendance:
${data.attendance.subjects.map((subject) => `- ${subject.name}: ${subject.percentage}%`).join("\n")}

Fee Information:
- Total Amount: ₹${data.fees.totalAmount.toLocaleString("en-IN")}
- Paid Amount: ₹${data.fees.paidAmount.toLocaleString("en-IN")}
- Pending Amount: ₹${data.fees.pendingAmount.toLocaleString("en-IN")}
- Due Date: ${data.fees.dueDate}
- Status: ${data.fees.status}

Risk Assessment:
- Risk Level: ${data.riskAssessment.level}
- Risk Factors: ${data.riskAssessment.factors.join(", ")}
- Recommendations: ${data.riskAssessment.recommendations.join(", ")}

Generated on: ${new Date().toLocaleString()}
    `

    // Create and download PDF-like text file
    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${data.personalInfo.name}_Academic_Report_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Report Downloaded Successfully",
      description: "Your academic report has been downloaded successfully.",
      className: "bg-green-50 border-green-200 text-green-800",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl">
          <div>
            <h1 className="text-3xl font-bold text-balance">Welcome back, {user?.name || "Student1"}</h1>
            <p className="text-amber-100 text-lg">Here's your academic overview and progress</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={downloadReport}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Badge className={`${getRiskColor(data.riskAssessment.level)} border-2 px-4 py-2 text-sm font-semibold`}>
              Risk Level: {data.riskAssessment.level}
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Current GPA</CardTitle>
              <div className="p-2 bg-blue-100 rounded-full">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{data.academicPerformance.currentGPA}</div>
              <p className="text-sm text-gray-600 font-medium">Out of 4.0</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Overall Attendance</CardTitle>
              <div className="p-2 bg-green-100 rounded-full">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getAttendanceColor(data.attendance.overall)}`}>
                {data.attendance.overall}%
              </div>
              <p className="text-sm text-gray-600 font-medium">This semester</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Course Progress</CardTitle>
              <div className="p-2 bg-purple-100 rounded-full">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {Math.round((data.academicPerformance.completedCredits / data.academicPerformance.totalCredits) * 100)}%
              </div>
              <p className="text-sm text-gray-600 font-medium">
                {data.academicPerformance.completedCredits}/{data.academicPerformance.totalCredits} credits
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Fee Status</CardTitle>
              <div className="p-2 bg-orange-100 rounded-full">
                <IndianRupee className="h-5 w-5 text-orange-600" /> {/* Changed to IndianRupee icon */}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                ₹{data.fees.pendingAmount.toLocaleString("en-IN")}
              </div>{" "}
              {/* Changed to rupee symbol and Indian formatting */}
              <p className="text-sm text-gray-600 font-medium">Pending payment</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Academic Performance */}
          <Card className="border-2 border-amber-200 bg-white shadow-lg">
            <CardHeader className="rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <GraduationCap className="h-6 w-6 text-amber-600" />
                Academic Performance
              </CardTitle>
              <CardDescription className="text-amber-700">Your current semester grades and performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 mt-4">
              {data.academicPerformance.subjects.map((subject, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{subject.name}</p>
                    <p className="text-sm text-gray-600">{subject.credits} credits</p>
                  </div>
                  <Badge variant="secondary" className="bg-amber-200 text-amber-800 font-semibold px-3 py-1">
                    {subject.grade}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Attendance Details */}
          <Card className="border-2 border-emerald-200 bg-white shadow-lg">
            <CardHeader className="rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Calendar className="h-6 w-6 text-emerald-600" />
                Attendance Overview
              </CardTitle>
              <CardDescription className="text-emerald-700">Subject-wise attendance tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 mt-4">
              {data.attendance.subjects.map((subject, index) => (
                <div
                  key={index}
                  className="space-y-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-800">{subject.name}</p>
                    <span className={`font-bold text-lg ${getAttendanceColor(subject.percentage)}`}>
                      {subject.percentage}%
                    </span>
                  </div>
                  <Progress value={subject.percentage} className="h-3 bg-gray-200" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Fee Details */}
          <Card className="border-2 border-orange-200 bg-white shadow-lg">
            <CardHeader className="rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <IndianRupee className="h-6 w-6 text-orange-600" /> {/* Changed to IndianRupee icon */}
                Fee Information
              </CardTitle>
              <CardDescription className="text-orange-700">Payment status and due dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">Total Amount</p>
                  <p className="text-xl font-bold text-blue-600">₹{data.fees.totalAmount.toLocaleString("en-IN")}</p>{" "}
                  {/* Changed to rupee symbol */}
                </div>
                <div className="space-y-1 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-medium">Paid Amount</p>
                  <p className="text-xl font-bold text-green-600">₹{data.fees.paidAmount.toLocaleString("en-IN")}</p>{" "}
                  {/* Changed to rupee symbol */}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <p className="font-semibold text-orange-800">Pending Payment</p>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Amount: ₹{data.fees.pendingAmount.toLocaleString("en-IN")}
                </p>{" "}
                {/* Changed to rupee symbol */}
                <p className="text-sm font-medium text-gray-700">Due Date: {data.fees.dueDate}</p>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment & Recommendations */}
          <Card className="border-2 border-purple-200 bg-white shadow-lg">
            <CardHeader className="rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <AlertTriangle className="h-6 w-6 text-purple-600" />
                Academic Insights
              </CardTitle>
              <CardDescription className="text-purple-700">AI-powered recommendations for improvement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 mt-4">
              <div className="space-y-3">
                <p className="font-semibold text-gray-800">Risk Factors:</p>
                {data.riskAssessment.factors.map((factor, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-sm p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span className="text-red-700 font-medium">{factor}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-gray-800">Recommendations:</p>
                {data.riskAssessment.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-sm p-3 bg-green-50 rounded-lg border border-green-200"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-green-700 font-medium">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
