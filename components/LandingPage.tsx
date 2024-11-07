import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings } from 'lucide-react'

export default function LandingPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Here you would typically send the email and password to your backend
      // For example:
      // await signupUser(email, password);
      console.log('Signup attempt with:', email, password);
      // After successful signup, you might want to redirect the user or show a success message
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <header className="w-full max-w-4xl mb-8">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold">QCell KYC</div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                  <span className="sr-only">Settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/settings/landing-page">Landing Page</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings/general">General Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings/security">Security</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/login" passHref>
              <Button variant="outline" className="ml-2 mr-2">Login</Button>
            </Link>
            <Link href="#signup" passHref>
              <Button>Sign Up</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="w-full max-w-4xl">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to QCell KYC</h1>
          <p className="text-xl">Streamline your KYC process with our advanced platform</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Easy Onboarding</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Quick and simple user registration process</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Secure Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Advanced security measures to protect user data</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Real-time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Stay informed with instant notifications</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="signup" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sign Up Now</h2>
          <Card>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block mb-1">Email</label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-1">Password</label>
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-label="Password"
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Signing up...' : 'Sign Up'}
                </Button>
                {error && <p className="text-red-500">{error}</p>}
              </form>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="w-full max-w-4xl text-center mt-8">
        <p>&copy; 2023 QCell KYC. All rights reserved.</p>
      </footer>
    </div>
  );
}
