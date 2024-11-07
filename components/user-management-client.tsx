"use client"

import { useState, useEffect } from 'react'
import UserManagement from './user-management'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { UserPlus } from 'lucide-react'
import { UserService } from '@/lib/services/user.service'
import { AddUserForm } from './add-user-form'
import { useAuth } from '@/lib/contexts/auth-context'

interface UserManagementClientProps {
  onAddUser: () => void;
  currentUserId: string;
}

export default function UserManagementClient({ onAddUser, currentUserId }: UserManagementClientProps) {
  const [users, setUsers] = useState<any[]>([])
  const [userService] = useState(() => new UserService())
  const [showAddForm, setShowAddForm] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadUsers()
    }
  }, [user])

  const loadUsers = async () => {
    try {
      console.log('Loading users...')
      const users = await userService.searchUsers('')
      console.log('Users loaded:', users)
      setUsers(users)
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const handleAddUserSubmit = async (userData: any) => {
    try {
      console.log('Creating user with data:', userData)
      await userService.createUser({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        documentType: userData.documentType,
        documentNumber: userData.documentNumber,
        role: userData.role || 'user',
        profilePhoto: userData.profilePhoto
      })
      console.log('User created successfully')
      await loadUsers() // Reload users after adding
      setShowAddForm(false)
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error creating user: ' + (error as Error).message)
    }
  }

  const handleUpdateUser = async (user: any) => {
    try {
      await userService.updateUser(user.id, user)
      await loadUsers() // Reload users after update
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error updating user: ' + (error as Error).message)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await userService.deleteUser(userId)
      await loadUsers() // Reload users after deletion
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user: ' + (error as Error).message)
    }
  }

  if (!user) {
    return <div>Please log in to manage users</div>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">User Management</CardTitle>
        <Button onClick={() => setShowAddForm(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </CardHeader>
      <CardContent>
        {showAddForm ? (
          <AddUserForm
            onSubmit={handleAddUserSubmit}
            onCancel={() => setShowAddForm(false)}
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
        ) : (
          <UserManagement 
            users={users}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            currentUserId={currentUserId}
          />
        )}
      </CardContent>
    </Card>
  )
}
