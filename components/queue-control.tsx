import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface QueueItem {
  id: number;
  name: string;
  phoneNumber: string;
  status: 'waiting' | 'in-progress' | 'completed';
  joinedAt: Date;
}

interface QueueControlProps {
  initialQueue: QueueItem[];
  onProcessNext: (item: QueueItem) => void;
}

export default function QueueControl({ initialQueue, onProcessNext }: QueueControlProps) {
  const [queue, setQueue] = useState<QueueItem[]>(initialQueue);
  const [currentUser, setCurrentUser] = useState<QueueItem | null>(null);

  useEffect(() => {
    // Simulating real-time updates
    const interval = setInterval(() => {
      // In a real application, you would fetch the latest queue data from your backend here
      setQueue(prevQueue => {
        // This is just a simulation. Replace with actual data fetching logic.
        return prevQueue.map(item => ({
          ...item,
          status: Math.random() > 0.8 ? 'completed' : item.status
        }));
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNextCustomer = () => {
    if (queue.length > 0) {
      const nextCustomer = queue[0];
      setCurrentUser(nextCustomer);
      onProcessNext(nextCustomer);
      setQueue(prevQueue => prevQueue.slice(1).map(item => 
        item.id === nextCustomer.id ? { ...item, status: 'in-progress' } : item
      ));
    }
  };

  const handleCompleteCustomer = () => {
    if (currentUser) {
      setQueue(prevQueue => prevQueue.map(item => 
        item.id === currentUser.id ? { ...item, status: 'completed' } : item
      ));
      setCurrentUser(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Customer</CardTitle>
        </CardHeader>
        <CardContent>
          {currentUser ? (
            <div>
              <p><strong>Name:</strong> {currentUser.name}</p>
              <p><strong>Phone:</strong> {currentUser.phoneNumber}</p>
              <Button onClick={handleCompleteCustomer} className="mt-4">Complete</Button>
            </div>
          ) : (
            <p>No customer currently being served</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Queue Control</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleNextCustomer} disabled={queue.length === 0 || currentUser !== null}>
            Next Customer
          </Button>
          <p className="mt-2">Customers in queue: {queue.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Queue List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Waiting Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.map((customer, index) => (
                <TableRow key={customer.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phoneNumber}</TableCell>
                  <TableCell>{customer.status}</TableCell>
                  <TableCell>{Math.floor((new Date().getTime() - customer.joinedAt.getTime()) / 60000)} mins</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
