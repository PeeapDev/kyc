"use client"

import { useState } from "react"
import ComplianceTable from "./compliance-table"

export default function ComplianceTableClient() {
  const [activeTab, setActiveTab] = useState("compliance")

  if (activeTab !== "compliance") return null

  return (
    <section id="compliance">
      <ComplianceTable />
    </section>
  )
}
