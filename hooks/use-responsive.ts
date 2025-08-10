'use client'

import { useState, useEffect } from 'react'

interface ResponsiveState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  width: number
  height: number
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: 1024,
    height: 768
  })

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setState({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        width,
        height
      })
    }

    // Set initial size
    updateSize()

    // Add event listener
    window.addEventListener('resize', updateSize)

    // Cleanup
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return state
}

// Breakpoint constants
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280
} as const

// Utility functions
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < BREAKPOINTS.mobile
}

export const isTabletDevice = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= BREAKPOINTS.mobile && window.innerWidth < BREAKPOINTS.tablet
}

export const isDesktopDevice = () => {
  if (typeof window === 'undefined') return true
  return window.innerWidth >= BREAKPOINTS.tablet
}