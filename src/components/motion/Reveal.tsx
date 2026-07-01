'use client'

import { motion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'

const MAX_STAGGER_INDEX = 5
const STAGGER_STEP = 0.12

const tags = {
  div: motion.div,
  li: motion.li,
  span: motion.span,
  section: motion.section,
  article: motion.article,
} as const

type RevealProps = {
  children: ReactNode
  className?: string
  index?: number
  delay?: number
  y?: number
  duration?: number
  as?: keyof typeof tags
}

export function Reveal({
  children,
  className,
  index = 0,
  delay = 0,
  y = 24,
  duration = 0.8,
  as = 'div',
}: RevealProps) {
  const Component = tags[as]
  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay: delay + Math.min(index, MAX_STAGGER_INDEX) * STAGGER_STEP,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={variants}
    >
      {children}
    </Component>
  )
}
