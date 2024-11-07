"use client"

import { useState } from "react"
import DashboardCharts from "./dashboard-charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import UserManagementClient from './user-management-client'
import { AddUserForm } from './add-user-form'

const kycApplications = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "Pending", progress: 30 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Approved", progress: 100 },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Rejected", progress: 80 },
  { id: 4, name: "Alice Brown", email: "alice@example.com", status: "In Review", progress: 60 },
  { id: 5, name: "Charlie Davis", email: "charlie@example.com", status: "Pending", progress: 10 },
]

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState("dashboard")

  if (activeTab !== "dashboard") return null

  return (
    <section id="dashboard">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <DashboardCharts />
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent KYC Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kycApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.name}</TableCell>
                    <TableCell>{application.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          application.status === "Approved"
                            ? "success"
                            : application.status === "Rejected"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {application.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Progress value={application.progress} className="w-[60%]" />
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
