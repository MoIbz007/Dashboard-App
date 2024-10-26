import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import HomePage from './pages/HomePage'
import MyRecordings from './pages/MyRecordings'
import MyTranscripts from './pages/MyTranscripts'
import MyCalendar from './pages/MyCalendar'
import MyNotes from './pages/MyNotes'
import Record from './pages/Record'
import ChatbotPage from './pages/ChatbotPage'
import MyWorkspace from './pages/MyWorkspace'
import Documents from './pages/Documents'
import Login from './pages/Login'
import { AuthProvider, useAuth } from './components/AuthProvider'
import { UserProvider } from './context/UserContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDarkMode)
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString())
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <AppContent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </Router>
      </UserProvider>
    </AuthProvider>
  )
}

function AppContent({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
      <Sidebar darkMode={darkMode} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-5 flex justify-end">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/workspace" element={<ProtectedRoute><MyWorkspace /></ProtectedRoute>} />
          <Route path="/workspace/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
          <Route path="/recordings" element={<ProtectedRoute><MyRecordings /></ProtectedRoute>} />
          <Route path="/transcripts" element={<ProtectedRoute><MyTranscripts /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><MyCalendar /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><MyNotes darkMode={darkMode} /></ProtectedRoute>} />
          <Route path="/record" element={<ProtectedRoute><Record /></ProtectedRoute>} />
          <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
