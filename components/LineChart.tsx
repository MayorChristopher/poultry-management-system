'use client'

import { useEffect, useRef } from 'react'

interface DataPoint {
  timestamp: Date
  value: number
}

interface LineChartProps {
  data: DataPoint[]
  title: string
  color: string
  unit: string
}

export default function LineChart({ data, title, color, unit }: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length === 0) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    
    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const padding = 40
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    // Find min/max values
    const values = data.map(d => d.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const valueRange = maxValue - minValue || 1
    
    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding)) / 5
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }
    
    // Vertical grid lines
    for (let i = 0; i <= 6; i++) {
      const x = padding + (i * (width - 2 * padding)) / 6
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
      ctx.stroke()
    }
    
    // Draw data line
    if (data.length > 1) {
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.beginPath()
      
      data.forEach((point, index) => {
        const x = padding + (index * (width - 2 * padding)) / (data.length - 1)
        const y = height - padding - ((point.value - minValue) / valueRange) * (height - 2 * padding)
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.stroke()
      
      // Draw data points
      ctx.fillStyle = color
      data.forEach((point, index) => {
        const x = padding + (index * (width - 2 * padding)) / (data.length - 1)
        const y = height - padding - ((point.value - minValue) / valueRange) * (height - 2 * padding)
        
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fill()
      })
    }
    
    // Draw labels
    ctx.fillStyle = '#6b7280'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    
    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (i * valueRange) / 5
      const y = height - padding - (i * (height - 2 * padding)) / 5
      ctx.textAlign = 'right'
      ctx.fillText(`${value.toFixed(1)}${unit}`, padding - 10, y + 4)
    }
    
  }, [data, color, unit])
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="relative h-64">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  )
}
