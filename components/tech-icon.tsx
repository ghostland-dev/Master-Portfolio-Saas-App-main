"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { getTechnologyIconUrl } from "@/lib/simple-icons-utils"

interface TechIconProps {
  name: string
  size?: number
  className?: string
  fallbackIcon?: React.ReactNode
}

// Mapping des noms de technologies vers les noms de fichiers d'images
const techIconMapping: Record<string, string> = {
  "react": "react",
  "nextjs": "nextjs", 
  "nodejs": "nodejs",
  "docker": "docker",
  "kubernetes": "kubernetes",
  "postgresql": "postgresql",
  "book": "book",
  "code": "code",
  "mail": "mail",
  "git-branch": "git-branch",
  "terminal": "terminal",
  "layers": "layers",
  "server": "server",
  "test-tube": "test-tube",
  "palette": "palette",
  "cloud": "cloud",
  "database": "database",
  "shopping-cart": "shopping-cart",
}

export function TechIcon({ name, size = 24, className = "", fallbackIcon }: TechIconProps) {
  const [error, setError] = useState(false)
  
  // Utiliser le mapping pour obtenir le nom de fichier correct
  const fileName = techIconMapping[name.toLowerCase()] || name.toLowerCase()
  const iconUrl = `/images/tech/${fileName}.svg`

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        {fallbackIcon || name.charAt(0)}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src={iconUrl}
        alt={`${name} icon`}
        width={size}
        height={size}
        className="object-contain"
        onError={() => setError(true)}
      />
    </div>
  )
}

