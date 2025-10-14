import { useState, useEffect } from "react"

/**
 * Hook for debouncing values
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook for debouncing callback functions
 * @param callback - The callback function to debounce
 * @param delay - The delay in milliseconds
 * @param deps - Dependencies array for the callback
 * @returns The debounced callback function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const [debouncedCallback, setDebouncedCallback] = useState<T>(() => callback)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [callback, delay, ...deps])

  return debouncedCallback
}

/**
 * Hook for throttling values
 * @param value - The value to throttle
 * @param limit - The time limit in milliseconds
 * @returns The throttled value
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const [lastRan, setLastRan] = useState<number>(Date.now())

  useEffect(() => {
    if (Date.now() - lastRan >= limit) {
      setThrottledValue(value)
      setLastRan(Date.now())
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value)
        setLastRan(Date.now())
      }, limit - (Date.now() - lastRan))

      return () => clearTimeout(timer)
    }
  }, [value, limit, lastRan])

  return throttledValue
}

export default useDebounce
