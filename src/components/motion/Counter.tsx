'use client'

import { animate, useInView } from 'motion/react'
import { useEffect, useRef } from 'react'

type CounterProps = {
  value: string
  className?: string
  duration?: number
}

export function Counter({ value, className, duration = 1.8 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const match = value.match(/\d+/)
  const target = match ? parseInt(match[0], 10) : null
  const prefix = match ? value.slice(0, match.index) : ''
  const suffix = match ? value.slice((match.index ?? 0) + match[0].length) : ''

  useEffect(() => {
    const node = ref.current
    if (!node || target === null || !isInView) return

    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        node.textContent = `${prefix}${Math.round(latest)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [isInView, target, prefix, suffix, duration])

  return (
    <span ref={ref} className={className}>
      {target === null ? value : `${prefix}0${suffix}`}
    </span>
  )
}
