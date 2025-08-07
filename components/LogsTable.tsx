import { MockLog } from '@/utils/mockLogs'

interface LogsTableProps {
  logs: MockLog[]
}

export default function LogsTable({ logs }: LogsTableProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feeding':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'alert':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'refill':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'system':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }
  
  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }
  
  return (
    <div className="overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-300 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Recent Activity</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wide">
                Event Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wide">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wide">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium uppercase tracking-wide border ${getTypeColor(log.type)}`}>
                    {log.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {log.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                  {formatTime(log.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {logs.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-wide">No log entries found</p>
        </div>
      )}
    </div>
  )
}