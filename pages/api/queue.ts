import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // This is a mock implementation. Replace with actual data fetching logic.
  const mockQueue = [
    { id: 1, name: "John Doe", phoneNumber: "123-456-7890" },
    { id: 2, name: "Jane Smith", phoneNumber: "098-765-4321" },
    // ... add more mock data as needed
  ];

  res.status(200).json({ queue: mockQueue, currentPosition: 1 })
}
