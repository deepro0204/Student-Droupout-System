import { type NextRequest, NextResponse } from "next/server"
import { aiService } from "@/lib/ai-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentData } = body

    if (!studentData) {
      return NextResponse.json({ error: "Student data is required" }, { status: 400 })
    }

    const insights = await aiService.getStudentInsights(studentData)

    return NextResponse.json({ success: true, data: insights })
  } catch (error) {
    console.error("AI insights error:", error)
    return NextResponse.json({ error: "Failed to generate AI insights" }, { status: 500 })
  }
}
