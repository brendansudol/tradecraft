import { useEffect, useRef } from "react"
import { useLocation } from "react-router"

export function usePrev(value) {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export function useHash() {
  const location = useLocation()
  return decodeURIComponent(location.hash.slice(1))
}

export function useQuery() {
  const location = useLocation()
  return new URLSearchParams(location.search)
}
