"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { aiService, type StudentData, type RiskPrediction, type AIInsights } from "@/lib/ai-service"
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, RefreshCw, Lightbulb, Target } from "lucide-react"

interface AIInsightsPanelProps {
  studentData: StudentData
  onPredictionUpdate?: (prediction: RiskPrediction) => void
}

export function AIInsightsPanel({ studentData, onPredictionUpdate }: AIInsightsPanelProps) {
  const [prediction, setPrediction] = useState<RiskPrediction | null>(null)
  const [insights, setInsights] = useState<AIInsights | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAIData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [predictionResult, insightsResult] = await Promise.all([
        aiService.predictDropoutRisk(studentData),
        aiService.getStudentInsights(studentData),
      ])

      setPrediction(predictionResult)
      setInsights(insightsResult)
      onPredictionUpdate?.(predictionResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load AI insights")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAIData()
  }, [studentData.id])

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "text-red-400 bg-red-400/10"
      case "medium":
        return "text-yellow-400 bg-yellow-400/10"
      case "low":
        return "text-green-400 bg-green-400/10"
      default:
        return "text-foreground bg-muted"
    }
  }

  const getTrendIcon = (current: number, projected: number) => {
    if (projected > current) return <TrendingUp className="h-4 w-4 text-green-400" />
    if (projected < current) return <TrendingDown className="h-4 w-4 text-red-400" />
    return <TrendingUp className="h-4 w-4 text-muted-foreground" />
  }

  if (isLoading) {
    return (
      <Card className="border-border">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin text-primary" />
            <span>Analyzing student data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-border">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <AlertTriangle className="h-8 w-8 text-red-400 mx-auto" />
            <p className="text-red-400">{error}</p>
            <Button variant="outline" onClick={loadAIData} className="border-border bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Risk Prediction Overview */}
      {prediction && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Risk Assessment
            </CardTitle>
            <CardDescription>Machine learning-powered dropout risk prediction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <Badge className={getRiskColor(prediction.riskLevel)}>{prediction.riskLevel} Risk</Badge>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <div className="flex items-center gap-2">
                  <Progress value={prediction.riskScore} className="h-2 w-24" />
                  <span className="font-bold">{prediction.riskScore}/100</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Confidence: {Math.round(prediction.confidence * 100)}%</p>
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(prediction.lastUpdated).toLocaleString()}
              </p>
            </div>

            <Button variant="outline" onClick={loadAIData} className="w-full border-border bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Analysis
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Detailed Insights */}
      {prediction && insights && (
        <Tabs defaultValue="factors" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="factors">Risk Factors</TabsTrigger>
            <TabsTrigger value="trends">Academic Trends</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="factors" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  Identified Risk Factors
                </CardTitle>
                <CardDescription>Key factors contributing to dropout risk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prediction.factors.map((factor, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded bg-muted/30">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm">{factor}</span>
                    </div>
                  ))}
                  {prediction.factors.length === 0 && (
                    <div className="flex items-center gap-2 p-2 rounded bg-green-400/10">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm">No significant risk factors identified</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {insights.behavioralIndicators.length > 0 && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Behavioral Indicators</CardTitle>
                  <CardDescription>AI-detected behavioral patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {insights.behavioralIndicators.map((indicator, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Target className="h-3 w-3 text-blue-400" />
                        <span>{indicator}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Academic Projections
                </CardTitle>
                <CardDescription>AI-predicted academic performance trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">GPA Projection</span>
                      {getTrendIcon(studentData.gpa, insights.academicTrends.gpaProjection)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{insights.academicTrends.gpaProjection.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">(Current: {studentData.gpa.toFixed(2)})</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Attendance Projection</span>
                      {getTrendIcon(studentData.attendance, insights.academicTrends.attendanceProjection)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">
                        {Math.round(insights.academicTrends.attendanceProjection)}%
                      </span>
                      <span className="text-sm text-muted-foreground">(Current: {studentData.attendance}%)</span>
                    </div>
                  </div>
                </div>

                {insights.academicTrends.subjectConcerns.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Subjects of Concern:</p>
                    <div className="flex flex-wrap gap-2">
                      {insights.academicTrends.subjectConcerns.map((subject, index) => (
                        <Badge key={index} variant="secondary" className="bg-red-400/10 text-red-400">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium">Parent Engagement Level:</p>
                  <Badge className={getRiskColor(insights.parentEngagementLevel)}>
                    {insights.parentEngagementLevel}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>Personalized intervention suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prediction.recommendations.map((recommendation, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-3 rounded bg-primary/5 border border-primary/20"
                    >
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {insights.interventionSuggestions.length > 0 && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Intervention Strategies</CardTitle>
                  <CardDescription>Specific actions to improve student outcomes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {insights.interventionSuggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Target className="h-3 w-3 text-green-400" />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
