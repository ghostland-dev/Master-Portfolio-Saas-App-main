"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { getTechIconCandidateUrls } from "@/lib/utils/simple-icons-utils"

interface TechIconProps {
  name: string
  size?: number
  className?: string
  fallbackIcon?: React.ReactNode
}

export function TechIcon({ name, size, className = "", fallbackIcon }: TechIconProps) {
  const [index, setIndex] = useState(0)
  const candidates = useMemo(() => getTechIconCandidateUrls(name), [name])

  useEffect(() => {
    setIndex(0)
  }, [name])

  const done = candidates.length === 0 || index >= candidates.length
  const src: string | undefined = !done ? candidates[index]! : undefined

  if (done) {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground",
          className,
        )}
        style={size != null ? { width: size, height: size, minWidth: size, minHeight: size } : undefined}
        aria-hidden
      >
        {fallbackIcon ?? (name.trim().slice(0, 1).toUpperCase() || "?")}
      </div>
    )
  }

  return (
    <span
      className={cn("inline-flex items-center justify-center overflow-hidden", className)}
      style={
        size != null
          ? { width: size, height: size, minWidth: size, minHeight: size }
          : undefined
      }
    >
      <img
        src={src}
        alt=""
        width={size ?? undefined}
        height={size ?? undefined}
        className={cn(
          "object-contain",
          size != null ? "h-full w-full max-h-full max-w-full" : "h-full w-full",
        )}
        onError={() => setIndex((i) => i + 1)}
      />
    </span>
  )
}
