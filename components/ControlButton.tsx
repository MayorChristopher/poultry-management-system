interface ControlButtonProps {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

export default function ControlButton({ 
  title, 
  description, 
  icon, 
  onClick, 
  variant = 'primary',
  disabled = false 
}: ControlButtonProps) {
  const getVariantClasses = () => {
    if (disabled) {
      return 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
    }
    
    switch (variant) {
      case 'primary':
        return 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 hover:border-blue-300'
      case 'secondary':
        return 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200 hover:border-green-300'
      case 'danger':
        return 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200 hover:border-red-300'
      default:
        return 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200 hover:border-gray-300'
    }
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-6 rounded-lg border-2 transition-all duration-200 ${getVariantClasses()}`}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm opacity-75 mt-1">{description}</p>
        </div>
      </div>
    </button>
  )
}
