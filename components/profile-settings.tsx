"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { SettingsService } from "@/lib/services/settings.service"

export function ProfileSettings() {
  const { user } = useAuth()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const settingsService = new SettingsService()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      // Create preview URL
      const preview = URL.createObjectURL(file)
      setPreviewUrl(preview)
    }
  }

  const handleSaveLogo = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a logo first",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const logoUrl = await settingsService.uploadLogo(selectedFile)
      toast({
        title: "Success",
        description: "Logo saved successfully"
      })
      // Reset file input and preview
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setSelectedFile(null)
      setPreviewUrl(null)
    } catch (error) {
      console.error('Error saving logo:', error)
      toast({
        title: "Error",
        description: "Failed to save logo",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Company Logo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              {/* Logo Preview */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Logo Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    No Logo
                  </div>
                )}
              </div>

              {/* File Input and Save Button */}
              <div className="flex flex-col items-center space-y-4 w-full max-w-xs">
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="w-full"
                />
                
                {selectedFile && (
                  <Button 
                    onClick={handleSaveLogo}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Saving..." : "Save Logo"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password Change Card */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="text-sm font-medium">
                  Current Password
                </label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 