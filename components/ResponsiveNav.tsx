'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Bird, User, LogOut } from 'lucide-react'

interface ResponsiveNavProps {
  user?: any
  profile?: any
  onSignOut: () => void
  children?: React.ReactNode
}

export default function ResponsiveNav({ user, profile, onSignOut, children }: ResponsiveNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="bg-white border-b border-gray-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 lg:py-6">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="p-2 bg-gray-100 border border-gray-300">
              <Bird className="h-5 w-5 lg:h-6 lg:w-6 text-gray-700" />
            </div>
            <h1 className="text-lg lg:text-xl font-semibold text-gray-900 uppercase tracking-wide">
              Poultry Management
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {children}
            
            {user && (
              <div className="flex items-center space-x-4 pl-6 border-l border-gray-300">
                <div className="flex items-center space-x-3">
                  <div className="p-1 bg-gray-100 border border-gray-300">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      {profile?.role} Access
                    </p>
                  </div>
                </div>
                <button
                  onClick={onSignOut}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-all duration-200"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-all duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-300 py-4 space-y-4">
            <div className="space-y-2">
              {children}
            </div>
            
            {user && (
              <div className="pt-4 border-t border-gray-300 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-1 bg-gray-100 border border-gray-300">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-48">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      {profile?.role} Access
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onSignOut()
                    closeMenu()
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="uppercase tracking-wide font-medium">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}