import { useEffect, useState, useRef } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export function useDebouncedValue<T>(
  value: T,
  onChange: (value: T) => void,
  delay = 500,
) {
  const [localValue, setLocalValue] = useState<T>(value)
  const previousValueRef = useRef<T>(value)

  const debouncedChange = useDebouncedCallback((newValue: T) => {
    onChange(newValue)
  }, delay)

  useEffect(() => {
    if (value !== previousValueRef.current) {
      setLocalValue(value)
      debouncedChange.cancel()
      previousValueRef.current = value
    }
  }, [value, debouncedChange])

  const handleChange = (newValue: T) => {
    previousValueRef.current = newValue
    setLocalValue(newValue)
    debouncedChange(newValue)
  }

  return [localValue, handleChange] as const
}
