'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export default function LoadingSpinner({
  size = 'md',
  message,
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className={`${sizes[size]} border-4 border-zen-primary border-t-transparent rounded-full animate-spin`}
      ></div>
      {message && (
        <p className="mt-4 text-sm text-luxury-dark/70">{message}</p>
      )}
    </div>
  )
}
