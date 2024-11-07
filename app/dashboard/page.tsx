import { ProtectedRoute } from "@/components/protected-route"
import { KycDashboard } from "@/components/kyc-dashboard"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <KycDashboard />
    </ProtectedRoute>
  )
} 