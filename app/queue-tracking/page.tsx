'use client'

import { useState, useEffect } from 'react'
import QueueTracking from '@/components/queue-tracking'

export default function QueueTrackingPage() {
  const [queue, setQueue] = useState([])
  const [currentPosition, setCurrentPosition] = useState(1)

  useEffect(() => {
    // Fetch queue data from your API
    const fetchQueueData = async () => {
      try {
        const response = await fetch('/api/queue')
        const data = await response.json()
        setQueue(data.queue)
        setCurrentPosition(data.currentPosition)
      } catch (error) {
        console.error('Error fetching queue data:', error)
      }
    }

    fetchQueueData()

    // Set up polling to refresh queue data every 30 seconds
    const intervalId = setInterval(fetchQueueData, 30000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Queue Tracking</h1>
      <QueueTracking queue={queue} currentPosition={currentPosition} />
    </div>
  )
}
