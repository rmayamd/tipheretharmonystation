interface ProgressBarProps {
  value: number
  max?: number
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  showLabel?: boolean
  label?: string
}

export default function ProgressBar({
  value,
  max = 100,
  color = 'primary',
  showLabel = true,
  label,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const colorClasses = {
    primary: 'bg-zen-primary',
    secondary: 'bg-zen-secondary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-600',
  }

  return (
    <div>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm text-luxury-dark/70">
            {label || 'Progreso'}
          </span>
          <span className="text-sm font-semibold">
            {value.toFixed(1)}%
          </span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className={`${colorClasses[color]} h-4 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}
