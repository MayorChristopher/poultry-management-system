import { getStatusColor, getStatusText } from '@/utils/generateSensorData'

interface SensorCardProps {
  title: string
  value: number
  unit: string
  type: 'temperature' | 'humidity' | 'level'
  icon: React.ReactNode
}

export default function SensorCard({ title, value, unit, type, icon }: SensorCardProps) {
  const statusColor = getStatusColor(value, type)
  const statusText = getStatusText(value, type)
  
  return (
    <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-6 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 border border-gray-200 flex-shrink-0">
              {icon}
            </div>
            <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">{title}</h3>
          </div>
          <div className={`px-2 py-1 text-xs font-medium uppercase tracking-wide border self-start sm:self-auto ${
            statusText === 'Normal' ? 'bg-green-50 text-green-700 border-green-200' :
            statusText === 'Warning' ? 'bg-amber-50 text-amber-700 border-amber-200' :
            'bg-red-50 text-red-700 border-red-200'
          }`}>
            {statusText}
          </div>
        </div>
        
        <div className="flex items-baseline space-x-2 mb-4">
          <span className={`text-xl lg:text-2xl font-bold tabular-nums ${statusColor}`}>
            {value}
          </span>
          <span className="text-sm text-gray-500 font-medium">{unit}</span>
        </div>
        
        <div className="bg-gray-200 h-1">
          <div 
            className={`h-1 transition-all duration-300 ${
              statusText === 'Normal' ? 'bg-green-600' :
              statusText === 'Warning' ? 'bg-amber-600' :
              'bg-red-600'
            }`}
            style={{ 
              width: type === 'level' ? `${value}%` : 
                     type === 'temperature' ? `${Math.min(100, (value / 40) * 100)}%` :
                     `${Math.min(100, value)}%`
            }}
          />
        </div>
      </div>
    </div>
  )
}