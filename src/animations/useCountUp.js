import { useEffect, useState } from 'react'

/** Counts from 0 to `to` over `ms`, after `delay` ms. */
export function useCountUp(to, ms = 1200, delay = 0) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now() + delay
    const tick = (t) => {
      const p = Math.min(1, Math.max(0, (t - start) / ms))
      setV(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, ms, delay])
  return v
}
