import { type NextRequest, NextResponse } from "next/server"
import { aiService } from "@/lib/ai-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentData, batchMode = false } = body

    if (!studentData) {
      return NextResponse.json({ error: "Student data is required" }, { status: 400 })
    }

    let result
    if (batchMode && Array.isArray(studentData)) {
      result = await aiService.batchPredictDropoutRisk(studentData)
    } else {
      result = await aiService.predictDropoutRisk(studentData)
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("AI prediction error:", error)
    return NextResponse.json({ error: "Failed to generate AI prediction" }, { status: 500 })
  }
}
