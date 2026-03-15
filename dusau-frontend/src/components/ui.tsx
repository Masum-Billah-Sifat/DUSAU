'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type FadeInProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

export function FadeIn({
  children,
  className = '',
  delay = 0,
  y = 26,
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description: string
  center?: boolean
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
}: SectionHeadingProps) {
  return (
    <FadeIn className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <span className="pill">{eyebrow}</span>
      <h2 className="font-display mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
        {description}
      </p>
    </FadeIn>
  )
}