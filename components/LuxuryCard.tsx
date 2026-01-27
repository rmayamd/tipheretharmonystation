import { ReactNode } from 'react'

interface LuxuryCardProps {
  children: ReactNode
  className?: string
}

export default function LuxuryCard({ children, className = '' }: LuxuryCardProps) {
  return (
    <div className={`luxury-card ${className}`}>
      {children}
    </div>
  )
}
