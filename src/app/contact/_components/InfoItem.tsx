import type { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  titre: string
  children: ReactNode
}

export function InfoItem({ icon, titre, children }: Props) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-red shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="font-display text-xl text-noir mb-1 tracking-wide">{titre}</p>
        <div className="text-gris">{children}</div>
      </div>
    </div>
  )
}
