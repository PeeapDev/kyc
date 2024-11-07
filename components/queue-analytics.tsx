import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface QueueItem {
  id: number;
  name: string;
  phoneNumber: string;
  // Add any other relevant fields
}

interface CompletedQueueItem extends QueueItem {
  checkoutTime: Date;
}

interface QueueAnalyticsProps {
  queue: QueueItem[];
  completedQueue: CompletedQueueItem[];
}

export default function QueueAnalytics({ queue, completedQueue }: QueueAnalyticsProps) {
  // Calculate some basic analytics
  const totalInQueue = queue.length;
  const averageWaitTime = 5 * totalInQueue; // Assuming 5 minutes per person

  // Generate hourly data for the chart
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: Math.floor(Math.random() * 20), // Random data for demonstration
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total in Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalInQueue}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Wait Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{averageWaitTime} minutes</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Hourly Queue Traffic</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Completed Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Checkout Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedQueue.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.phoneNumber}</TableCell>
                  <TableCell>{item.checkoutTime.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
