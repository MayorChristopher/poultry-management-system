// Shared system state management
export interface SystemState {
  temperature: number
  humidity: number
  waterLevel: number
  feedLevel: number
  lastUpdated: Date
  controlActions: ControlAction[]
}

export interface ControlAction {
  id: string
  action: string
  timestamp: Date
  effect: 'temperature' | 'humidity' | 'waterLevel' | 'feedLevel' | 'multiple'
  value?: number
}

// Global system state
let systemState: SystemState = {
  temperature: 25,
  humidity: 55,
  waterLevel: 75,
  feedLevel: 80,
  lastUpdated: new Date(),
  controlActions: []
}

// State change listeners
const listeners: ((state: SystemState) => void)[] = []

export const subscribeToSystemState = (callback: (state: SystemState) => void) => {
  listeners.push(callback)
  return () => {
    const index = listeners.indexOf(callback)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }
}

const notifyListeners = () => {
  listeners.forEach(callback => callback(systemState))
}

// Control actions that affect system state
export const executeControlAction = (action: string): Promise<void> => {
  return new Promise((resolve) => {
    const controlAction: ControlAction = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      timestamp: new Date(),
      effect: 'multiple'
    }

    // Apply control effects based on action
    switch (action) {
      case 'Activate Feeder':
        systemState.feedLevel = Math.min(100, systemState.feedLevel + 30)
        controlAction.effect = 'feedLevel'
        controlAction.value = systemState.feedLevel
        break

      case 'Emergency Feed':
        systemState.feedLevel = Math.min(100, systemState.feedLevel + 50)
        controlAction.effect = 'feedLevel'
        controlAction.value = systemState.feedLevel
        break

      case 'Refill Water Tank':
        systemState.waterLevel = Math.min(100, systemState.waterLevel + 40)
        controlAction.effect = 'waterLevel'
        controlAction.value = systemState.waterLevel
        break

      case 'Flush Water System':
        systemState.waterLevel = Math.max(20, systemState.waterLevel - 10) // Temporary decrease
        setTimeout(() => {
          systemState.waterLevel = Math.min(100, systemState.waterLevel + 20)
          systemState.lastUpdated = new Date()
          notifyListeners()
        }, 3000)
        controlAction.effect = 'waterLevel'
        controlAction.value = systemState.waterLevel
        break

      case 'Start Cooling System':
        systemState.temperature = Math.max(18, systemState.temperature - 3)
        systemState.humidity = Math.max(30, systemState.humidity - 5)
        controlAction.effect = 'multiple'
        break

      case 'Emergency Ventilation':
        systemState.temperature = Math.max(18, systemState.temperature - 5)
        systemState.humidity = Math.max(30, systemState.humidity - 10)
        controlAction.effect = 'multiple'
        break

      case 'System Diagnostics':
        // Normalize all values slightly
        systemState.temperature = Math.max(20, Math.min(28, systemState.temperature + (Math.random() - 0.5) * 2))
        systemState.humidity = Math.max(40, Math.min(70, systemState.humidity + (Math.random() - 0.5) * 5))
        controlAction.effect = 'multiple'
        break

      case 'Reset All Systems':
        // Reset to optimal values
        systemState.temperature = 24
        systemState.humidity = 55
        systemState.waterLevel = 85
        systemState.feedLevel = 90
        controlAction.effect = 'multiple'
        break
    }

    systemState.controlActions.unshift(controlAction)
    systemState.controlActions = systemState.controlActions.slice(0, 10) // Keep last 10 actions
    systemState.lastUpdated = new Date()

    notifyListeners()
    resolve()
  })
}

// Generate sensor data based on current system state with gradual changes
export const generateSystemSensorData = () => {
  // Apply gradual natural changes
  const maxChange = {
    temperature: 0.5,
    humidity: 1,
    waterLevel: 2,
    feedLevel: 1
  }

  // Natural drift (simulate real-world conditions)
  systemState.temperature += (Math.random() - 0.5) * 2 * maxChange.temperature
  systemState.humidity += (Math.random() - 0.5) * 2 * maxChange.humidity
  systemState.waterLevel = Math.max(0, systemState.waterLevel - Math.random() * maxChange.waterLevel)
  systemState.feedLevel = Math.max(0, systemState.feedLevel - Math.random() * maxChange.feedLevel)

  // Keep within realistic bounds
  systemState.temperature = Math.max(15, Math.min(40, systemState.temperature))
  systemState.humidity = Math.max(20, Math.min(90, systemState.humidity))
  systemState.waterLevel = Math.max(0, Math.min(100, systemState.waterLevel))
  systemState.feedLevel = Math.max(0, Math.min(100, systemState.feedLevel))

  systemState.lastUpdated = new Date()

  return {
    temperature: Math.round(systemState.temperature * 10) / 10,
    humidity: Math.round(systemState.humidity * 10) / 10,
    waterLevel: Math.round(systemState.waterLevel * 10) / 10,
    feedLevel: Math.round(systemState.feedLevel * 10) / 10,
    timestamp: systemState.lastUpdated
  }
}

// Get current system state
export const getSystemState = (): SystemState => {
  return { ...systemState }
}

// Initialize with some random variance
systemState.temperature += (Math.random() - 0.5) * 4
systemState.humidity += (Math.random() - 0.5) * 10
systemState.waterLevel += (Math.random() - 0.5) * 20
systemState.feedLevel += (Math.random() - 0.5) * 20