"use client"

import { useEffect, useState } from "react"
import { QueueService } from "@/lib/services/queue.service"

export function QueueTracking() {
  const [queue, setQueue] = useState<any[]>([])
  const queueService = new QueueService()

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const queueData = await queueService.getQueue()
        setQueue(queueData)
      } catch (error) {
        console.error('Error fetching queue:', error)
      }
    }

    fetchQueue()
  }, [])

  return (
    <div>
      <h2>Queue Tracking</h2>
      <ul>
        {queue.map(item => (
          <li key={item.id}>
            {item.name} - {item.queue_number}
          </li>
        ))}
      </ul>
    </div>
  )
}
