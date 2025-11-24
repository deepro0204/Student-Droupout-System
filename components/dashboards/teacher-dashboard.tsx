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
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, AlertTriangle, Search, Filter, Download, Eye, BookOpen, Calendar, GraduationCap } from "lucide-react"

const mockStudentsData = [
  {
    id: "STU001",
    name: "Student1",
    age: 20,
    gender: "Male",
    course: "Computer Science",
    semester: "6th",
    gpa: 3.2,
    attendance: 78,
    feeStatus: "Partially Paid",
    riskLevel: "Medium",
    parentEmail: "parent1@example.com",
    subjects: {
      "Data Structures": { grade: "B+", attendance: 82 },
      "Database Systems": { grade: "A-", attendance: 90 },
      "Web Development": { grade: "B", attendance: 75 },
      "Machine Learning": { grade: "C+", attendance: 65 },
    },
  },
  {
    id: "STU002",
    name: "Student2",
    age: 19,
    gender: "Female",
    course: "Computer Science",
    semester: "4th",
    gpa: 3.8,
    attendance: 92,
    feeStatus: "Paid",
    riskLevel: "Low",
    parentEmail: "parent2@example.com",
    subjects: {
      "Data Structures": { grade: "A", attendance: 95 },
      "Database Systems": { grade: "A", attendance: 90 },
      "Web Development": { grade: "A-", attendance: 88 },
      "Machine Learning": { grade: "B+", attendance: 92 },
    },
  },
  {
    id: "STU003",
    name: "Student3",
    age: 21,
    gender: "Male",
    course: "Computer Science",
    semester: "8th",
    gpa: 2.1,
    attendance: 45,
    feeStatus: "Overdue",
    riskLevel: "High",
    parentEmail: "parent3@example.com",
    subjects: {
      "Data Structures": { grade: "D", attendance: 40 },
      "Database Systems": { grade: "C-", attendance: 50 },
      "Web Development": { grade: "D+", attendance: 35 },
      "Machine Learning": { grade: "F", attendance: 30 },
    },
  },
  {
    id: "STU004",
    name: "Student4",
    age: 20,
    gender: "Female",
    course: "Computer Science",
    semester: "6th",
    gpa: 3.5,
    attendance: 85,
    feeStatus: "Paid",
    riskLevel: "Low",
    parentEmail: "parent4@example.com",
    subjects: {
      "Data Structures": { grade: "B+", attendance: 88 },
      "Database Systems": { grade: "A-", attendance: 85 },
      "Web Development": { grade: "A", attendance: 90 },
      "Machine Learning": { grade: "B", attendance: 80 },
    },
  },
  {
    id: "STU005",
    name: "Student5",
    age: 19,
    gender: "Female",
    course: "Electrical Engineering",
    semester: "2nd",
    gpa: 3.9,
    attendance: 95,
    feeStatus: "Paid",
    riskLevel: "Low",
    parentEmail: "parent5@example.com",
    subjects: {
      "Circuit Analysis": { grade: "A+", attendance: 98 },
      Mathematics: { grade: "A", attendance: 95 },
      Physics: { grade: "A-", attendance: 92 },
      Programming: { grade: "A", attendance: 96 },
    },
  },
  {
    id: "STU006",
    name: "Student6",
    age: 22,
    gender: "Male",
    course: "Mechanical Engineering",
    semester: "8th",
    gpa: 2.8,
    attendance: 72,
    feeStatus: "Partially Paid",
    riskLevel: "Medium",
    parentEmail: "parent6@example.com",
    subjects: {
      Thermodynamics: { grade: "C+", attendance: 75 },
      "Fluid Mechanics": { grade: "B-", attendance: 70 },
      "Machine Design": { grade: "C", attendance: 68 },
      Manufacturing: { grade: "B", attendance: 76 },
    },
  },
  {
    id: "STU007",
    name: "Student7",
    age: 20,
    gender: "Male",
    course: "Civil Engineering",
    semester: "4th",
    gpa: 3.1,
    attendance: 80,
    feeStatus: "Paid",
    riskLevel: "Low",
    parentEmail: "parent7@example.com",
    subjects: {
      "Structural Analysis": { grade: "B", attendance: 82 },
      "Concrete Technology": { grade: "B+", attendance: 85 },
      Surveying: { grade: "A-", attendance: 88 },
      "Environmental Eng": { grade: "B", attendance: 75 },
    },
  },
  {
    id: "STU008",
    name: "Student8",
    age: 21,
    gender: "Female",
    course: "Information Technology",
    semester: "6th",
    gpa: 3.6,
    attendance: 88,
    feeStatus: "Paid",
    riskLevel: "Low",
    parentEmail: "parent8@example.com",
    subjects: {
      "Software Engineering": { grade: "A-", attendance: 90 },
      "Network Security": { grade: "B+", attendance: 85 },
      "Database Management": { grade: "A", attendance: 92 },
      "Web Technologies": { grade: "B+", attendance: 86 },
    },
  },
  {
    id: "STU009",
    name: "Student9",
    age: 19,
    gender: "Male",
    course: "Electronics Engineering",
    semester: "2nd",
    gpa: 2.9,
    attendance: 68,
    feeStatus: "Overdue",
    riskLevel: "Medium",
    parentEmail: "parent9@example.com",
    subjects: {
      "Digital Electronics": { grade: "C+", attendance: 70 },
      "Analog Circuits": { grade: "C", attendance: 65 },
      Microprocessors: { grade: "B-", attendance: 72 },
      "Communication Systems": { grade: "C+", attendance: 66 },
    },
  },
  {
    id: "STU010",
    name: "Student10",
    age: 20,
    gender: "Female",
    course: "Computer Science",
    semester: "4th",
    gpa: 3.7,
    attendance: 91,
    feeStatus: "Paid",
    riskLevel: "Low",
    parentEmail: "parent10@example.com",
    subjects: {
      Algorithms: { grade: "A", attendance: 94 },
      "Operating Systems": { grade: "A-", attendance: 89 },
      "Computer Networks": { grade: "B+", attendance: 90 },
      "Software Testing": { grade: "A-", attendance: 92 },
    },
  },
  {
    id: "STU011",
    name: "Student11",
    age: 22,
    gender: "Male",
    course: "Mechanical Engineering",
    semester: "8th",
    gpa: 2.3,
    attendance: 55,
    feeStatus: "Overdue",
    riskLevel: "High",
    parentEmail: "parent11@example.com",
    subjects: {
      "Heat Transfer": { grade: "D+", attendance: 52 },
      "Machine Elements": { grade: "D", attendance: 48 },
      "Industrial Engineering": { grade: "C-", attendance: 60 },
      "Project Management": { grade: "C", attendance: 58 },
    },
  },
  {
    id: "STU012",
    name: "Student12",
    age: 19,
    gender: "Female",
    course: "Electrical Engineering",
    semester: "2nd",
    gpa: 3.4,
    attendance: 83,
    feeStatus: "Partially Paid",
    riskLevel: "Low",
    parentEmail: "parent12@example.com",
    subjects: {
      "Electrical Machines": { grade: "B+", attendance: 85 },
      "Power Systems": { grade: "B", attendance: 80 },
      "Control Systems": { grade: "A-", attendance: 88 },
      Electronics: { grade: "B+", attendance: 82 },
    },
  },
  {
    id: "STU013",
    name: "Student13",
    age: 21,
    gender: "Male",
    course: "Civil Engineering",
    semester: "6th",
    gpa: 2.7,
    attendance: 65,
    feeStatus: "Partially Paid",
    riskLevel: "Medium",
    parentEmail: "parent13@example.com",
    subjects: {
      "Geotechnical Engineering": { grade: "C", attendance: 62 },
      "Transportation Engineering": { grade: "C+", attendance: 68 },
      "Water Resources": { grade: "B-", attendance: 70 },
      "Construction Management": { grade: "C+", attendance: 64 },
    },
  },
  {
    id: "STU014",
    name: "Student14",
    age: 20,
    gender: "Female",
    course: "Information Technology",
    semester: "4th",
    gpa: 3.3,
    attendance: 79,
    feeStatus: "Paid",
    riskLevel: "Low",
    parentEmail: "parent14@example.com",
    subjects: {
      "Data Mining": { grade: "B", attendance: 82 },
      "Mobile Computing": { grade: "B+", attendance: 78 },
      "Cloud Computing": { grade: "A-", attendance: 85 },
      "Artificial Intelligence": { grade: "B", attendance: 75 },
    },
  },
  {
    id: "STU015",
    name: "Student15",
    age: 19,
    gender: "Male",
    course: "Electronics Engineering",
    semester: "4th",
    gpa: 3.0,
    attendance: 74,
    feeStatus: "Paid",
    riskLevel: "Medium",
    parentEmail: "parent15@example.com",
    subjects: {
      "VLSI Design": { grade: "B-", attendance: 76 },
      "Signal Processing": { grade: "C+", attendance: 72 },
      "Embedded Systems": { grade: "B", attendance: 78 },
      "Antenna Theory": { grade: "C+", attendance: 70 },
    },
  },
  {
    id: "STU016",
    name: "Student16",
    age: 21,
    gender: "Female",
    course: "Computer Science",
    semester: "6th",
    gpa: 2.5,
    attendance: 58,
    feeStatus: "Overdue",
    riskLevel: "High",
    parentEmail: "parent16@example.com",
    subjects: {
      "Compiler Design": { grade: "D+", attendance: 55 },
      "Computer Graphics": { grade: "C-", attendance: 60 },
      "Distributed Systems": { grade: "D", attendance: 52 },
      "Information Security": { grade: "C", attendance: 65 },
    },
  },
  {
    id: "STU017",
    name: "Student17",
    age: 20,
    gender: "Male",
    course: "Mechanical Engineering",
    semester: "4th",
    gpa: 3.2,
    attendance: 81,
    feeStatus: "Paid",
    riskLevel: "Low",
    parentEmail: "parent17@example.com",
    subjects: {
      "Strength of Materials": { grade: "B", attendance: 83 },
      "Engineering Drawing": { grade: "B+", attendance: 85 },
      "Manufacturing Processes": { grade: "A-", attendance: 88 },
      "Materials Science": { grade: "B", attendance: 78 },
    },
  },
  {
    id: "STU018",
    name: "Student18",
    age: 19,
    gender: "Female",
    course: "Electrical Engineering",
    semester: "2nd",
    gpa: 3.8,
    attendance: 93,
    feeStatus: "Paid",
    riskLevel: "Low",
    parentEmail: "parent18@example.com",
    subjects: {
      "Circuit Theory": { grade: "A", attendance: 95 },
      "Electromagnetic Fields": { grade: "A-", attendance: 92 },
      "Digital Logic": { grade: "A", attendance: 94 },
      "Engineering Mathematics": { grade: "A-", attendance: 91 },
    },
  },
  {
    id: "STU019",
    name: "Student19",
    age: 22,
    gender: "Male",
    course: "Civil Engineering",
    semester: "8th",
    gpa: 2.9,
    attendance: 70,
    feeStatus: "Partially Paid",
    riskLevel: "Medium",
    parentEmail: "parent19@example.com",
    subjects: {
      "Earthquake Engineering": { grade: "C+", attendance: 72 },
      "Bridge Engineering": { grade: "B-", attendance: 75 },
      "Coastal Engineering": { grade: "C", attendance: 65 },
      "Urban Planning": { grade: "B", attendance: 78 },
    },
  },
  {
    id: "STU020",
    name: "Student20",
    age: 20,
    gender: "Female",
    course: "Information Technology",
    semester: "6th",
    gpa: 3.5,
    attendance: 86,
    feeStatus: "Paid",
    riskLevel: "Low",
    parentEmail: "parent20@example.com",
    subjects: {
      "Machine Learning": { grade: "A-", attendance: 88 },
      "Big Data Analytics": { grade: "B+", attendance: 85 },
      "Internet of Things": { grade: "A", attendance: 90 },
      "Blockchain Technology": { grade: "B+", attendance: 84 },
    },
  },
  {
    id: "STU021",
    name: "Student21",
    age: 19,
    gender: "Male",
    course: "Electronics Engineering",
    semester: "2nd",
    gpa: 2.6,
    attendance: 62,
    feeStatus: "Overdue",
    riskLevel: "High",
    parentEmail: "parent21@example.com",
    subjects: {
      "Basic Electronics": { grade: "C-", attendance: 60 },
      "Network Analysis": { grade: "D+", attendance: 58 },
      "Electronic Devices": { grade: "C", attendance: 65 },
      "Measurement Systems": { grade: "D", attendance: 64 },
    },
  },
  {
    id: "STU022",
    name: "Student22",
    age: 21,
    gender: "Female",
    course: "Computer Science",
    semester: "6th",
    gpa: 3.4,
    attendance: 82,
    feeStatus: "Paid",
    riskLevel: "Low",
    parentEmail: "parent22@example.com",
    subjects: {
      "Software Architecture": { grade: "B+", attendance: 84 },
      "Human Computer Interaction": { grade: "A-", attendance: 88 },
      "Data Warehousing": { grade: "B", attendance: 80 },
      "Mobile App Development": { grade: "B+", attendance: 85 },
    },
  },
  {
    id: "STU023",
    name: "Student23",
    age: 20,
    gender: "Male",
    course: "Mechanical Engineering",
    semester: "4th",
    gpa: 2.8,
    attendance: 69,
    feeStatus: "Partially Paid",
    riskLevel: "Medium",
    parentEmail: "parent23@example.com",
    subjects: {
      "Kinematics of Machines": { grade: "C+", attendance: 71 },
      "Fluid Machinery": { grade: "C", attendance: 67 },
      Metrology: { grade: "B-", attendance: 73 },
      "Industrial Safety": { grade: "B", attendance: 75 },
    },
  },
  {
    id: "STU024",
    name: "Student24",
    age: 19,
    gender: "Female",
    course: "Electrical Engineering",
    semester: "4th",
    gpa: 3.6,
    attendance: 89,
    feeStatus: "Paid",
    riskLevel: "Low",
    parentEmail: "parent24@example.com",
    subjects: {
      "Power Electronics": { grade: "A-", attendance: 91 },
      "Renewable Energy": { grade: "B+", attendance: 87 },
      "Electric Drives": { grade: "A", attendance: 93 },
      "Power Quality": { grade: "B+", attendance: 86 },
    },
  },
  {
    id: "STU025",
    name: "Student25",
    age: 21,
    gender: "Male",
    course: "Civil Engineering",
    semester: "6th",
    gpa: 3.1,
    attendance: 77,
    feeStatus: "Paid",
    riskLevel: "Low",
    parentEmail: "parent25@example.com",
    subjects: {
      "Prestressed Concrete": { grade: "B", attendance: 79 },
      "Foundation Engineering": { grade: "B+", attendance: 82 },
      "Highway Engineering": { grade: "B-", attendance: 75 },
      "Quantity Surveying": { grade: "B", attendance: 78 },
    },
  },
]

const classAnalytics = {
  totalStudents: mockStudentsData.length,
  averageGPA: 3.12,
  averageAttendance: 77,
  riskDistribution: {
    low: mockStudentsData.filter((s) => s.riskLevel === "Low").length,
    medium: mockStudentsData.filter((s) => s.riskLevel === "Medium").length,
    high: mockStudentsData.filter((s) => s.riskLevel === "High").length,
  },
  feeStatus: {
    paid: mockStudentsData.filter((s) => s.feeStatus === "Paid").length,
    partial: mockStudentsData.filter((s) => s.feeStatus === "Partially Paid").length,
    overdue: mockStudentsData.filter((s) => s.feeStatus === "Overdue").length,
  },
}

export function TeacherDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<(typeof mockStudentsData)[0] | null>(null)
  const [activeTab, setActiveTab] = useState("students")
  const [filterType, setFilterType] = useState<string>("all")
  const [filteredAndSortedStudents, setFilteredAndSortedStudents] = useState(mockStudentsData)
  const { toast } = useToast()

  const filteredStudents = mockStudentsData.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 85) return "text-emerald-600"
    if (percentage >= 75) return "text-amber-600"
    return "text-red-500"
  }

  const getFeeStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "text-emerald-600 bg-emerald-100 border-emerald-200"
      case "Partially Paid":
        return "text-amber-600 bg-amber-100 border-amber-200"
      case "Overdue":
        return "text-red-600 bg-red-100 border-red-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const handleViewStudent = (student: (typeof mockStudentsData)[0]) => {
    setSelectedStudent(student)
    setActiveTab("details")
  }

  const handleExportData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Student ID,Name,Course,GPA,Attendance,Fee Status,Risk Level\n" +
      mockStudentsData
        .map(
          (student) =>
            `${student.id},${student.name},${student.course},${student.gpa},${student.attendance}%,${student.feeStatus},${student.riskLevel}`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "student_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Data Exported Successfully",
      description: "Student data has been downloaded as CSV file.",
      className: "bg-green-50 border-green-200 text-green-800",
    })
  }

  const handleFilters = (filterType: string) => {
    let sortedStudents = [...mockStudentsData]

    switch (filterType) {
      case "student-id":
        sortedStudents.sort((a, b) => a.id.localeCompare(b.id))
        toast({
          title: "Filter Applied",
          description: "Students sorted by Student ID (ascending).",
          className: "bg-green-50 border-green-200 text-green-800",
        })
        break
      case "gpa":
        sortedStudents.sort((a, b) => b.gpa - a.gpa)
        toast({
          title: "Filter Applied",
          description: "Students sorted by GPA (descending).",
          className: "bg-green-50 border-green-200 text-green-800",
        })
        break
      case "risk-factor":
        const riskOrder = { High: 0, Medium: 1, Low: 2 }
        sortedStudents.sort(
          (a, b) => riskOrder[a.riskLevel as keyof typeof riskOrder] - riskOrder[b.riskLevel as keyof typeof riskOrder],
        )
        toast({
          title: "Filter Applied",
          description: "Students sorted by Risk Level (High → Medium → Low).",
          className: "bg-green-50 border-green-200 text-green-800",
        })
        break
      default:
        sortedStudents = mockStudentsData
        toast({
          title: "Filter Cleared",
          description: "Showing all students in original order.",
          className: "bg-green-50 border-green-200 text-green-800",
        })
    }

    setFilteredAndSortedStudents(sortedStudents)
    setFilterType(filterType)
  }

  const displayStudents =
    filterType !== "all"
      ? filteredAndSortedStudents.filter(
          (student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.id.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : filteredStudents

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-xl">
          <div>
            <h1 className="text-3xl font-bold text-balance">Teacher Dashboard</h1>
            <p className="text-blue-100 text-lg">Monitor student performance and class analytics</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              onClick={handleExportData}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Select value={filterType} onValueChange={handleFilters}>
              <SelectTrigger className="w-40 border-white/20 bg-white/10 text-white hover:bg-white/20">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filters" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Clear Filters</SelectItem>
                <SelectItem value="student-id">Sort by Student ID</SelectItem>
                <SelectItem value="gpa">Sort by GPA (High to Low)</SelectItem>
                <SelectItem value="risk-factor">Sort by Risk Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Total Students</CardTitle>
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{classAnalytics.totalStudents}</div>
              <p className="text-sm text-gray-600 font-medium">Active enrollments</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Average GPA</CardTitle>
              <div className="p-2 bg-purple-100 rounded-full">
                <GraduationCap className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{classAnalytics.averageGPA}</div>
              <p className="text-sm text-gray-600 font-medium">Class performance</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Average Attendance</CardTitle>
              <div className="p-2 bg-green-100 rounded-full">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getAttendanceColor(classAnalytics.averageAttendance)}`}>
                {classAnalytics.averageAttendance}%
              </div>
              <p className="text-sm text-gray-600 font-medium">This semester</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">High Risk Students</CardTitle>
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{classAnalytics.riskDistribution.high}</div>
              <p className="text-sm text-gray-600 font-medium">Need attention</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-white border-2 border-gray-200">
            <TabsTrigger value="students" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Student List
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Class Analytics
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Student Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              {filterType !== "all" && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {filterType === "student-id" && "Sorted by ID"}
                  {filterType === "gpa" && "Sorted by GPA"}
                  {filterType === "risk-factor" && "Sorted by Risk"}
                </Badge>
              )}
            </div>

            <Card className="border-2 border-gray-200 bg-white shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-100 to-white rounded-t-lg">
                <CardTitle className="text-gray-800">Student Overview</CardTitle>
                <CardDescription className="text-gray-600">Complete list of students with key metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>GPA</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Fee Status</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{student.course}</p>
                            <p className="text-sm text-muted-foreground">{student.semester} Semester</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{student.gpa}</span>
                        </TableCell>
                        <TableCell>
                          <span className={getAttendanceColor(student.attendance)}>{student.attendance}%</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getFeeStatusColor(student.feeStatus)}>{student.feeStatus}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getRiskColor(student.riskLevel)} border-2 font-semibold px-3 py-1`}>
                            {student.riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewStudent(student)}
                            className="hover:bg-blue-100 hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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
              <Card className="border-2 border-purple-200 bg-white shadow-lg">
                <CardHeader className="rounded-t-lg">
                  <CardTitle className="text-purple-800">Risk Level Distribution</CardTitle>
                  <CardDescription className="text-purple-700">Student risk assessment breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-600 font-semibold">Low Risk</span>
                      <span className="font-bold text-emerald-800">{classAnalytics.riskDistribution.low} students</span>
                    </div>
                    <Progress
                      value={(classAnalytics.riskDistribution.low / classAnalytics.totalStudents) * 100}
                      className="h-3 bg-emerald-100 [&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-emerald-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-600 font-semibold">Medium Risk</span>
                      <span className="font-bold text-amber-800">
                        {classAnalytics.riskDistribution.medium} students
                      </span>
                    </div>
                    <Progress
                      value={(classAnalytics.riskDistribution.medium / classAnalytics.totalStudents) * 100}
                      className="h-3 bg-amber-100 [&>div]:bg-gradient-to-r [&>div]:from-amber-400 [&>div]:to-amber-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-red-600 font-semibold">High Risk</span>
                      <span className="font-bold text-red-800">{classAnalytics.riskDistribution.high} students</span>
                    </div>
                    <Progress
                      value={(classAnalytics.riskDistribution.high / classAnalytics.totalStudents) * 100}
                      className="h-3 bg-red-100 [&>div]:bg-gradient-to-r [&>div]:from-red-400 [&>div]:to-red-600"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-200 bg-white shadow-lg">
                <CardHeader className="rounded-t-lg">
                  <CardTitle className="text-orange-800">Fee Payment Status</CardTitle>
                  <CardDescription className="text-orange-700">Student payment status overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-600 font-semibold">Paid</span>
                      <span className="font-bold text-emerald-800">{classAnalytics.feeStatus.paid} students</span>
                    </div>
                    <Progress
                      value={(classAnalytics.feeStatus.paid / classAnalytics.totalStudents) * 100}
                      className="h-3 bg-emerald-100 [&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-emerald-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-600 font-semibold">Partially Paid</span>
                      <span className="font-bold text-amber-800">{classAnalytics.feeStatus.partial} students</span>
                    </div>
                    <Progress
                      value={(classAnalytics.feeStatus.partial / classAnalytics.totalStudents) * 100}
                      className="h-3 bg-amber-100 [&>div]:bg-gradient-to-r [&>div]:from-amber-400 [&>div]:to-amber-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-red-600 font-semibold">Overdue</span>
                      <span className="font-bold text-red-800">{classAnalytics.feeStatus.overdue} students</span>
                    </div>
                    <Progress
                      value={(classAnalytics.feeStatus.overdue / classAnalytics.totalStudents) * 100}
                      className="h-3 bg-red-100 [&>div]:bg-gradient-to-r [&>div]:from-red-400 [&>div]:to-red-600"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {selectedStudent ? (
              <Card className="border-2 border-teal-200 bg-white shadow-lg">
                <CardHeader className="rounded-t-lg">
                  <CardTitle className="text-teal-800">Student Details: {selectedStudent.name}</CardTitle>
                  <CardDescription className="text-teal-700">Comprehensive view of student performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Personal Information</h3>
                      <div className="space-y-2">
                        <p>
                          <span className="text-muted-foreground">Student ID:</span> {selectedStudent.id}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Age:</span> {selectedStudent.age}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Gender:</span> {selectedStudent.gender}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Course:</span> {selectedStudent.course}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Semester:</span> {selectedStudent.semester}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Parent Email:</span> {selectedStudent.parentEmail}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Academic Performance</h3>
                      <div className="space-y-3">
                        {Object.entries(selectedStudent.subjects).map(([subject, data]) => (
                          <div
                            key={subject}
                            className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-200"
                          >
                            <div>
                              <p className="font-medium text-gray-800">{subject}</p>
                              <p className="text-sm text-gray-600">Attendance: {data.attendance}%</p>
                            </div>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-semibold">
                              {data.grade}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-gray-200 bg-white shadow-lg">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Select a student from the list to view detailed information</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
