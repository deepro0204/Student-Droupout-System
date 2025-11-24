"use client"

import { useAuth } from "@/components/auth-provider"
import { LoginForm } from "@/components/login-form"
import { StudentDashboard } from "@/components/dashboards/student-dashboard"
import { TeacherDashboard } from "@/components/dashboards/teacher-dashboard"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { CounselorDashboard } from "@/components/dashboards/counselor-dashboard"

export default function HomePage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case "student":
      return <StudentDashboard />
    case "teacher":
      return <TeacherDashboard />
    case "admin":
      return <AdminDashboard />
    case "counselor":
      return <CounselorDashboard />
    default:
      return <LoginForm />
  }
}
