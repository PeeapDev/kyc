"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const complianceChecks = [
  { id: 1, type: "AML", status: "Passed", date: "2023-05-01" },
  { id: 2, type: "KYC Verification", status: "In Progress", date: "2023-05-02" },
  { id: 3, type: "GDPR", status: "Passed", date: "2023-04-30" },
  { id: 4, type: "BSA", status: "Failed", date: "2023-04-29" },
  { id: 5, type: "FATF", status: "Passed", date: "2023-04-28" },
]

export default function ComplianceTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Compliance Checks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complianceChecks.map((check) => (
                <TableRow key={check.id}>
                  <TableCell className="font-medium">{check.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        check.status === "Passed"
                          ? "success"
                          : check.status === "Failed"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {check.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{check.date}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
