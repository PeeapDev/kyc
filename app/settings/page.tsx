'use client'
import { useEffect, useState } from 'react'
import { SettingsPage } from '@/components/settings-page'
import { SettingsService, DashboardSettings } from '@/lib/services/settings.service'
import { useAuth } from '@/lib/contexts/auth-context'

export default function Settings() {
  const [settings, setSettings] = useState<DashboardSettings | null>(null)
  const { user, loading } = useAuth()
  const [settingsService, setSettingsService] = useState<SettingsService | null>(null)

  useEffect(() => {
    if (user?.id) {
      const service = new SettingsService(user.id)
      setSettingsService(service)
      
      // Load initial settings
      service.getSettings().then(setSettings)

      // Subscribe to settings changes
      const unsubscribe = service.subscribeToSettings(setSettings)
      return () => unsubscribe()
    }
  }, [user])

  if (loading || !user) return <div>Loading...</div>
  if (!settings || !settingsService) return <div>Loading settings...</div>

  const handleSettingsChange = async (
    logo: string,
    title: string,
    timeFormat: string,
    googleMapsApiKey: string
  ) => {
    try {
      await settingsService.updateSettings({
        ...settings,
        logoUrl: logo,
        title,
        timeFormat: timeFormat as '12' | '24',
        preferences: {
          ...settings.preferences,
          googleMapsApiKey
        }
      })
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  }

  return (
    <SettingsPage
      onSettingsChange={handleSettingsChange}
      defaultLogo="/default-logo.png"
      currentLogo={settings.logoUrl}
      currentTitle={settings.title}
      currentTimeFormat={settings.timeFormat}
      currentGoogleMapsApiKey={settings.preferences.googleMapsApiKey || ''}
    />
  )
} 