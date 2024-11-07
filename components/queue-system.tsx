"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserService } from "@/lib/services/user.service"
import { AddUserForm } from "@/components/add-user-form"
import { QueueService } from "@/lib/services/queue.service"

export function QueueSystem() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [showAddToQueue, setShowAddToQueue] = useState(false)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [queueNumber, setQueueNumber] = useState<number | null>(null)
  const userService = new UserService()
  const queueService = new QueueService()

  useEffect(() => {
    const initializeQueue = async () => {
      const lastQueueNumber = await queueService.getLastQueueNumber()
      setQueueNumber(lastQueueNumber)
    }

    initializeQueue()

    // Reset queue number at 00:01 every day
    const resetQueue = () => {
      const now = new Date()
      const resetTime = new Date()
      resetTime.setHours(0, 1, 0, 0)
      const timeUntilReset = resetTime.getTime() - now.getTime()
      if (timeUntilReset < 0) {
        resetTime.setDate(resetTime.getDate() + 1)
      }
      setTimeout(async () => {
        await queueService.resetQueue()
        setQueueNumber(0)
        resetQueue()
      }, timeUntilReset)
    }
    resetQueue()
  }, [])

  const handleCreateQueue = async () => {
    try {
      const user = await userService.searchUsers(phoneNumber)
      if (user.length > 0) {
        // User exists, show "Add to Queue" popup
        setShowAddToQueue(true)
      } else {
        // User does not exist, show "Create New User" form
        setShowCreateUser(true)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    }
  }

  const handleAddToQueue = async (userId: string) => {
    try {
      const formattedQueueNumber = (queueNumber! + 1).toString().padStart(3, '0')
      await queueService.addToQueue(userId, formattedQueueNumber)
      console.log('User added to queue with number:', formattedQueueNumber)
      setQueueNumber(queueNumber! + 1)
      setShowAddToQueue(false)
    } catch (error) {
      console.error('Error adding to queue:', error)
    }
  }

  const handleCreateUser = async (userData: any) => {
    try {
      const userId = await userService.createUser(userData)
      await handleAddToQueue(userId)
      setShowCreateUser(false)
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  return (
    <div>
      <Input
        type="tel"
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <Button onClick={handleCreateQueue}>Create New Queue</Button>

      {showAddToQueue && (
        <div>
          <p>User found. Add to queue?</p>
          <Button onClick={() => handleAddToQueue(phoneNumber)}>Add to Queue</Button>
        </div>
      )}

      {showCreateUser && (
        <AddUserForm
          onSubmit={handleCreateUser}
          onCancel={() => setShowCreateUser(false)}
          formFields={[
            { id: 'firstName', type: 'text', label: 'First Name', required: true },
            { id: 'lastName', type: 'text', label: 'Last Name', required: true },
            { id: 'email', type: 'email', label: 'Email', required: true },
            { id: 'phoneNumber', type: 'tel', label: 'Phone Number', required: true },
            { id: 'address', type: 'text', label: 'Address', required: true },
            { id: 'documentType', type: 'select', label: 'Document Type', required: true, 
              options: ['Passport', 'Driver\'s License', 'National ID'] },
            { id: 'documentNumber', type: 'text', label: 'Document Number', required: true },
            { id: 'role', type: 'select', label: 'Role', required: true, 
              options: ['user', 'staff', 'admin'] }
          ]}
          regions={[]}
        />
      )}
    </div>
  )
} 