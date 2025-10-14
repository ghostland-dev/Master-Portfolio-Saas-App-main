"use client"

import { Suspense, lazy, ComponentType, useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"

interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  height?: string
  className?: string
}

// Loading skeleton component
function LoadingSkeleton({ height = "h-64", className = "" }: { height?: string; className?: string }) {
  return (
    <Card className={`animate-pulse ${className}`}>
      <CardContent className={`p-6 ${height} flex items-center justify-center`}>
        <div className="flex flex-col items-center space-y-2">
          <Icon name="Loader2" className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Generic lazy wrapper
export function LazyWrapper({ 
  children, 
  fallback, 
  height = "h-64", 
  className = "" 
}: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback || <LoadingSkeleton height={height} className={className} />}>
      {children}
    </Suspense>
  )
}

// Higher-order component for lazy loading
export function withLazyLoading<T extends object>(
  Component: ComponentType<T>,
  fallback?: React.ReactNode
) {
  return function LazyComponent(props: T) {
    return (
      <Suspense fallback={fallback || <LoadingSkeleton />}>
        <Component {...props} />
      </Suspense>
    )
  }
}

// Hook for lazy loading with intersection observer
export function useLazyLoading(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold, hasLoaded])

  return { ref, isVisible, hasLoaded }
}

// Lazy component with intersection observer
interface LazyIntersectionProps extends LazyWrapperProps {
  threshold?: number
}

export function LazyIntersection({ 
  children, 
  fallback, 
  height = "h-64", 
  className = "",
  threshold = 0.1 
}: LazyIntersectionProps) {
  const { ref, isVisible } = useLazyLoading(threshold)

  return (
    <div ref={ref} className={className}>
      {isVisible ? (
        <Suspense fallback={fallback || <LoadingSkeleton height={height} />}>
          {children}
        </Suspense>
      ) : (
        fallback || <LoadingSkeleton height={height} />
      )}
    </div>
  )
}

export default LazyWrapper
