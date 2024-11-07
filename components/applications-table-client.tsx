"use client"

import { useState } from "react"
import ApplicationsTable from "./applications-table"

export default function ApplicationsTableClient() {
  const [activeTab, setActiveTab] = useState("applications")

  if (activeTab !== "applications") return null

  return (
    <section id="applications">
      <ApplicationsTable />
    </section>
  )
}
