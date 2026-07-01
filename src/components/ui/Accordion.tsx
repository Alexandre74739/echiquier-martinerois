'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Reveal } from '@/src/components/motion/Reveal'

export type AccordionItem = { question: string; reponse: string }

export function Accordion({
  items,
  className = '',
}: {
  items: AccordionItem[]
  className?: string
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map(({ question, reponse }, index) => {
        const isOpen = openIndex === index
        return (
          <Reveal key={question} index={index} y={16} className="border-l-4 border-red">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 text-left pl-6 pr-4 py-3 font-semibold text-noir cursor-pointer"
            >
              {question}
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-red text-xl leading-none shrink-0"
                aria-hidden="true"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="text-gris text-sm leading-relaxed pl-6 pr-4 pb-4">
                    {reponse}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>
        )
      })}
    </div>
  )
}
