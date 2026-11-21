import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

/**
 * React 19 idiomatically safe client hydration detector.
 * Avoids cascading renders caused by useEffect(() => setMounted(true), []).
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}
