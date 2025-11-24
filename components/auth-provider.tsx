"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "student" | "teacher" | "admin" | "counselor"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  studentId?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    const mockUsers = [
      { id: "1", name: "Student1", email: "student1@example.com", role: "student" as UserRole, studentId: "STU001" },
      { id: "2", name: "Teacher1", email: "teacher1@example.com", role: "teacher" as UserRole },
      { id: "3", name: "Admin1", email: "admin1@example.com", role: "admin" as UserRole },
      { id: "4", name: "Counselor1", email: "counselor1@example.com", role: "counselor" as UserRole },
    ]

    const foundUser = mockUsers.find((u) => u.email === email && password === "password")

    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
