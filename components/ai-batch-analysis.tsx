"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { aiService, type StudentData, type RiskPrediction } from "@/lib/ai-service"
import { Brain, RefreshCw, Download, AlertTriangle, TrendingUp } from "lucide-react"

interface AIBatchAnalysisProps {
  studentsData: StudentData[]
  onAnalysisComplete?: (predictions: RiskPrediction[]) => void
}

export function AIBatchAnalysis({ studentsData, onAnalysisComplete }: AIBatchAnalysisProps) {
  const [predictions, setPredictions] = useState<RiskPrediction[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const runBatchAnalysis = async () => {
    setIsAnalyzing(true)
    setError(null)
    setProgress(0)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const results = await aiService.batchPredictDropoutRisk(studentsData)

      clearInterval(progressInterval)
      setProgress(100)

      setPredictions(results)
      onAnalysisComplete?.(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze students")
    } finally {
      setIsAnalyzing(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const exportResults = () => {
    const csvContent = [
      ["Student ID", "Name", "Risk Level", "Risk Score", "Confidence", "Key Factors"].join(","),
      ...predictions.map((p) =>
        [
          p.studentId,
          studentsData.find((s) => s.id === p.studentId)?.name || "",
          p.riskLevel,
          p.riskScore,
          Math.round(p.confidence * 100) + "%",
          p.factors.join("; "),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `student-risk-analysis-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

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

  const riskStats = predictions.reduce(
    (acc, p) => {
      acc[p.riskLevel.toLowerCase()]++
      return acc
    },
    { high: 0, medium: 0, low: 0 },
  )

  return (
    <div className="space-y-6">
      {/* Analysis Control */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Batch Analysis
          </CardTitle>
          <CardDescription>
            Analyze dropout risk for {studentsData.length} students using machine learning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Analyzing students...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 rounded bg-red-400/10 border border-red-400/20">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={runBatchAnalysis} disabled={isAnalyzing} className="bg-primary hover:bg-primary/90">
              {isAnalyzing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Brain className="h-4 w-4 mr-2" />}
              {isAnalyzing ? "Analyzing..." : "Run AI Analysis"}
            </Button>

            {predictions.length > 0 && (
              <Button variant="outline" onClick={exportResults} className="border-border bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {predictions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{riskStats.high}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((riskStats.high / predictions.length) * 100)}% of analyzed students
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medium Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{riskStats.medium}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((riskStats.medium / predictions.length) * 100)}% of analyzed students
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Risk</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{riskStats.low}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((riskStats.low / predictions.length) * 100)}% of analyzed students
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results Table */}
      {predictions.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>AI-powered risk assessment for all students</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Key Factors</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {predictions
                  .sort((a, b) => b.riskScore - a.riskScore)
                  .map((prediction) => {
                    const student = studentsData.find((s) => s.id === prediction.studentId)
                    return (
                      <TableRow key={prediction.studentId}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{student?.name}</p>
                            <p className="text-sm text-muted-foreground">{prediction.studentId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskColor(prediction.riskLevel)}>{prediction.riskLevel}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={prediction.riskScore} className="h-2 w-16" />
                            <span className="font-medium">{prediction.riskScore}</span>
                          </div>
                        </TableCell>
                        <TableCell>{Math.round(prediction.confidence * 100)}%</TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm truncate">{prediction.factors.slice(0, 2).join(", ")}</p>
                            {prediction.factors.length > 2 && (
                              <p className="text-xs text-muted-foreground">+{prediction.factors.length - 2} more</p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
