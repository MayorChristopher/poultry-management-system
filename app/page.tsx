'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentUser, signOut } from '@/lib/auth'
import { Bird, Shield, Egg, Settings, BarChart3, CheckCircle, ArrowRight, LogOut, User, ChevronLeft, ChevronRight } from 'lucide-react'

export default function LandingPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Poultry farm images for slideshow
  const farmImages = [
    {
      url: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2126&q=80",
      alt: "Professional poultry farm monitoring system"
    },
    {
      url: "https://images.unsplash.com/photo-1569466593977-94ee7ed02ec9?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Flock of chickens in farm environment"
    },
    {
      url: "https://images.unsplash.com/photo-1580918577344-fe0a66733a2a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Modern poultry farming operations"
    },
    {
      url: "https://images.unsplash.com/photo-1589923188651-268a9765e432?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBvdWx0cnl8ZW58MHx8MHx8fDA%3D",
      alt: "Chicken poultry farm management"
    }
  ]

  useEffect(() => {
    checkAuthStatus()
  }, [])

  useEffect(() => {
    // Auto-advance slideshow every 5 seconds
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % farmImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [farmImages.length])

  const checkAuthStatus = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error checking auth status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % farmImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + farmImages.length) % farmImages.length)
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
              <h1 className="text-xl font-semibold text-gray-900 uppercase tracking-wide">Poultry Management System</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-1">
                <a href="#system" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-all duration-200 uppercase tracking-wide font-medium">System</a>
                <a href="#features" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-all duration-200 uppercase tracking-wide font-medium">Features</a>
              </nav>
              
              <div className="flex items-center space-x-4 pl-6 border-l border-gray-300">
                {user ? (
                  // Logged in user
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-1 bg-gray-100 border border-gray-300">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{user.email}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">System Access</p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="px-4 py-2 bg-gray-800 text-white border border-gray-600 hover:bg-gray-900 font-medium transition-all duration-200 uppercase tracking-wide text-sm"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-all duration-200"
                      title="Sign Out"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  // Not logged in
                  <div className="flex space-x-3">
                    <Link
                      href="/login"
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium border border-transparent hover:border-gray-300 hover:bg-gray-100 transition-all duration-200 uppercase tracking-wide"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2 bg-gray-800 text-white border border-gray-600 hover:bg-gray-900 font-medium transition-all duration-200 uppercase tracking-wide text-sm"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* System Overview */}
        <section id="system" className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium uppercase tracking-wide border border-gray-300">
                  Professional Farm Management
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 uppercase tracking-wide leading-tight">
                  Poultry Management System
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Comprehensive monitoring, automated controls, and detailed logging for professional poultry operations. 
                  Maximize productivity while ensuring optimal animal welfare through systematic management.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="px-8 py-4 bg-gray-800 text-white border border-gray-600 hover:bg-gray-900 font-medium transition-all duration-200 uppercase tracking-wide text-sm flex items-center justify-center"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Access Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className="px-8 py-4 bg-gray-800 text-white border border-gray-600 hover:bg-gray-900 font-medium transition-all duration-200 uppercase tracking-wide text-sm flex items-center justify-center"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View System
                    </Link>
                    <Link
                      href="/register"
                      className="px-8 py-4 bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 font-medium transition-all duration-200 uppercase tracking-wide text-sm flex items-center justify-center"
                    >
                      Get Access
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </>
                )}
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-300">
                <div className="text-center">
                  <CheckCircle className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                  <span className="text-sm text-gray-600 uppercase tracking-wide font-medium">Real-time Data</span>
                </div>
                <div className="text-center">
                  <CheckCircle className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                  <span className="text-sm text-gray-600 uppercase tracking-wide font-medium">Automated Controls</span>
                </div>
                <div className="text-center">
                  <CheckCircle className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                  <span className="text-sm text-gray-600 uppercase tracking-wide font-medium">24/7 Monitoring</span>
                </div>
              </div>
            </div>

            {/* Slideshow Section */}
            <div className="relative">
              <div className="bg-white border border-gray-300 shadow-sm overflow-hidden">
                <div className="relative h-96">
                  {farmImages.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={image.alt}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white hover:bg-black/70 transition-colors duration-200"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white hover:bg-black/70 transition-colors duration-200"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Slide Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {farmImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 border border-white transition-colors duration-200 ${
                          index === currentSlide ? 'bg-white' : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-gray-300 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 uppercase tracking-wide font-medium">System Status</p>
                      <p className="text-xl font-bold text-gray-900">Production Environment</p>
                    </div>
                    <div className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 text-xs font-medium uppercase tracking-wide">
                      Operational
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mb-16">
          <div className="mb-12">
            <div className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium uppercase tracking-wide border border-gray-300 mb-4">
              System Capabilities
            </div>
            <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wide mb-4">
              Management Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              Comprehensive tools for professional poultry farm operations with integrated monitoring and control systems.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-gray-100 border border-gray-200 mr-4">
                    <Egg className="h-5 w-5 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">Environmental Monitoring</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Continuous tracking of temperature, humidity, air quality, and environmental conditions with precise sensor data and automated alerts.
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-gray-100 border border-gray-200 mr-4">
                    <Settings className="h-5 w-5 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">System Controls</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Remote operation of feeding systems, water management, and climate controls with scheduled automation and manual override capabilities.
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-gray-100 border border-gray-200 mr-4">
                    <Shield className="h-5 w-5 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">Data Management</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive logging of system activities, environmental data, and operational metrics with detailed reporting and analysis tools.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gray-800 border border-gray-700">
                  <Bird className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold uppercase tracking-wide">Poultry Management System</h3>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Professional farm management system with comprehensive monitoring, automated controls, and detailed reporting capabilities for modern poultry operations.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 uppercase tracking-wide">System Access</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="/dashboard" className="hover:text-white transition-colors uppercase tracking-wide text-sm font-medium">Dashboard</a></li>
                <li><a href="/controls" className="hover:text-white transition-colors uppercase tracking-wide text-sm font-medium">Controls</a></li>
                <li><a href="/logs" className="hover:text-white transition-colors uppercase tracking-wide text-sm font-medium">System Logs</a></li>
                <li><a href="/login" className="hover:text-white transition-colors uppercase tracking-wide text-sm font-medium">User Access</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm uppercase tracking-wide">&copy; 2025 Poultry Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}