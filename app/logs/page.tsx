'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, getUserProfile, signOut } from '@/lib/auth'
import { generateInitialLogs, generateMockLog, MockLog } from '@/utils/mockLogs'
import LogsTable from '@/components/LogsTable'
import { Bird, LogOut, Settings, BarChart3, FileText, RefreshCw, User } from 'lucide-react'
import ResponsiveNav from '@/components/ResponsiveNav'

export default function LogsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [logs, setLogs] = useState<MockLog[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    // Initialize logs
    setLogs(generateInitialLogs(50))
    
    // Add new log every 10-30 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every interval
        const newLog = generateMockLog()
        setLogs(prev => [newLog, ...prev.slice(0, 49)]) // Keep last 50 logs
      }
    }, 10000)

    return () => clearInterval(interval)
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

  const refreshLogs = () => {
    setLogs(generateInitialLogs(50))
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
        <nav className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-1">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 px-3 lg:px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-all duration-200 uppercase tracking-wide font-medium"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          
          <div className="flex items-center space-x-2 px-3 lg:px-4 py-2 text-sm text-gray-900 bg-gray-100 border border-gray-300 uppercase tracking-wide font-medium">
            <FileText className="h-4 w-4" />
            <span>Logs</span>
          </div>
          
          {profile?.role === 'admin' && (
            <Link
              href="/controls"
              className="flex items-center space-x-2 px-3 lg:px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-all duration-200 uppercase tracking-wide font-medium"
            >
              <Settings className="h-4 w-4" />
              <span>Controls</span>
            </Link>
          )}
        </nav>
      </ResponsiveNav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Logs Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 lg:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-base lg:text-lg font-semibold text-gray-900 uppercase tracking-wide mb-2">Activity Logs</h2>
            <p className="text-sm text-gray-600">
              Real-time system events and operational activities
            </p>
          </div>
          
          <button
            onClick={refreshLogs}
            className="flex items-center justify-center space-x-2 px-4 py-3 lg:py-2 bg-gray-800 text-white border border-gray-600 hover:bg-gray-900 font-medium transition-all duration-200 uppercase tracking-wide text-sm btn-touch self-start sm:self-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm text-gray-600 uppercase tracking-wide font-medium">Total Events</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900 tabular-nums">{logs.length}</p>
                </div>
                <div className="p-2 bg-gray-100 border border-gray-200 flex-shrink-0">
                  <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm text-gray-600 uppercase tracking-wide font-medium">Alert Events</p>
                  <p className="text-xl lg:text-2xl font-bold text-red-700 tabular-nums">
                    {logs.filter(log => log.type === 'alert').length}
                  </p>
                </div>
                <div className="p-2 bg-red-50 border border-red-200 flex-shrink-0">
                  <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm text-gray-600 uppercase tracking-wide font-medium">Feed Events</p>
                  <p className="text-xl lg:text-2xl font-bold text-green-700 tabular-nums">
                    {logs.filter(log => log.type === 'feeding').length}
                  </p>
                </div>
                <div className="p-2 bg-green-50 border border-green-200 flex-shrink-0">
                  <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm text-gray-600 uppercase tracking-wide font-medium">System Events</p>
                  <p className="text-xl lg:text-2xl font-bold text-blue-700 tabular-nums">
                    {logs.filter(log => log.type === 'system').length}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 border border-blue-200 flex-shrink-0">
                  <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white border border-gray-300 shadow-sm">
          <LogsTable logs={logs} />
        </div>
      </main>
    </div>
  )
}