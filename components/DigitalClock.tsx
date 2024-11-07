"use client"

import { useState, useEffect } from 'react'

interface DigitalClockProps {
  format: '12' | '24';
}

export function DigitalClock({ format }: DigitalClockProps) {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      let timeString: string
      
      if (format === '12') {
        timeString = now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit', 
          hour12: true 
        })
      } else {
        const hours = now.getHours()
        const minutes = now.getMinutes()
        const seconds = now.getSeconds()
        const ampm = hours >= 12 ? 'PM' : 'AM'
        const formattedHours = hours < 10 ? `0${hours}` : hours
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds
        timeString = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`
      }
      
      setTime(timeString)
    }

    updateTime() // Set initial time
    const timer = setInterval(updateTime, 1000)

    return () => clearInterval(timer)
  }, [format])

  if (time === null) {
    return null
  }

  return (
    <div className="text-lg font-semibold text-blue-600">
      {time}
    </div>
  )
}
