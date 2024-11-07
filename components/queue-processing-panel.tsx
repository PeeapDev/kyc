import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface QueueItem {
  id: number;
  name: string;
  phoneNumber: string;
  // Add any other relevant fields
}

interface QueueProcessingPanelProps {
  queue: QueueItem[];
  onProcessNext: (item: QueueItem) => void;
}

export default function QueueProcessingPanel({ queue, onProcessNext }: QueueProcessingPanelProps) {
  const [currentItem, setCurrentItem] = useState<QueueItem | null>(null);

  useEffect(() => {
    if (queue.length > 0 && !currentItem) {
      setCurrentItem(queue[0]);
    }
  }, [queue, currentItem]);

  const handleNextClick = () => {
    if (currentItem) {
      onProcessNext(currentItem);
      setCurrentItem(queue[1] || null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Queue Processing Panel</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current User</CardTitle>
        </CardHeader>
        <CardContent>
          {currentItem ? (
            <div>
              <p><strong>Name:</strong> {currentItem.name}</p>
              <p><strong>Phone Number:</strong> {currentItem.phoneNumber}</p>
              <Button onClick={handleNextClick} className="mt-4">Process Next</Button>
            </div>
          ) : (
            <p>No users in queue</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.phoneNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
