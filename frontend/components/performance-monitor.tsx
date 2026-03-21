"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Icon } from "@/components/ui/icon"

interface PerformanceMetrics {
  fcp: number | null // First Contentful Paint
  lcp: number | null // Largest Contentful Paint
  fid: number | null // First Input Delay
  cls: number | null // Cumulative Layout Shift
  ttfb: number | null // Time to First Byte
  fmp: number | null // First Meaningful Paint
}

interface PerformanceMonitorProps {
  showDetails?: boolean
  className?: string
}

export function PerformanceMonitor({ showDetails = false, className = "" }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fmp: null
  })

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()

      entries.forEach((entry) => {
        if (entry.entryType === "paint") {
          if (entry.name === "first-contentful-paint") {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }))
          }
          if (entry.name === "first-meaningful-paint") {
            setMetrics(prev => ({ ...prev, fmp: entry.startTime }))
          }
        }

        if (entry.entryType === "largest-contentful-paint") {
          setMetrics(prev => ({ ...prev, lcp: entry.startTime }))
        }

        if (entry.entryType === "first-input") {
          const fi = entry as PerformanceEventTiming
          setMetrics((prev) => ({ ...prev, fid: fi.processingStart - fi.startTime }))
        }

        if (entry.entryType === "layout-shift" && !(entry as any).hadRecentInput) {
          setMetrics(prev => ({
            ...prev,
            cls: (prev.cls || 0) + (entry as any).value
          }))
        }

        if (entry.entryType === "navigation") {
          const nav = entry as PerformanceNavigationTiming
          setMetrics((prev) => ({
            ...prev,
            ttfb: nav.responseStart - nav.requestStart,
          }))
        }
      })
    })

    // Observe different types of performance entries
    try {
      observer.observe({ entryTypes: ["paint", "largest-contentful-paint", "first-input", "layout-shift", "navigation"] })
    } catch (error) {
      console.warn("Performance Observer not supported:", error)
    }

    // Show the monitor after a delay
    const timer = setTimeout(() => setIsVisible(true), 2000)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [])

  const getScore = (value: number | null, thresholds: { good: number; poor: number }) => {
    if (value === null) return "unknown"
    if (value <= thresholds.good) return "good"
    if (value <= thresholds.poor) return "needs-improvement"
    return "poor"
  }

  const getScoreColor = (score: string) => {
    switch (score) {
      case "good": return "bg-green-500"
      case "needs-improvement": return "bg-yellow-500"
      case "poor": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getScoreLabel = (score: string) => {
    switch (score) {
      case "good": return "Bon"
      case "needs-improvement": return "À améliorer"
      case "poor": return "Mauvais"
      default: return "Inconnu"
    }
  }

  const fcpScore = getScore(metrics.fcp, { good: 1800, poor: 3000 })
  const lcpScore = getScore(metrics.lcp, { good: 2500, poor: 4000 })
  const fidScore = getScore(metrics.fid, { good: 100, poor: 300 })
  const clsScore = getScore(metrics.cls, { good: 0.1, poor: 0.25 })
  const ttfbScore = getScore(metrics.ttfb, { good: 800, poor: 1800 })

  if (!isVisible || !showDetails) return null

  return (
    <Card className={`fixed bottom-4 right-4 z-50 w-80 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Icon name="Activity" className="h-4 w-4" />
          Performance Monitor
        </CardTitle>
        <CardDescription className="text-xs">
          Métriques de performance en temps réel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* First Contentful Paint */}
        {metrics.fcp && (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">FCP</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {Math.round(metrics.fcp)}ms
                </span>
                <Badge
                  variant="outline"
                  className={`text-xs ${getScoreColor(fcpScore)} text-white`}
                >
                  {getScoreLabel(fcpScore)}
                </Badge>
              </div>
            </div>
            <Progress
              value={Math.min((metrics.fcp / 3000) * 100, 100)}
              className="h-1"
            />
          </div>
        )}

        {/* Largest Contentful Paint */}
        {metrics.lcp && (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">LCP</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {Math.round(metrics.lcp)}ms
                </span>
                <Badge
                  variant="outline"
                  className={`text-xs ${getScoreColor(lcpScore)} text-white`}
                >
                  {getScoreLabel(lcpScore)}
                </Badge>
              </div>
            </div>
            <Progress
              value={Math.min((metrics.lcp / 4000) * 100, 100)}
              className="h-1"
            />
          </div>
        )}

        {/* First Input Delay */}
        {metrics.fid && (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">FID</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {Math.round(metrics.fid)}ms
                </span>
                <Badge
                  variant="outline"
                  className={`text-xs ${getScoreColor(fidScore)} text-white`}
                >
                  {getScoreLabel(fidScore)}
                </Badge>
              </div>
            </div>
            <Progress
              value={Math.min((metrics.fid / 300) * 100, 100)}
              className="h-1"
            />
          </div>
        )}

        {/* Cumulative Layout Shift */}
        {metrics.cls !== null && (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">CLS</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {metrics.cls.toFixed(3)}
                </span>
                <Badge
                  variant="outline"
                  className={`text-xs ${getScoreColor(clsScore)} text-white`}
                >
                  {getScoreLabel(clsScore)}
                </Badge>
              </div>
            </div>
            <Progress
              value={Math.min((metrics.cls / 0.25) * 100, 100)}
              className="h-1"
            />
          </div>
        )}

        {/* Time to First Byte */}
        {metrics.ttfb && (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">TTFB</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {Math.round(metrics.ttfb)}ms
                </span>
                <Badge
                  variant="outline"
                  className={`text-xs ${getScoreColor(ttfbScore)} text-white`}
                >
                  {getScoreLabel(ttfbScore)}
                </Badge>
              </div>
            </div>
            <Progress
              value={Math.min((metrics.ttfb / 1800) * 100, 100)}
              className="h-1"
            />
          </div>
        )}

        {/* Overall Score */}
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium">Score Global</span>
            <Badge variant="outline" className="text-xs">
              {(() => {
                const scores = [fcpScore, lcpScore, fidScore, clsScore, ttfbScore]
                const goodCount = scores.filter(s => s === "good").length
                const totalCount = scores.filter(s => s !== "unknown").length
                if (totalCount === 0) return "Calcul..."
                const percentage = (goodCount / totalCount) * 100
                return `${Math.round(percentage)}%`
              })()}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PerformanceMonitor
