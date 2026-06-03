import Image from "next/image"
import { cn } from "@/lib/utils"

type ProfilePortraitProps = {
  className?: string
  imageClassName?: string
  priority?: boolean
  variant?: "hero" | "about" | "compact"
}

const variantStyles = {
  hero: {
    wrapper: "w-full max-w-[22rem] sm:max-w-[26rem] md:max-w-[28rem]",
    aspect: "aspect-[4/5]",
    radius: "rounded-[1.75rem] md:rounded-[2rem]",
    ring: "ring-2 ring-sky-400/40",
  },
  about: {
    wrapper: "w-full",
    aspect: "aspect-[4/5]",
    radius: "rounded-[1.5rem]",
    ring: "ring-2 ring-primary/35",
  },
  compact: {
    wrapper: "w-32 h-32",
    aspect: "aspect-square",
    radius: "rounded-2xl",
    ring: "ring-2 ring-primary/30",
  },
}

export function ProfilePortrait({
  className,
  imageClassName,
  priority = false,
  variant = "hero",
}: ProfilePortraitProps) {
  const styles = variantStyles[variant]

  return (
    <div className={cn("relative mx-auto", styles.wrapper, className)}>
      <div
        className="pointer-events-none absolute -inset-4 rounded-[2.25rem] bg-gradient-to-br from-sky-500/25 via-primary/15 to-[hsl(var(--navy-deep))]/50 blur-2xl"
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-sky-400/20 blur-3xl",
          variant === "compact" && "hidden",
        )}
        aria-hidden
      />
      <div
        className={cn(
          "relative overflow-hidden shadow-2xl shadow-sky-950/30",
          styles.aspect,
          styles.radius,
          styles.ring,
        )}
      >
        <Image
          src="/images/ismail-portrait.png"
          alt="Ismail MOUYAHADA — Développeur Full-Stack & DevOps"
          fill
          priority={priority}
          sizes={
            variant === "hero"
              ? "(max-width: 768px) 85vw, 28rem"
              : variant === "about"
                ? "(max-width: 1024px) 100vw, 24rem"
                : "8rem"
          }
          className={cn("object-cover object-[center_15%]", imageClassName)}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy-deep))]/40 via-transparent to-sky-500/5"
          aria-hidden
        />
      </div>
    </div>
  )
}
