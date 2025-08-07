'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, getUserProfile, signOut } from '@/lib/auth'
import { generateInitialLogs, generateMockLog, MockLog } from '@/utils/mockLogs'
import LogsTable from '@/components/LogsTable'
import { Bird, LogOut, Settings, BarChart3, FileText, RefreshCw, User } from 'lucide-react'

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
      <header className="bg-white border-b border-gray-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gray-100 border border-gray-300">
                <Bird className="h-6 w-6 text-gray-700" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 uppercase tracking-wide">System Logs</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <nav className="flex space-x-1">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-all duration-200 uppercase tracking-wide font-medium"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                
                <div className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-900 bg-gray-100 border border-gray-300 uppercase tracking-wide font-medium">
                  <FileText className="h-4 w-4" />
                  <span>Logs</span>
                </div>
                
                {profile?.role === 'admin' && (
                  <Link
                    href="/controls"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-all duration-200 uppercase tracking-wide font-medium"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Controls</span>
                  </Link>
                )}
              </nav>
              
              <div className="flex items-center space-x-4 pl-6 border-l border-gray-300">
                <div className="flex items-center space-x-3">
                  <div className="p-1 bg-gray-100 border border-gray-300">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{profile?.role} Access</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-all duration-200"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Logs Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 uppercase tracking-wide mb-2">Activity Logs</h2>
            <p className="text-sm text-gray-600">
              Real-time system events and operational activities
            </p>
          </div>
          
          <button
            onClick={refreshLogs}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white border border-gray-600 hover:bg-gray-900 font-medium transition-all duration-200 uppercase tracking-wide text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 uppercase tracking-wide font-medium">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900 tabular-nums">{logs.length}</p>
                </div>
                <div className="p-2 bg-gray-100 border border-gray-200">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 uppercase tracking-wide font-medium">Alert Events</p>
                  <p className="text-2xl font-bold text-red-700 tabular-nums">
                    {logs.filter(log => log.type === 'alert').length}
                  </p>
                </div>
                <div className="p-2 bg-red-50 border border-red-200">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 uppercase tracking-wide font-medium">Feed Events</p>
                  <p className="text-2xl font-bold text-green-700 tabular-nums">
                    {logs.filter(log => log.type === 'feeding').length}
                  </p>
                </div>
                <div className="p-2 bg-green-50 border border-green-200">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 uppercase tracking-wide font-medium">System Events</p>
                  <p className="text-2xl font-bold text-blue-700 tabular-nums">
                    {logs.filter(log => log.type === 'system').length}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 border border-blue-200">
                  <FileText className="h-5 w-5 text-blue-600" />
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