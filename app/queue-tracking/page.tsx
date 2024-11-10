'use client'

import { QueueTracking } from "@/components/queue-tracking"
import { QueueService } from "@/lib/services/queue.service"
import { useState, useEffect } from "react"

export default function QueueTrackingPage() {
  const [queue, setQueue] = useState([])
  const queueService = new QueueService()

  useEffect(() => {
    const loadQueue = async () => {
      try {
        const queueData = await queueService.getQueue()
        setQueue(queueData)
      } catch (error) {
        console.error('Error loading queue:', error)
      }
    }

    loadQueue()
  }, [])

  return <QueueTracking queue={queue} />
}
