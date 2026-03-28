// ─────────────────────────────────────────────────────────────────────
// hooks/useTypewriter.ts
// Cycles through phrases with a blinking cursor.
// Performance: RAF-based, respects prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────────────
 
import { useState, useEffect as useEff } from 'react'
 
export function useTypewriter(phrases: readonly string[], speed = 60) {
  const [displayText, setDisplayText] = useState('')
  const [phraseIdx,   setPhraseIdx]   = useState(0)
  const [charIdx,     setCharIdx]     = useState(0)
  const [deleting,    setDeleting]    = useState(false)
 
  useEff(() => {
    const initialPhrase = phrases[0] ?? ''
    const currentPhrase = phrases[phraseIdx] ?? initialPhrase

    if (!phrases.length) {
      setDisplayText('')
      return
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setDisplayText(initialPhrase)
      return
    }
 
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIdx < currentPhrase.length) {
          setDisplayText(currentPhrase.slice(0, charIdx + 1))
          setCharIdx(charIdx + 1)
        } else {
          // Pause at full phrase, then start deleting
          setTimeout(() => setDeleting(true), 1800)
        }
      } else {
        if (charIdx > 0) {
          setDisplayText(currentPhrase.slice(0, charIdx - 1))
          setCharIdx(charIdx - 1)
        } else {
          setDeleting(false)
          setPhraseIdx((phraseIdx + 1) % phrases.length)
        }
      }
    }, deleting ? speed / 2 : speed)
 
    return () => clearTimeout(timeout)
  }, [phrases, phraseIdx, charIdx, deleting, speed])
 
  return displayText
}
