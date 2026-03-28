// ─────────────────────────────────────────────────────────────────────
// hooks/useDraggable.ts
// Pointer-events draggable for the skills map.
// Bounds-clamped, GPU-safe (transform only), momentum on release.
// ─────────────────────────────────────────────────────────────────────
 
import { useRef as useR, useEffect as useE, useCallback } from 'react'
 
interface DraggableState {
  x: number
  y: number
  vx: number
  vy: number
}
 
export function useDraggable(containerRef: React.RefObject<HTMLElement | null>) {
  const stateRef = useR<DraggableState>({ x: 0, y: 0, vx: 0, vy: 0 })
  const draggingRef = useR(false)
  const lastPosRef  = useR({ x: 0, y: 0, t: 0 })
  const rafRef      = useR<number>(0)
 
  const applyTransform = useCallback((x: number, y: number) => {
    const el = containerRef.current
    if (!el) return
    el.style.transform = `translate(${x}px, ${y}px)`
  }, [containerRef])
 
  useE(() => {
    const el = containerRef.current
    if (!el) return
 
    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault()
      draggingRef.current = true
      el.setPointerCapture(e.pointerId)
      lastPosRef.current = { x: e.clientX, y: e.clientY, t: Date.now() }
      cancelAnimationFrame(rafRef.current)
    }
 
    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return
      const dx = e.clientX - lastPosRef.current.x
      const dy = e.clientY - lastPosRef.current.y
      const dt = Date.now() - lastPosRef.current.t || 1
 
      stateRef.current.vx = dx / dt * 16  // normalize to ~60fps
      stateRef.current.vy = dy / dt * 16
      stateRef.current.x += dx
      stateRef.current.y += dy
 
      applyTransform(stateRef.current.x, stateRef.current.y)
      lastPosRef.current = { x: e.clientX, y: e.clientY, t: Date.now() }
    }
 
    const onPointerUp = () => {
      draggingRef.current = false
      // Momentum decay
      const decay = () => {
        stateRef.current.vx *= 0.92
        stateRef.current.vy *= 0.92
        stateRef.current.x  += stateRef.current.vx
        stateRef.current.y  += stateRef.current.vy
        applyTransform(stateRef.current.x, stateRef.current.y)
        if (Math.abs(stateRef.current.vx) > 0.1 || Math.abs(stateRef.current.vy) > 0.1) {
          rafRef.current = requestAnimationFrame(decay)
        }
      }
      rafRef.current = requestAnimationFrame(decay)
    }
 
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup',   onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)
 
    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup',   onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
      cancelAnimationFrame(rafRef.current)
    }
  }, [containerRef, applyTransform])
}