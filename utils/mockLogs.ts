export interface MockLog {
  id: string
  type: 'feeding' | 'alert' | 'refill' | 'system'
  message: string
  timestamp: Date
}

const logMessages = {
  feeding: [
    'Automatic feeding cycle completed',
    'Manual feeding activated',
    'Feed dispenser activated',
    'Feeding schedule updated'
  ],
  alert: [
    'Temperature above normal range',
    'Humidity levels critical',
    'Water level low',
    'Feed level critically low',
    'System maintenance required'
  ],
  refill: [
    'Water tank refilled',
    'Feed hopper refilled',
    'Water system maintenance completed',
    'Feed system cleaned'
  ],
  system: [
    'Cooling system activated',
    'Ventilation system started',
    'System backup completed',
    'Sensor calibration completed',
    'Daily health check passed'
  ]
}

export const generateMockLog = (): MockLog => {
  const types = Object.keys(logMessages) as Array<keyof typeof logMessages>
  const type = types[Math.floor(Math.random() * types.length)]
  const messages = logMessages[type]
  const message = messages[Math.floor(Math.random() * messages.length)]
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    message,
    timestamp: new Date(Date.now() - Math.random() * 86400000) // Random time in last 24h
  }
}

export const generateInitialLogs = (count: number = 20): MockLog[] => {
  return Array.from({ length: count }, () => generateMockLog())
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}
