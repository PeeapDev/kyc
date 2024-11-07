"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isResetMode, setIsResetMode] = useState(false)
  const { signIn, resetPassword } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isResetMode) {
        await resetPassword(email)
        toast({
          title: "Password Reset Email Sent",
          description: "Check your email for password reset instructions.",
        })
        setIsResetMode(false)
      } else {
        await signIn(email, password)
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Login/Reset error:', error)
      setError(isResetMode ? 'Error sending reset email' : 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {isResetMode ? "Reset Password" : "Login to KYC Dashboard"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {!isResetMode && (
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!isResetMode}
                />
              </div>
            )}
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading 
                ? (isResetMode ? "Sending Reset Link..." : "Logging in...") 
                : (isResetMode ? "Send Reset Link" : "Login")
              }
            </Button>
            <div className="text-center">
              <Button
                variant="link"
                type="button"
                onClick={() => {
                  setIsResetMode(!isResetMode)
                  setError(null)
                }}
                className="text-sm"
              >
                {isResetMode 
                  ? "Back to Login" 
                  : "Forgot Password?"
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 