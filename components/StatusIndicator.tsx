interface StatusIndicatorProps {
  status: 'normal' | 'warning' | 'critical'
  label: string
}

export default function StatusIndicator({ status, label }: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'normal':
        return {
          color: 'bg-green-600',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        }
      case 'warning':
        return {
          color: 'bg-amber-600',
          textColor: 'text-amber-700',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200'
        }
      case 'critical':
        return {
          color: 'bg-red-600',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        }
    }
  }
  
  const config = getStatusConfig()
  
  return (
    <div className={`flex items-center space-x-3 px-4 py-2 border ${config.bgColor} ${config.borderColor}`}>
      <div className={`w-2 h-2 ${config.color}`} />
      <span className={`text-sm font-medium uppercase tracking-wide ${config.textColor}`}>
        {label}
      </span>
    </div>
  )
}