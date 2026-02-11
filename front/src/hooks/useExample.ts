import { useState, useCallback } from 'react'

/**
 * 예시 커스텀 훅 - 토글 기능
 */
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)
  const toggle = useCallback(() => setValue((v) => !v), [])
  return [value, toggle] as const
}
