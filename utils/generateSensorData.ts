export interface SensorData {
  temperature: number
  humidity: number
  waterLevel: number
  feedLevel: number
  timestamp: Date
}

// Store previous values to make readings more stable
let previousValues = {
  temperature: 25,
  humidity: 55,
  waterLevel: 75,
  feedLevel: 80
}

export const generateSensorData = (): SensorData => {
  // Generate more stable readings by limiting change from previous values
  const maxChange = {
    temperature: 1.5, // Max change of 1.5°C per update
    humidity: 3,      // Max change of 3% per update
    waterLevel: 5,    // Max change of 5% per update
    feedLevel: 2      // Max change of 2% per update
  }

  // Generate new values with limited change from previous
  const newTemperature = Math.max(18, Math.min(35, 
    previousValues.temperature + (Math.random() - 0.5) * 2 * maxChange.temperature
  ))
  
  const newHumidity = Math.max(30, Math.min(80, 
    previousValues.humidity + (Math.random() - 0.5) * 2 * maxChange.humidity
  ))
  
  const newWaterLevel = Math.max(0, Math.min(100, 
    previousValues.waterLevel + (Math.random() - 0.5) * 2 * maxChange.waterLevel
  ))
  
  const newFeedLevel = Math.max(0, Math.min(100, 
    previousValues.feedLevel + (Math.random() - 0.5) * 2 * maxChange.feedLevel
  ))

  // Update previous values
  previousValues = {
    temperature: newTemperature,
    humidity: newHumidity,
    waterLevel: newWaterLevel,
    feedLevel: newFeedLevel
  }

  return {
    temperature: Math.round(newTemperature * 10) / 10, // Round to 1 decimal
    humidity: Math.round(newHumidity * 10) / 10,
    waterLevel: Math.round(newWaterLevel * 10) / 10,
    feedLevel: Math.round(newFeedLevel * 10) / 10,
    timestamp: new Date()
  }
}

export const getStatusColor = (value: number, type: 'temperature' | 'humidity' | 'level'): string => {
  if (type === 'temperature') {
    if (value < 18 || value > 32) return 'text-red-500'
    if (value < 22 || value > 28) return 'text-yellow-500'
    return 'text-green-500'
  }
  
  if (type === 'humidity') {
    if (value < 30 || value > 80) return 'text-red-500'
    if (value < 40 || value > 70) return 'text-yellow-500'
    return 'text-green-500'
  }
  
  if (type === 'level') {
    if (value < 20) return 'text-red-500'
    if (value < 40) return 'text-yellow-500'
    return 'text-green-500'
  }
  
  return 'text-gray-500'
}

export const getStatusText = (value: number, type: 'temperature' | 'humidity' | 'level'): string => {
  if (type === 'temperature') {
    if (value < 18 || value > 32) return 'Critical'
    if (value < 22 || value > 28) return 'Warning'
    return 'Normal'
  }
  
  if (type === 'humidity') {
    if (value < 30 || value > 80) return 'Critical'
    if (value < 40 || value > 70) return 'Warning'
    return 'Normal'
  }
  
  if (type === 'level') {
    if (value < 20) return 'Critical'
    if (value < 40) return 'Warning'
    return 'Normal'
  }
  
  return 'Unknown'
}