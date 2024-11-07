import { ProtectedRoute } from "@/components/protected-route"
import { ProfileSettings } from "@/components/profile-settings"

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileSettings />
    </ProtectedRoute>
  )
} 