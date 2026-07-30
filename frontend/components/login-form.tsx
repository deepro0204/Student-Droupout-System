"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GraduationCap, Users, Shield, Heart } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const success = await login(email, password)
    if (!success) {
      setError("Invalid credentials. Please try again.")
    }
    setIsLoading(false)
  }

  const demoAccounts = [
    {
      role: "Student",
      email: "student1@example.com",
      icon: GraduationCap,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      role: "Teacher",
      email: "teacher1@example.com",
      icon: Users,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    { role: "Admin", email: "admin1@example.com", icon: Shield, color: "text-purple-600", bgColor: "bg-purple-50" },
    {
      role: "Counselor",
      email: "counselor1@example.com",
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        <Card className="border-2 border-blue-200 shadow-xl bg-white/90 backdrop-blur-sm pt-0">
          <CardHeader className="space-y-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg pt-4 pb-4">
            <CardTitle className="text-2xl font-bold text-balance">CareSphere</CardTitle>
            <CardDescription className="text-blue-100">
              AI-powered student success platform for educational institutions
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              {error && (
                <Alert className="border-red-200 bg-red-50 text-red-800">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transform transition hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-2 border-cyan-200 shadow-xl bg-white/90 backdrop-blur-sm pt-0">
          <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg pt-4 pb-4">
            <CardTitle className="text-xl">Demo Accounts</CardTitle>
            <CardDescription className="text-cyan-100">
              Use these credentials to explore different user roles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 mt-4">
            {demoAccounts.map((account) => {
              const Icon = account.icon
              return (
                <div
                  key={account.role}
                  className={`flex items-center justify-between p-4 rounded-xl ${account.bgColor} border-2 border-transparent hover:border-current cursor-pointer transition-all duration-200 hover:shadow-md transform hover:scale-102`}
                  onClick={() => {
                    setEmail(account.email)
                    setPassword("password")
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-white ${account.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{account.role}</p>
                      <p className="text-sm text-gray-600">{account.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className={`${account.color} hover:bg-white/50`}>
                    Use Account
                  </Button>
                </div>
              )
            })}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
              <p className="text-sm text-gray-700 font-medium">
                <strong>Password for all accounts:</strong> password
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
