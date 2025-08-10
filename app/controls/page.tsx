'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, getUserProfile, signOut } from '@/lib/auth'
import { executeControlAction } from '@/lib/systemState'
import { Bird, LogOut, Settings, BarChart3, FileText, Utensils, Droplets, Wind, Thermometer, Power, AlertTriangle, User } from 'lucide-react'
import ResponsiveNav from '@/components/ResponsiveNav'

export default function ControlsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkUser()
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
      
      // Check if user is admin
      if (profileData?.role !== 'admin') {
        router.push('/dashboard')
        return
      }
      
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

  const handleControlAction = async (action: string, description: string) => {
    setActionLoading(action)
    
    try {
      // Execute the control action which will affect system state
      await executeControlAction(action)
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Log the action
      console.log(`Admin action: ${action} - ${description}`)
      
      // Show success message
      alert(`${action} completed successfully! Check dashboard for updated readings.`)
    } catch (error) {
      console.error('Control action failed:', error)
      alert(`${action} failed. Please try again.`)
    } finally {
      setActionLoading(null)
    }
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
        <div className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 text-xs font-medium uppercase tracking-wide mb-2 lg:mb-0 lg:mr-4">
          Admin Access Required
        </div>
        
        <nav className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-1">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 px-3 lg:px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-all duration-200 uppercase tracking-wide font-medium"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          
          <Link
            href="/logs"
            className="flex items-center space-x-2 px-3 lg:px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-all duration-200 uppercase tracking-wide font-medium"
          >
            <FileText className="h-4 w-4" />
            <span>Logs</span>
          </Link>
          
          <div className="flex items-center space-x-2 px-3 lg:px-4 py-2 text-sm text-gray-900 bg-gray-100 border border-gray-300 uppercase tracking-wide font-medium">
            <Settings className="h-4 w-4" />
            <span>Controls</span>
          </div>
        </nav>
      </ResponsiveNav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Controls Header */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 uppercase tracking-wide mb-2">Equipment Control Panel</h2>
          <p className="text-sm text-gray-600">
            Remote operation of farm systems. All control actions are logged and will immediately affect dashboard readings.
          </p>
        </div>

        {/* Control Sections */}
        <div className="space-y-8 lg:space-y-12">
          {/* Feeding Controls */}
          <div>
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gray-100 border border-gray-300 mr-4">
                <Utensils className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">Feeding System</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 border border-gray-200 flex-shrink-0">
                        <Utensils className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Activate Feeder</h4>
                        <p className="text-xs text-gray-600">Increases feed level by ~30%</p>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 text-xs font-medium uppercase tracking-wide self-start sm:self-auto">
                      Ready
                    </div>
                  </div>
                  <button
                    onClick={() => handleControlAction('Activate Feeder', 'Manual feeding cycle initiated')}
                    disabled={actionLoading === 'Activate Feeder'}
                    className="w-full px-4 py-3 lg:py-4 bg-gray-800 text-white border border-gray-600 hover:bg-gray-900 font-medium transition-all duration-200 uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed btn-touch"
                  >
                    {actionLoading === 'Activate Feeder' ? 'Processing...' : 'Execute Command'}
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 border border-gray-200 flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Emergency Feed</h4>
                        <p className="text-xs text-gray-600">Increases feed level by ~50%</p>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium uppercase tracking-wide self-start sm:self-auto">
                      Emergency
                    </div>
                  </div>
                  <button
                    onClick={() => handleControlAction('Emergency Feed', 'Emergency feeding protocol activated')}
                    disabled={actionLoading === 'Emergency Feed'}
                    className="w-full px-4 py-3 lg:py-4 bg-amber-700 text-white border border-amber-600 hover:bg-amber-800 font-medium transition-all duration-200 uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed btn-touch"
                  >
                    {actionLoading === 'Emergency Feed' ? 'Processing...' : 'Execute Command'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Water System Controls */}
          <div>
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gray-100 border border-gray-300 mr-4">
                <Droplets className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">Water Management</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 border border-gray-200 flex-shrink-0">
                        <Droplets className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Refill Water Tank</h4>
                        <p className="text-xs text-gray-600">Increases water level by ~40%</p>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 text-xs font-medium uppercase tracking-wide self-start sm:self-auto">
                      Ready
                    </div>
                  </div>
                  <button
                    onClick={() => handleControlAction('Refill Water Tank', 'Water tank refill initiated')}
                    disabled={actionLoading === 'Refill Water Tank'}
                    className="w-full px-4 py-3 lg:py-4 bg-gray-800 text-white border border-gray-600 hover:bg-gray-900 font-medium transition-all duration-200 uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed btn-touch"
                  >
                    {actionLoading === 'Refill Water Tank' ? 'Processing...' : 'Execute Command'}
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 border border-gray-200 flex-shrink-0">
                        <Power className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Flush Water System</h4>
                        <p className="text-xs text-gray-600">Temporary decrease, then refill</p>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium uppercase tracking-wide self-start sm:self-auto">
                      Maintenance
                    </div>
                  </div>
                  <button
                    onClick={() => handleControlAction('Flush Water System', 'Water system maintenance cycle started')}
                    disabled={actionLoading === 'Flush Water System'}
                    className="w-full px-4 py-3 lg:py-4 bg-blue-700 text-white border border-blue-600 hover:bg-blue-800 font-medium transition-all duration-200 uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed btn-touch"
                  >
                    {actionLoading === 'Flush Water System' ? 'Processing...' : 'Execute Command'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Climate Controls */}
          <div>
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gray-100 border border-gray-300 mr-4">
                <Thermometer className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">Climate Control</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 border border-gray-200 flex-shrink-0">
                        <Wind className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Start Cooling System</h4>
                        <p className="text-xs text-gray-600">Reduces temperature & humidity</p>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 text-xs font-medium uppercase tracking-wide self-start sm:self-auto">
                      Ready
                    </div>
                  </div>
                  <button
                    onClick={() => handleControlAction('Start Cooling System', 'Cooling system activated')}
                    disabled={actionLoading === 'Start Cooling System'}
                    className="w-full px-4 py-3 lg:py-4 bg-gray-800 text-white border border-gray-600 hover:bg-gray-900 font-medium transition-all duration-200 uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed btn-touch"
                  >
                    {actionLoading === 'Start Cooling System' ? 'Processing...' : 'Execute Command'}
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 border border-gray-200 flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Emergency Ventilation</h4>
                        <p className="text-xs text-gray-600">Maximum cooling effect</p>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 text-xs font-medium uppercase tracking-wide self-start sm:self-auto">
                      Critical
                    </div>
                  </div>
                  <button
                    onClick={() => handleControlAction('Emergency Ventilation', 'Emergency ventilation protocol activated')}
                    disabled={actionLoading === 'Emergency Ventilation'}
                    className="w-full px-4 py-3 lg:py-4 bg-red-700 text-white border border-red-600 hover:bg-red-800 font-medium transition-all duration-200 uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed btn-touch"
                  >
                    {actionLoading === 'Emergency Ventilation' ? 'Processing...' : 'Execute Command'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* System Controls */}
          <div>
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gray-100 border border-gray-300 mr-4">
                <Settings className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">System Management</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 border border-gray-200 flex-shrink-0">
                        <Settings className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wide">System Diagnostics</h4>
                        <p className="text-xs text-gray-600">Optimizes all readings</p>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-purple-50 text-purple-700 border border-purple-200 text-xs font-medium uppercase tracking-wide self-start sm:self-auto">
                      Diagnostic
                    </div>
                  </div>
                  <button
                    onClick={() => handleControlAction('System Diagnostics', 'System diagnostics initiated')}
                    disabled={actionLoading === 'System Diagnostics'}
                    className="w-full px-4 py-3 lg:py-4 bg-purple-700 text-white border border-purple-600 hover:bg-purple-800 font-medium transition-all duration-200 uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed btn-touch"
                  >
                    {actionLoading === 'System Diagnostics' ? 'Processing...' : 'Execute Command'}
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 border border-gray-200 flex-shrink-0">
                        <Power className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Reset All Systems</h4>
                        <p className="text-xs text-gray-600">Resets to optimal values</p>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 text-xs font-medium uppercase tracking-wide self-start sm:self-auto">
                      Reset
                    </div>
                  </div>
                  <button
                    onClick={() => handleControlAction('Reset All Systems', 'Complete system reset initiated')}
                    disabled={actionLoading === 'Reset All Systems'}
                    className="w-full px-4 py-3 lg:py-4 bg-red-700 text-white border border-red-600 hover:bg-red-800 font-medium transition-all duration-200 uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed btn-touch"
                  >
                    {actionLoading === 'Reset All Systems' ? 'Processing...' : 'Execute Command'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Status Modal */}
        {actionLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-gray-300 p-6 lg:p-8 max-w-sm w-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600 mx-auto mb-4"></div>
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 uppercase tracking-wide mb-2">Processing Command</h3>
                <p className="text-sm text-gray-600 uppercase tracking-wide">{actionLoading} in progress...</p>
                <p className="text-xs text-gray-500 mt-2">Dashboard will update automatically</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}