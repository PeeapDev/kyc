"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportsClient() {
  const [activeTab, setActiveTab] = useState("reports")

  if (activeTab !== "reports") return null

  return (
    <section id="reports">
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Reports functionality to be implemented.</p>
        </CardContent>
      </Card>
    </section>
  )
}
