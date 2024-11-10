"use client"

import { useEffect, useState } from "react"
import { QueueService } from "@/lib/services/queue.service"

interface QueueItem {
  id: string;
  phone_number: string;
  queue_number: string;
  status: string;
  joined_at: string;
}

export function QueueTracking({ queue }: { queue: QueueItem[] }) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Queue Tracking</h2>
      <div className="space-y-4">
        {queue.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg">
            <p>Queue Number: {item.queue_number}</p>
            <p>Phone: {item.phone_number}</p>
            <p>Status: {item.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
