// ─────────────────────────────────────────────────────────────────────
// SubtleParallaxWrapper.tsx
// Low-cost parallax via CSS animation — no scroll listeners on main thread.
// ─────────────────────────────────────────────────────────────────────
'use client'
 
interface SubtleParallaxWrapperProps {
  children:   React.ReactNode
  intensity?: 'sm' | 'md' | 'lg'
  className?: string
}
 
export function SubtleParallaxWrapper({
  children,
  intensity = 'md',
  className = '',
}: SubtleParallaxWrapperProps) {
  // We use CSS animation (oscar-parallax-drift) instead of scroll listener
  // for minimal main-thread impact.
  const durationMap = { sm: '3s', md: '4s', lg: '6s' }
 
  return (
    <div
      className={`animate-parallax ${className}`}
      style={{ animationDuration: durationMap[intensity] }}
    >
      {children}
    </div>
  )
}