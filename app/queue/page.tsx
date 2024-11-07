'use client'
import { useEffect, useState } from 'react'
import { QueueService, QueueItem } from '@/lib/services/queue.service'
import QueueControl from '@/components/queue-control'
import QueueList from '@/components/queue-list'
import QueueAnalytics from '@/components/queue-analytics'

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const queueService = new QueueService()

  useEffect(() => {
    const unsubscribe = queueService.subscribeToQueue(setQueue)
    return () => unsubscribe()
  }, [])

  const handleProcessNext = async (item: QueueItem) => {
    await queueService.updateStatus(item.id, 'completed')
  }

  return (
    <div>
      <QueueControl 
        initialQueue={queue} 
        onProcessNext={handleProcessNext} 
      />
      <QueueList queue={queue} />
      <QueueAnalytics 
        queue={queue} 
        completedQueue={queue.filter(item => item.status === 'completed')} 
      />
    </div>
  )
} 