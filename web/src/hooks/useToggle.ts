import { useCallback, useState } from 'react'

const useToggle = (value = false) => {
  const [bool, setBool] = useState(value)
  const on = useCallback(() => setBool(true), [])
  const off = useCallback(() => setBool(false), [])
  const toggle = useCallback(() => setBool((s) => !s), [])
  return { bool, on, off, toggle }
}

export default useToggle
