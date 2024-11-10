"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserService } from "@/lib/services/user.service"
import { QueueService } from "@/lib/services/queue.service"
import { AddUserForm } from "./add-user-form"

export function QueueSystem() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [queueNumber, setQueueNumber] = useState<string | null>(null)
  const userService = new UserService()
  const queueService = new QueueService()

  const handleCreateUser = async (userData: any) => {
    try {
      console.log('Creating user with data:', userData)
      // Create user
      const userId = await userService.createUser({
        ...userData,
        phoneNumber: phoneNumber
      })

      // Add to queue
      const lastNumber = await queueService.getLastQueueNumber()
      const newNumber = (lastNumber + 1).toString().padStart(3, '0')
      await queueService.addToQueue(phoneNumber, newNumber)
      
      setQueueNumber(newNumber)
      setShowAddUserForm(false)
      alert('User created and added to queue successfully!')
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error creating user: ' + (error as Error).message)
    }
  }

  return (
    <div className="p-4">
      <Input
        type="tel"
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <Button 
        onClick={() => setShowAddUserForm(true)}
        className="mt-4"
      >
        Create New User
      </Button>

      {showAddUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <AddUserForm
              onSubmit={handleCreateUser}
              onCancel={() => setShowAddUserForm(false)}
              formFields={[
                { id: 'firstName', type: 'text', label: 'First Name', required: true },
                { id: 'lastName', type: 'text', label: 'Last Name', required: true },
                { id: 'email', type: 'email', label: 'Email', required: true },
                { id: 'documentType', type: 'select', label: 'Document Type', required: true, 
                  options: ['Passport', 'Driver\'s License', 'National ID'] },
                { id: 'documentNumber', type: 'text', label: 'Document Number', required: true }
              ]}
              regions={[]}
            />
          </div>
        </div>
      )}

      {queueNumber && (
        <div className="mt-4 p-4 bg-green-100 rounded-lg text-center">
          <p className="text-xl">Queue Number:</p>
          <p className="text-3xl font-bold">{queueNumber}</p>
        </div>
      )}
    </div>
  )
} 