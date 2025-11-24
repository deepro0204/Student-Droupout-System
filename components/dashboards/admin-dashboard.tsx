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
  Users,
  AlertTriangle,
  IndianRupee,
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  Download,
  Upload,
  BarChart3,
  Shield,
  Mail,
  Database,
} from "lucide-react"

const initialUsers = [
  {
    id: "1",
    name: "Student1",
    email: "student1@example.com",
    role: "student",
    status: "active",
    lastLogin: "2024-01-15",
  },
  {
    id: "2",
    name: "Teacher1",
    email: "teacher1@example.com",
    role: "teacher",
    status: "active",
    lastLogin: "2024-01-15",
  },
  {
    id: "3",
    name: "Student2",
    email: "student2@example.com",
    role: "student",
    status: "inactive",
    lastLogin: "2024-01-10",
  },
  {
    id: "4",
    name: "Counselor1",
    email: "counselor1@example.com",
    role: "counselor",
    status: "active",
    lastLogin: "2024-01-14",
  },
  { id: "5", name: "Admin1", email: "admin1@example.com", role: "admin", status: "active", lastLogin: "2024-01-15" },
]

const systemStats = {
  totalStudents: 1250,
  totalTeachers: 45,
  totalCounselors: 8,
  activeUsers: 1303,
  highRiskStudents: 89,
  mediumRiskStudents: 234,
  lowRiskStudents: 927,
  totalRevenue: 18750000, // In rupees
  pendingFees: 125000, // In rupees
  systemUptime: 99.8,
  lastBackup: "2024-01-15 02:30 AM",
}

const mockCourses = [
  { id: "CS101", name: "Computer Science", students: 450, teachers: 12, completion: 78 },
  { id: "EE101", name: "Electrical Engineering", students: 320, teachers: 8, completion: 82 },
  { id: "ME101", name: "Mechanical Engineering", students: 280, teachers: 10, completion: 75 },
  { id: "CE101", name: "Civil Engineering", students: 200, teachers: 6, completion: 80 },
]

const recentActivities = [
  { id: 1, action: "New student registered", user: "Student3", timestamp: "2 hours ago", type: "registration" },
  { id: 2, action: "High risk alert triggered", user: "Student2", timestamp: "4 hours ago", type: "alert" },
  { id: 3, action: "Fee payment received", user: "Student1", timestamp: "6 hours ago", type: "payment" },
  { id: 4, action: "Teacher account created", user: "Teacher2", timestamp: "1 day ago", type: "account" },
  { id: 5, action: "System backup completed", user: "System", timestamp: "1 day ago", type: "system" },
]

export function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<(typeof initialUsers)[0] | null>(null)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [users, setUsers] = useState(initialUsers)
  const [activeTab, setActiveTab] = useState("overview")
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    role: "",
  })
  const { toast } = useToast()

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "text-purple-600 bg-purple-100 border-purple-200"
      case "teacher":
        return "text-emerald-600 bg-emerald-100 border-emerald-200"
      case "counselor":
        return "text-pink-600 bg-pink-100 border-pink-200"
      case "student":
        return "text-blue-600 bg-blue-100 border-blue-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "text-green-600 bg-green-100 border-green-200"
      : "text-red-600 bg-red-100 border-red-200"
  }

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case "alert":
        return "text-red-600"
      case "payment":
        return "text-green-600"
      case "registration":
        return "text-blue-600"
      case "account":
        return "text-purple-600"
      case "system":
        return "text-amber-600"
      default:
        return "text-gray-600"
    }
  }

  const handleExportReport = () => {
    const reportData = `
ADMIN SYSTEM REPORT
==================

System Statistics:
- Total Students: ${systemStats.totalStudents}
- Total Teachers: ${systemStats.totalTeachers}
- Total Counselors: ${systemStats.totalCounselors}
- Active Users: ${systemStats.activeUsers}
- High Risk Students: ${systemStats.highRiskStudents}
- Medium Risk Students: ${systemStats.mediumRiskStudents}
- Low Risk Students: ${systemStats.lowRiskStudents}
- Total Revenue: ₹${systemStats.totalRevenue.toLocaleString("en-IN")}
- Pending Fees: ₹${systemStats.pendingFees.toLocaleString("en-IN")}
- System Uptime: ${systemStats.systemUptime}%

Generated on: ${new Date().toLocaleString()}
    `

    const blob = new Blob([reportData], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Admin_System_Report_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    console.log("[v0] Admin report exported successfully")
  }

  const handleImportData = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".csv,.txt,.json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        console.log("[v0] Data import initiated for file:", file.name)
        toast({
          title: "Data Import Started",
          description: `Processing ${file.name}. Import will complete shortly.`,
          className: "bg-green-50 border-green-200 text-green-800",
        })
      }
    }
    input.click()
  }

  const handleSystemSettings = () => {
    setActiveTab("system")
    toast({
      title: "System Settings",
      description: "Navigated to system configuration panel.",
      className: "bg-green-50 border-green-200 text-green-800",
    })
  }

  const handleCreateUser = () => {
    if (!newUserForm.name || !newUserForm.email || !newUserForm.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        className: "bg-red-50 border-red-200 text-red-800",
      })
      return
    }

    const newUser = {
      id: (users.length + 1).toString(),
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      status: "active",
      lastLogin: new Date().toISOString().split("T")[0],
    }

    setUsers([...users, newUser])
    toast({
      title: "User Created Successfully",
      description: `${newUser.name} has been added to the system.`,
      className: "bg-green-50 border-green-200 text-green-800",
    })

    setNewUserForm({ name: "", email: "", role: "" })
    setIsAddUserOpen(false)
  }

  const handleEditUser = (user: (typeof users)[0]) => {
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, name: `${u.name}_edited`, lastLogin: new Date().toISOString().split("T")[0] } : u,
    )
    setUsers(updatedUsers)
    toast({
      title: "User Updated",
      description: `${user.name} profile has been updated successfully.`,
      className: "bg-green-50 border-green-200 text-green-800",
    })
  }

  const handleDeleteUser = (user: (typeof users)[0]) => {
    setUsers(users.filter((u) => u.id !== user.id))
    toast({
      title: "User Deleted",
      description: `${user.name} has been removed from the system.`,
      className: "bg-red-50 border-red-200 text-red-800",
    })
  }

  const handleViewCourseAnalytics = (course: (typeof mockCourses)[0]) => {
    const excellentCount = Math.max(0, Math.round((course.completion * 0.3) / 5))
    const goodCount = Math.max(0, Math.round((course.completion * 0.4) / 5))
    const averageCount = Math.max(0, Math.round((course.completion * 0.2) / 5))
    const belowAverageCount = Math.max(0, Math.round((course.completion * 0.1) / 5))
    const completionBars = Math.max(0, Math.round(course.completion / 5))
    const ratingStars = Math.max(0, Math.min(5, Math.round(course.completion / 20 + 3)))

    const analyticsData = `
COURSE ANALYTICS: ${course.name}
===============================

ENROLLMENT METRICS:
Total Students: ${course.students}
Active Teachers: ${course.teachers}
Completion Rate: ${course.completion}%

PERFORMANCE CHART:
Excellent (A): ${"█".repeat(excellentCount)} (30%)
Good (B): ${"▓".repeat(goodCount)} (40%)
Average (C): ${"░".repeat(averageCount)} (20%)
Below Average (D/F): ${"▒".repeat(belowAverageCount)} (10%)

ATTENDANCE TREND:
${"█".repeat(completionBars)} ${course.completion}%

STUDENT SATISFACTION:
Rating: ${(course.completion / 20 + 3).toFixed(1)}/5.0
${"★".repeat(ratingStars)}${"☆".repeat(5 - ratingStars)}

RESOURCE UTILIZATION:
Library Access: ${"█".repeat(15)} (75%)
Online Materials: ${"▓".repeat(16)} (80%)
Lab Equipment: ${"░".repeat(12)} (60%)
    `

    const blob = new Blob([analyticsData], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${course.name}_Analytics_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Course Analytics Generated",
      description: `Detailed analytics for ${course.name} with visual charts downloaded.`,
      className: "bg-green-50 border-green-200 text-green-800",
    })
  }

  const handleSystemMaintenance = (action: string) => {
    toast({
      title: `${action} Initiated`,
      description: `${action} process has been started successfully.`,
      className: "bg-green-50 border-green-200 text-green-800",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance bg-gradient-to-r from-amber-600 to-emerald-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Complete system management and analytics</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExportReport}
              variant="outline"
              className="border-amber-200 bg-white hover:bg-amber-50 text-amber-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button
              onClick={handleImportData}
              variant="outline"
              className="border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
            <Button
              onClick={handleSystemSettings}
              className="bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{systemStats.activeUsers}</div>
              <p className="text-xs text-blue-600">
                {systemStats.totalStudents} students, {systemStats.totalTeachers} teachers
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">High Risk Students</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800">{systemStats.highRiskStudents}</div>
              <p className="text-xs text-red-600">
                {Math.round((systemStats.highRiskStudents / systemStats.totalStudents) * 100)}% of total students
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">
                ₹{(systemStats.totalRevenue / 10000000).toFixed(1)}Cr
              </div>
              <p className="text-xs text-green-600">₹{(systemStats.pendingFees / 100000).toFixed(1)}L pending</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">System Health</CardTitle>
              <Database className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">{systemStats.systemUptime}%</div>
              <p className="text-xs text-purple-600">Uptime this month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-amber-200">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
            >
              User Management
            </TabsTrigger>
            <TabsTrigger
              value="courses"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
            >
              Courses
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="system"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
            >
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Distribution */}
              <Card className="border-amber-200 bg-white hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-amber-600" />
                    Student Risk Distribution
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Current risk assessment across all students
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 font-medium">Low Risk</span>
                      <span className="font-bold text-green-700">{systemStats.lowRiskStudents} students</span>
                    </div>
                    <Progress
                      value={(systemStats.lowRiskStudents / systemStats.totalStudents) * 100}
                      className="h-3 bg-green-100 [&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-green-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-600 font-medium">Medium Risk</span>
                      <span className="font-bold text-amber-700">{systemStats.mediumRiskStudents} students</span>
                    </div>
                    <Progress
                      value={(systemStats.mediumRiskStudents / systemStats.totalStudents) * 100}
                      className="h-3 bg-amber-100 [&>div]:bg-gradient-to-r [&>div]:from-amber-400 [&>div]:to-amber-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-red-600 font-medium">High Risk</span>
                      <span className="font-bold text-red-700">{systemStats.highRiskStudents} students</span>
                    </div>
                    <Progress
                      value={(systemStats.highRiskStudents / systemStats.totalStudents) * 100}
                      className="h-3 bg-red-100 [&>div]:bg-gradient-to-r [&>div]:from-red-400 [&>div]:to-red-600"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="border-emerald-200 bg-white hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-emerald-700">Recent System Activities</CardTitle>
                  <CardDescription className="text-gray-600">Latest actions and system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-800">{activity.action}</p>
                          <p className="text-xs text-gray-600">{activity.user}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-medium ${getActivityTypeColor(activity.type)}`}>
                            {activity.type}
                          </p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            {/* User Management Header */}
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white border-amber-200">
                  <DialogHeader>
                    <DialogTitle className="text-amber-700">Add New User</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Create a new user account in the system
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        value={newUserForm.name}
                        onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                        className="bg-white border-gray-300 focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        value={newUserForm.email}
                        onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                        className="bg-white border-gray-300 focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-gray-700">
                        Role
                      </Label>
                      <Select
                        value={newUserForm.role}
                        onValueChange={(value) => setNewUserForm({ ...newUserForm, role: value })}
                      >
                        <SelectTrigger className="bg-white border-gray-300 focus:border-amber-500">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="counselor">Counselor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCreateUser}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-white"
                      >
                        Create User
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-white border-gray-300 hover:bg-gray-50"
                        onClick={() => setIsAddUserOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Users Table */}
            <Card className="border-amber-200 bg-white hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-amber-700">User Management</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage all system users and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-amber-200">
                      <TableHead className="text-gray-700">User</TableHead>
                      <TableHead className="text-gray-700">Role</TableHead>
                      <TableHead className="text-gray-700">Status</TableHead>
                      <TableHead className="text-gray-700">Last Login</TableHead>
                      <TableHead className="text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-amber-100 hover:bg-amber-50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-800">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </TableCell>
                        <TableCell className="text-gray-700">{user.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
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

          <TabsContent value="courses" className="space-y-4">
            <Card className="border-amber-200 bg-white hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-amber-700">Course Management</CardTitle>
                <CardDescription className="text-gray-600">
                  Overview of all courses and their statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-amber-200">
                      <TableHead className="text-gray-700">Course</TableHead>
                      <TableHead className="text-gray-700">Students</TableHead>
                      <TableHead className="text-gray-700">Teachers</TableHead>
                      <TableHead className="text-gray-700">Completion Rate</TableHead>
                      <TableHead className="text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCourses.map((course) => (
                      <TableRow key={course.id} className="border-amber-100 hover:bg-amber-50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-800">{course.name}</p>
                            <p className="text-sm text-gray-600">{course.id}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700">{course.students}</TableCell>
                        <TableCell className="text-gray-700">{course.teachers}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={course.completion}
                              className="h-3 flex-1 bg-gray-100 [&>div]:bg-gray-300"
                            />
                            <span className="text-sm font-medium text-gray-700">{course.completion}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewCourseAnalytics(course)}
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            >
                              <BarChart3 className="h-4 w-4" />
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

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-amber-200 bg-white hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-amber-600" />
                    System Performance
                  </CardTitle>
                  <CardDescription className="text-gray-600">Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Database Performance</span>
                    <span className="text-green-600 font-bold">Excellent</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">API Response Time</span>
                    <span className="font-bold text-gray-800">120ms avg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Active Sessions</span>
                    <span className="font-bold text-gray-800">234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Storage Usage</span>
                    <span className="font-bold text-gray-800">67% (2.1TB)</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-white hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-amber-600" />
                    Security Overview
                  </CardTitle>
                  <CardDescription className="text-gray-600">System security status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Failed Login Attempts</span>
                    <span className="text-yellow-600 font-bold">12 (24h)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">SSL Certificate</span>
                    <span className="text-green-600 font-bold">Valid</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Last Security Scan</span>
                    <span className="font-bold text-gray-800">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Backup Status</span>
                    <span className="text-green-600 font-bold">Up to date</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-amber-200 bg-white hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-amber-600" />
                    System Configuration
                  </CardTitle>
                  <CardDescription className="text-gray-600">Core system settings and configurations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => handleSystemMaintenance("Database Settings")}
                    variant="outline"
                    className="w-full justify-start border-amber-200 bg-white hover:bg-amber-50 text-amber-700"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Database Settings
                  </Button>
                  <Button
                    onClick={() => handleSystemMaintenance("Email Configuration")}
                    variant="outline"
                    className="w-full justify-start border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-700"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Configuration
                  </Button>
                  <Button
                    onClick={() => handleSystemMaintenance("Security Settings")}
                    variant="outline"
                    className="w-full justify-start border-pink-200 bg-white hover:bg-pink-50 text-pink-700"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Security Settings
                  </Button>
                  <Button
                    onClick={() => handleSystemMaintenance("Analytics Configuration")}
                    variant="outline"
                    className="w-full justify-start border-green-200 bg-white hover:bg-green-50 text-green-700"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics Configuration
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-white hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-amber-700">System Maintenance</CardTitle>
                  <CardDescription className="text-gray-600">Maintenance and backup operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Last Backup: {systemStats.lastBackup}</p>
                    <Button
                      onClick={() => handleSystemMaintenance("Backup")}
                      variant="outline"
                      className="w-full border-amber-200 bg-white hover:bg-amber-50 text-amber-700"
                    >
                      Run Backup Now
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">System Health Check</p>
                    <Button
                      onClick={() => handleSystemMaintenance("Diagnostics")}
                      variant="outline"
                      className="w-full border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-700"
                    >
                      Run Diagnostics
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Clear Cache & Logs</p>
                    <Button
                      onClick={() => handleSystemMaintenance("Clear Cache")}
                      variant="outline"
                      className="w-full border-green-200 bg-white hover:bg-green-50 text-green-700"
                    >
                      Clear System Cache
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
