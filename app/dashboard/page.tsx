'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, getUserProfile, signOut } from '@/lib/auth'
import { generateSystemSensorData, subscribeToSystemState, getSystemState } from '@/lib/systemState'
import { SensorData } from '@/utils/generateSensorData'
import SensorCard from '@/components/SensorCard'
import LineChart from '@/components/LineChart'
import StatusIndicator from '@/components/StatusIndicator'
import { Bird, Thermometer, Droplets, Gauge, Wheat, LogOut, Settings, FileText, User } from 'lucide-react'
import ResponsiveNav from '@/components/ResponsiveNav'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [sensorData, setSensorData] = useState<SensorData>(generateSystemSensorData())
  const [temperatureHistory, setTemperatureHistory] = useState<Array<{timestamp: Date, value: number}>>([])
  const [humidityHistory, setHumidityHistory] = useState<Array<{timestamp: Date, value: number}>>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    // Subscribe to system state changes
    const unsubscribe = subscribeToSystemState((state) => {
      const newData = generateSystemSensorData()
      setSensorData(newData)
      
      // Update history (keep last 20 points)
      setTemperatureHistory(prev => {
        const newHistory = [...prev, { timestamp: newData.timestamp, value: newData.temperature }]
        return newHistory.slice(-20)
      })
      
      setHumidityHistory(prev => {
        const newHistory = [...prev, { timestamp: newData.timestamp, value: newData.humidity }]
        return newHistory.slice(-20)
      })
    })

    // Update sensor data every 30 seconds
    const interval = setInterval(() => {
      const newData = generateSystemSensorData()
      setSensorData(newData)
      
      // Update history (keep last 20 points)
      setTemperatureHistory(prev => {
        const newHistory = [...prev, { timestamp: newData.timestamp, value: newData.temperature }]
        return newHistory.slice(-20)
      })
      
      setHumidityHistory(prev => {
        const newHistory = [...prev, { timestamp: newData.timestamp, value: newData.humidity }]
        return newHistory.slice(-20)
      })
    }, 30000)

    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/login')
        return
      }

      setUser(currentUser)
      
      const { data: profileData } = await getUserProfile(currentUser.id)
      setProfile(profileData)
      
      // Initialize history with current data
      const initialData = generateSystemSensorData()
      setSensorData(initialData)
      setTemperatureHistory([{ timestamp: initialData.timestamp, value: initialData.temperature }])
      setHumidityHistory([{ timestamp: initialData.timestamp, value: initialData.humidity }])
      
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const getOverallStatus = () => {
    const tempStatus = sensorData.temperature < 18 || sensorData.temperature > 32 ? 'critical' :
                     sensorData.temperature < 22 || sensorData.temperature > 28 ? 'warning' : 'normal'
    
    const humidityStatus = sensorData.humidity < 30 || sensorData.humidity > 80 ? 'critical' :
                          sensorData.humidity < 40 || sensorData.humidity > 70 ? 'warning' : 'normal'
    
    const waterStatus = sensorData.waterLevel < 20 ? 'critical' :
                       sensorData.waterLevel < 40 ? 'warning' : 'normal'
    
    const feedStatus = sensorData.feedLevel < 20 ? 'critical' :
                      sensorData.feedLevel < 40 ? 'warning' : 'normal'

    if ([tempStatus, humidityStatus, waterStatus, feedStatus].includes('critical')) {
      return 'critical'
    }
    if ([tempStatus, humidityStatus, waterStatus, feedStatus].includes('warning')) {
      return 'warning'
    }
    return 'normal'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600 uppercase tracking-wide">Loading System...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <ResponsiveNav user={user} profile={profile} onSignOut={handleSignOut}>
        <StatusIndicator 
          status={getOverallStatus()} 
          label={`System ${getOverallStatus().charAt(0).toUpperCase() + getOverallStatus().slice(1)}`}
        />
        
        <nav className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-1">
          <Link
            href="/"
            className="flex items-center space-x-2 px-3 lg:px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-all duration-200"
          >
            <Bird className="h-4 w-4" />
            <span className="uppercase tracking-wide font-medium">Home</span>
          </Link>
          
          <Link
            href="/logs"
            className="flex items-center space-x-2 px-3 lg:px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-all duration-200"
          >
            <FileText className="h-4 w-4" />
            <span className="uppercase tracking-wide font-medium">Logs</span>
          </Link>
          
          {profile?.role === 'admin' && (
            <Link
              href="/controls"
              className="flex items-center space-x-2 px-3 lg:px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-all duration-200"
            >
              <Settings className="h-4 w-4" />
              <span className="uppercase tracking-wide font-medium">Controls</span>
            </Link>
          )}
        </nav>
      </ResponsiveNav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* System Status Header */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-base lg:text-lg font-semibold text-gray-900 uppercase tracking-wide mb-2">Environmental Monitoring</h2>
          <p className="text-sm text-gray-600">Real-time sensor data and system status</p>
        </div>

        {/* Sensor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
          <SensorCard
            title="Temperature"
            value={sensorData.temperature}
            unit="°C"
            type="temperature"
            icon={<Thermometer className="h-5 w-5 text-gray-600" />}
          />
          <SensorCard
            title="Humidity"
            value={sensorData.humidity}
            unit="%"
            type="humidity"
            icon={<Droplets className="h-5 w-5 text-gray-600" />}
          />
          <SensorCard
            title="Water Level"
            value={sensorData.waterLevel}
            unit="%"
            type="level"
            icon={<Gauge className="h-5 w-5 text-gray-600" />}
          />
          <SensorCard
            title="Feed Level"
            value={sensorData.feedLevel}
            unit="%"
            type="level"
            icon={<Wheat className="h-5 w-5 text-gray-600" />}
          />
        </div>

        {/* Charts Section */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-base lg:text-lg font-semibold text-gray-900 uppercase tracking-wide mb-2">Trend Analysis</h2>
          <p className="text-sm text-gray-600 mb-4 lg:mb-6">Historical data visualization</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          <LineChart
            data={temperatureHistory}
            title="Temperature Trend"
            color="#374151"
            unit="°C"
          />
          <LineChart
            data={humidityHistory}
            title="Humidity Trend"
            color="#374151"
            unit="%"
          />
        </div>
      </main>
    </div>
  )
}