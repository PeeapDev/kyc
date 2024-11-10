"use client"

import { useState, useRef, useEffect } from "react"
import { Suspense } from "react"
import { Bell, ChevronDown, FileText, Search, Shield, Users, BarChart, UserPlus, Settings, List, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DashboardClient from "./dashboard-client"
import ComplianceTableClient from "./compliance-table-client"
import UserManagementClient from "./user-management-client"
import ReportsClient from "./reports-client"
import AddStaff from "./add-staff"
import { SettingsPage } from "./settings-page"
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Draggable from 'react-draggable'
import { AddUserForm } from "./add-user-form"
import QueueList from "./queue-list"
import { motion, AnimatePresence } from 'framer-motion'
import { QueueTracking } from './queue-tracking'
import Link from 'next/link'
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import QueueAnalytics from "./queue-analytics"
import QueueProcessingPanel from './queue-processing-panel'
import QueueControl from './queue-control'
import { useAuth } from "@/lib/contexts/auth-context"
import { useRouter } from "next/navigation"

const DigitalClock = dynamic(() => import('./DigitalClock').then(mod => mod.DigitalClock), {
  ssr: false
})

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
}

const initialFormFields: FormField[] = [
  { id: 'firstName', type: 'text', label: 'First Name', required: true },
  { id: 'lastName', type: 'text', label: 'Last Name', required: true },
  { id: 'email', type: 'email', label: 'Email', required: true },
  { id: 'phoneNumber', type: 'tel', label: 'Phone Number', required: true },
  { id: 'address', type: 'address', label: 'Address', required: true },
  { id: 'documentType', type: 'select', label: 'Document Type', required: true, options: ['Passport', 'Driver\'s License', 'National ID'] },
  { id: 'documentNumber', type: 'text', label: 'Document Number', required: true },
];

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  documentType: string;
  documentNumber: string;
  role: 'admin' | 'staff' | 'user';
}

const initialDemoUsers: User[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phoneNumber: '+1234567890',
    address: '123 Main St, City, Country',
    documentType: 'Passport',
    documentNumber: 'AB123456',
    role: 'admin'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phoneNumber: '+1987654321',
    address: '456 Elm St, Town, Country',
    documentType: 'Driver\'s License',
    documentNumber: 'DL789012',
    role: 'staff'
  },
  {
    id: 3,
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice@example.com',
    phoneNumber: '+1122334455',
    address: '789 Oak St, Village, Country',
    documentType: 'National ID',
    documentNumber: 'ID345678',
    role: 'user'
  }
];

interface Region {
  id: string;
  name: string;
  count: number;
}

interface CompletedQueueItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  documentType: string;
  documentNumber: string;
  role: string;
  checkoutTime: Date;
  name: string;
}

interface QueueItem {
  id: number;
  name: string;
  phoneNumber: string;
  // Add any other relevant fields
}

export function KycDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [logo, setLogo] = useState("/default-logo.png")
  const [dashboardTitle, setDashboardTitle] = useState("KYC Dashboard")
  const [timeFormat, setTimeFormat] = useState<'12' | '24'>('12')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const chatRef = useRef(null)
  const [isQueuePopupOpen, setIsQueuePopupOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [queueNumber, setQueueNumber] = useState<number | null>(null)
  const [showNewUserForm, setShowNewUserForm] = useState(false)
  const [users, setUsers] = useState<User[]>(initialDemoUsers);
  const [lastQueueNumber, setLastQueueNumber] = useState(0)
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [userName, setUserName] = useState("Admin") // You can replace "Admin" with the actual user's name
  const [formFields, setFormFields] = useState(initialFormFields);
  const [searchQuery, setSearchQuery] = useState("")
  const [matchingUsers, setMatchingUsers] = useState<User[]>([]);
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [queue, setQueue] = useState<{ id: number; phoneNumber: string; name: string }[]>([]);
  const [queueAdded, setQueueAdded] = useState(false);
  const queueCircleRef = useRef<HTMLDivElement>(null);
  const [showQueueTracking, setShowQueueTracking] = useState(false);
  const [currentQueuePosition, setCurrentQueuePosition] = useState(1);
  const { theme, setTheme } = useTheme()
  const [regions, setRegions] = useState<Region[]>([
    { id: '1', name: 'North America', count: 0 },
    { id: '2', name: 'Europe', count: 0 },
    { id: '3', name: 'Asia', count: 0 },
    { id: '4', name: 'Africa', count: 0 },
    { id: '5', name: 'South America', count: 0 },
  ]);
  const [activeQueueSubMenu, setActiveQueueSubMenu] = useState<"list" | "analytics" | "processing" | "control">("list");
  const [completedQueue, setCompletedQueue] = useState<CompletedQueueItem[]>([]);
  const [isStaff, setIsStaff] = useState(false); // This should be set based on user authentication
  const { user, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      // Set user name from auth context
      setUserName(user.email?.split('@')[0] || 'Admin')
    }
  }, [user])

  // Add this function to get the appropriate greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  useEffect(() => {
    // Fetch users from your API or database
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      // This should be replaced with your actual API call
      const response = await fetch('/api/users')
      const text = await response.text()
      let data
      try {
        data = JSON.parse(text)
      } catch (error) {
        console.error('Error parsing JSON:', error)
        console.log('Received text:', text)
        data = []
      }
      if (Array.isArray(data)) {
        setUsers(data)
      } else {
        console.error('Received data is not an array:', data)
        setUsers([])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    }
  }

  const handleSettingsChange = (newLogo: string, newTitle: string, newTimeFormat: string) => {
    setLogo(newLogo)
    setDashboardTitle(newTitle)
    setTimeFormat(newTimeFormat as '12' | '24')
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phoneNumber.includes(searchQuery)
  )

  const addToQueue = (userId: number, userPhoneNumber: string, userName: string) => {
    setQueue(prevQueue => {
      const newQueue = [...prevQueue, { id: userId, phoneNumber: userPhoneNumber, name: userName }];
      return newQueue.sort((a, b) => a.id - b.id);
    });
    const newQueueNumber = lastQueueNumber + 1;
    setQueueNumber(newQueueNumber);
    setLastQueueNumber(newQueueNumber);
  }

  const handleQueueSubmit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from propagating to the parent div
    const user = users.find(u => u.phoneNumber === phoneNumber);
    if (user) {
      // User exists, add to queue
      addToQueue(user.id, user.phoneNumber, `${user.firstName} ${user.lastName}`);
    } else {
      // User doesn't exist, show add user popup
      setShowAddUserPopup(true);
    }
  }

  const handleNewUserSubmit = (userData: any) => {
    // Generate a new ID for the user
    const newUserId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = { ...userData, id: newUserId };
    
    // Add the new user to the users array
    setUsers(prevUsers => [...prevUsers, newUser]);
    
    // Add the new user to the queue
    addToQueue(newUserId, userData.phoneNumber, `${userData.firstName} ${userData.lastName}`);
    
    // Close the add user popup
    setShowAddUserPopup(false);
    
    // Close the queue popup
    setIsQueuePopupOpen(false);
  }

  const handleAddUser = (userData: any) => {
    // Update the count for the selected region
    const updatedRegions = regions.map(region => 
      region.id === userData.region ? { ...region, count: region.count + 1 } : region
    );
    setRegions(updatedRegions);

    // Add the user to the users array
    const newUser = { ...userData, id: users.length + 1 };
    setUsers([...users, newUser]);
  }

  // CRUD operations for users
  const addUser = (newUser: Omit<User, 'id'>) => {
    const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    setUsers([...users, { ...newUser, id }]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
  };

  const deleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);

    // Filter users based on the input
    const matches = users.filter(user => 
      user.phoneNumber.includes(value) || 
      user.firstName.toLowerCase().includes(value.toLowerCase()) ||
      user.lastName.toLowerCase().includes(value.toLowerCase())
    );
    setMatchingUsers(matches);
  };

  const selectUser = (user: User) => {
    setPhoneNumber(user.phoneNumber);
    setMatchingUsers([]);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (queueCircleRef.current && !queueCircleRef.current.contains(event.target as Node)) {
      setIsQueuePopupOpen(false);
    }
  };

  useEffect(() => {
    if (isQueuePopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isQueuePopupOpen]);

  const handleAddToQueue = () => {
    setIsQueuePopupOpen(true);
    setPhoneNumber("");
    setQueueNumber(null);
    setMatchingUsers([]);
  };

  // Add this function to handle queue tracking link click
  const handleQueueTrackingClick = () => {
    setShowQueueTracking(true);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleCheckout = (userId: number) => {
    const user = queue.find(item => item.id === userId);
    if (user) {
      const completedItem: CompletedQueueItem = {
        ...user,
        checkoutTime: new Date()
      };
      setCompletedQueue(prev => [...prev, completedItem]);
      setQueue(prev => prev.filter(item => item.id !== userId));
    }
  };

  const handleProcessNext = (item: QueueItem) => {
    // Remove the processed item from the queue
    setQueue(prevQueue => prevQueue.filter(queueItem => queueItem.id !== item.id));
    // Add the item to the completed queue
    setCompletedQueue(prevCompleted => [...prevCompleted, { ...item, checkoutTime: new Date() }]);
  };

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/login') // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Draggable axis="x" bounds="parent" handle=".sidebar-handle">
        <aside className="w-64 bg-white shadow-md">
          <div className="sidebar-handle p-4 cursor-move">
            <div className="mb-4">
              <Image src={logo} alt="Company Logo" width={150} height={50} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{dashboardTitle}</h1>
          </div>
          <nav className="mt-4">
            <a
              href="#"
              className={`flex items-center px-4 py-2 text-gray-700 ${
                activeTab === "dashboard" ? "bg-gray-200" : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart className="mr-2 h-5 w-5" />
              Dashboard
            </a>
            <div>
              <a
                href="#"
                className={`flex items-center px-4 py-2 text-gray-700 ${
                  activeTab === "queue" ? "bg-gray-200" : ""
                }`}
                onClick={() => {
                  setActiveTab("queue");
                  setActiveQueueSubMenu("list");
                }}
              >
                <List className="mr-2 h-5 w-5" />
                Queue
              </a>
              {activeTab === "queue" && (
                <div className="ml-6 space-y-1">
                  <a
                    href="#"
                    className={`block px-4 py-1 text-sm ${
                      activeQueueSubMenu === "list" ? "text-blue-600" : "text-gray-600"
                    }`}
                    onClick={() => setActiveQueueSubMenu("list")}
                  >
                    Queue List
                  </a>
                  <a
                    href="#"
                    className={`block px-4 py-1 text-sm ${
                      activeQueueSubMenu === "analytics" ? "text-blue-600" : "text-gray-600"
                    }`}
                    onClick={() => setActiveQueueSubMenu("analytics")}
                  >
                    Queue Analytics
                  </a>
                  {isStaff && (
                    <>
                      <a
                        href="#"
                        className={`block px-4 py-1 text-sm ${
                          activeQueueSubMenu === "processing" ? "text-blue-600" : "text-gray-600"
                        }`}
                        onClick={() => setActiveQueueSubMenu("processing")}
                      >
                        Queue Processing
                      </a>
                      <a
                        href="#"
                        className={`block px-4 py-1 text-sm ${
                          activeQueueSubMenu === "control" ? "text-blue-600" : "text-gray-600"
                        }`}
                        onClick={() => setActiveQueueSubMenu("control")}
                      >
                        Queue Control
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>
            <a
              href="#"
              className={`flex items-center px-4 py-2 text-gray-700 ${
                activeTab === "compliance" ? "bg-gray-200" : ""
              }`}
              onClick={() => setActiveTab("compliance")}
            >
              <Shield className="mr-2 h-5 w-5" />
              Compliance
            </a>
            <a
              href="#"
              className={`flex items-center px-4 py-2 text-gray-700 ${
                activeTab === "users" ? "bg-gray-200" : ""
              }`}
              onClick={() => setActiveTab("users")}
            >
              <Users className="mr-2 h-5 w-5" />
              User Management
            </a>
            <a
              href="#"
              className={`flex items-center px-4 py-2 text-gray-700 ${
                activeTab === "add-staff" ? "bg-gray-200" : ""
              }`}
              onClick={() => setActiveTab("add-staff")}
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Add Staff
            </a>
            <a
              href="#"
              className={`flex items-center px-4 py-2 text-gray-700 ${
                activeTab === "reports" ? "bg-gray-200" : ""
              }`}
              onClick={() => setActiveTab("reports")}
            >
              <FileText className="mr-2 h-5 w-5" />
              Reports
            </a>
          </nav>
        </aside>
      </Draggable>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
          <div className="flex items-center">
            {activeTab === "settings" && (
              <Button variant="ghost" onClick={() => setActiveTab("dashboard")}>
                Back to Dashboard
              </Button>
            )}
            {activeTab !== "settings" && (
              <>
                <Input
                  type="search"
                  placeholder="Search by name or phone..."
                  className="w-64"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <Button variant="ghost" size="icon" className="ml-2">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <DigitalClock format={timeFormat} />
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(!isChatOpen)}>
              <Bell className="h-5 w-5" />
              <span className="sr-only">Chat</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage 
                      src={user.user_metadata?.avatar_url} 
                      alt={userName} 
                    />
                    <AvatarFallback>
                      {user.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {userName}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {showQueueTracking ? (
            <QueueTracking queue={queue} currentPosition={currentQueuePosition} />
          ) : (
            <>
              {activeTab === "dashboard" && (
                <Suspense fallback={<div>Loading dashboard...</div>}>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-lg">{getGreeting()}, {userName}</p>
                  </div>
                  <DashboardClient />
                </Suspense>
              )}
              {activeTab === "queue" && (
                <Suspense fallback={<div>Loading queue...</div>}>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Queue Management</h2>
                      <div className="space-x-4">
                        <Button onClick={handleAddToQueue}>Add to Queue</Button>
                        <Link href="/queue-tracking" passHref>
                          <Button className="link-button">Queue Tracking</Button>
                        </Link>
                      </div>
                    </div>
                    <div className="flex space-x-4 mb-4">
                      <Button 
                        variant={activeQueueSubMenu === "list" ? "default" : "outline"}
                        onClick={() => setActiveQueueSubMenu("list")}
                      >
                        Queue List
                      </Button>
                      <Button 
                        variant={activeQueueSubMenu === "analytics" ? "default" : "outline"}
                        onClick={() => setActiveQueueSubMenu("analytics")}
                      >
                        Queue Analytics
                      </Button>
                      {isStaff && (
                        <Button 
                          variant={activeQueueSubMenu === "control" ? "default" : "outline"}
                          onClick={() => setActiveQueueSubMenu("control")}
                        >
                          Queue Control
                        </Button>
                      )}
                    </div>
                    {activeQueueSubMenu === "list" && <QueueList queue={queue} onCheckout={handleCheckout} />}
                    {activeQueueSubMenu === "analytics" && <QueueAnalytics queue={queue} completedQueue={completedQueue} />}
                    {activeQueueSubMenu === "control" && isStaff && (
                      <QueueControl 
                        initialQueue={queue.map(item => ({ ...item, status: 'waiting', joinedAt: new Date() }))} 
                        onProcessNext={handleProcessNext} 
                      />
                    )}
                  </div>
                </Suspense>
              )}
              {activeTab === "compliance" && (
                <Suspense fallback={<div>Loading compliance checks...</div>}>
                  <ComplianceTableClient />
                </Suspense>
              )}
              {activeTab === "users" && (
                <Suspense fallback={<div>Loading user management...</div>}>
                  {showAddUserForm ? (
                    <AddUserForm 
                      onSubmit={handleAddUser}
                      onCancel={() => setShowAddUserForm(false)}
                      formFields={[...formFields, { id: 'region', type: 'region', label: 'Region', required: true }]}
                      regions={[]}
                    />
                  ) : (
                    <UserManagementClient 
                      users={filteredUsers}
                      onAddUser={() => setShowAddUserForm(true)}
                      onUpdateUser={updateUser}
                      onDeleteUser={deleteUser}
                    />
                  )}
                </Suspense>
              )}
              {activeTab === "add-staff" && (
                <Suspense fallback={<div>Loading add staff form...</div>}>
                  <AddStaff />
                </Suspense>
              )}
              {activeTab === "reports" && (
                <Suspense fallback={<div>Loading reports...</div>}>
                  <ReportsClient />
                </Suspense>
              )}
              {activeTab === "settings" && (
                <Suspense fallback={<div>Loading settings...</div>}>
                  <SettingsPage 
                    onSettingsChange={handleSettingsChange} 
                    defaultLogo="/default-logo.png"
                    currentLogo={logo}
                    currentTitle={dashboardTitle}
                    currentTimeFormat={timeFormat}
                    currentGoogleMapsApiKey=""
                  />
                </Suspense>
              )}
            </>
          )}
        </main>
      </div>

      {/* Chat Component */}
      {isChatOpen && (
        <Draggable bounds="parent" handle=".chat-handle">
          <div ref={chatRef} className="fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="chat-handle bg-blue-500 text-white p-2 cursor-move">
              Chat
            </div>
            <div className="p-4">
              {/* Chat content goes here */}
              <p>Chat messages will appear here.</p>
            </div>
          </div>
        </Draggable>
      )}

      {/* Queue Popup */}
      <AnimatePresence>
        {isQueuePopupOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <motion.div 
              ref={queueCircleRef}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-white rounded-full w-96 h-96 flex flex-col items-center justify-center relative"
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside the circle from closing it
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute inset-0 rounded-full border-4 border-blue-500"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  delay: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute inset-0 rounded-full border-4 border-blue-300"
              />
              <h2 className="text-2xl font-bold mb-6">Queue</h2>
              <div className="w-3/4 mb-6 relative">
                <Input
                  type="text"
                  placeholder="Enter phone number or name"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  className="text-center"
                />
                {matchingUsers.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-[1001]">
                    {matchingUsers.map((user) => (
                      <div
                        key={user.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectUser(user)}
                      >
                        {user.firstName} {user.lastName} - {user.phoneNumber}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {phoneNumber && (
                <Button 
                  onClick={handleQueueSubmit} 
                  className={`w-1/2 z-[1000] ${users.some(u => u.phoneNumber === phoneNumber) ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                  {users.some(u => u.phoneNumber === phoneNumber) ? 'Add to Queue' : 'Create New User'}
                </Button>
              )}
              {queueNumber && (
                <p className="mt-4 text-center">Your queue number is: {queueNumber}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add User Popup */}
      {showAddUserPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New User</h2>
            <AddUserForm
              onSubmit={handleNewUserSubmit}
              onCancel={() => setShowAddUserPopup(false)}
              formFields={formFields}
              regions={[]}
            />
          </div>
        </div>
      )}
    </div>
  )
}