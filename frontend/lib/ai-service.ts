// AI Service for student dropout prediction and risk assessment.
// Talks to the CareSphere FastAPI backend (see backend/app/routers).

import { apiFetch } from "./api-client"

export interface StudentData {
  id: string
  name: string
  age: number
  gender: string
  course: string
  semester: string
  gpa: number
  attendance: number
  feeStatus: string
  parentEmail: string
  subjects: Record<string, { grade: string; attendance: number }>
}

export interface RiskPrediction {
  studentId: string
  riskLevel: "Low" | "Medium" | "High"
  riskScore: number
  confidence: number
  factors: string[]
  recommendations: string[]
  lastUpdated: string
}

export interface AIInsights {
  academicTrends: {
    gpaProjection: number
    attendanceProjection: number
    subjectConcerns: string[]
  }
  behavioralIndicators: string[]
  interventionSuggestions: string[]
  parentEngagementLevel: "Low" | "Medium" | "High"
  // Which engine produced the insights ("gemini" or "fallback").
  source?: "gemini" | "fallback"
}

class AIService {
  /**
   * Predict dropout risk for a single student.
   * The backend accepts the full StudentData shape and derives the model
   * features (attendance, marks, failed attempts, fee %) from it.
   */
  async predictDropoutRisk(studentData: StudentData): Promise<RiskPrediction> {
    return apiFetch<RiskPrediction>("/predict-dropout", {
      method: "POST",
      body: JSON.stringify(studentData),
    })
  }

  /**
   * Get AI-powered insights for a student (Gemini-backed, with a deterministic
   * fallback when no Gemini API key is configured on the backend).
   */
  async getStudentInsights(studentData: StudentData): Promise<AIInsights> {
    return apiFetch<AIInsights>("/student-insights", {
      method: "POST",
      body: JSON.stringify(studentData),
    })
  }

  /**
   * Batch predict dropout risk for multiple students.
   */
  async batchPredictDropoutRisk(studentsData: StudentData[]): Promise<RiskPrediction[]> {
    return apiFetch<RiskPrediction[]>("/predict-dropout/batch", {
      method: "POST",
      body: JSON.stringify({ students: studentsData }),
    })
  }

  /**
   * Convenience helper — returns the recommendations from a fresh prediction.
   */
  async getInterventionRecommendations(
    studentData: StudentData,
    _riskFactors: string[],
  ): Promise<string[]> {
    const prediction = await this.predictDropoutRisk(studentData)
    return prediction.recommendations
  }
}

export const aiService = new AIService()
