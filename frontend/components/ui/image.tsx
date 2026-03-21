"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

interface CustomImageProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  loading?: "lazy" | "eager"
  [key: string]: any
}

export function CustomImage({ 
  src, 
  alt, 
  className = "", 
  fill = false,
  width,
  height,
  priority = false,
  loading = "lazy",
  ...props 
}: CustomImageProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Toujours utiliser Next.js Image pour éviter les différences d'hydratation
  // Mais avec des props stables
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        loading={priority ? "eager" : loading}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          objectFit: 'cover'
        }}
        {...props}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={className}
      priority={priority}
      loading={priority ? "eager" : loading}
      {...props}
    />
  )
}
