import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Home, Mic, FileText, Calendar, FileEdit, List, LogOut, MessageSquare, Layout, Moon, Sun } from 'lucide-react'
import HomePage from './pages/HomePage'
import MyRecordings from './pages/MyRecordings'
import MyTranscripts from './pages/MyTranscripts'
import MyCalendar from './pages/MyCalendar'
import MyNotes from './pages/MyNotes'
import Record from './pages/Record'
import ChatbotPage from './pages/ChatbotPage'
import MyWorkspace from './pages/MyWorkspace'
import Login from './pages/Login'
import { AuthProvider, useAuth } from './components/AuthProvider'
import { UserProvider } from './context/UserContext'
import ProtectedRoute from './components/ProtectedRoute'
import { signOut } from './lib/supabaseClient'

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
      {/* Sidebar */}
      <nav className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-5">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">AI Playground</h1>
        </div>
        <ul className="space-y-2 p-5">
          <NavItem to="/" icon={<Home />} text="Home" />
          <NavItem to="/workspace" icon={<Layout />} text="My Workspace" />
          <NavItem to="/recordings" icon={<Mic />} text="My Recordings" />
          <NavItem to="/transcripts" icon={<FileText />} text="My Transcripts" />
          <NavItem to="/calendar" icon={<Calendar />} text="My Calendar" />
          <NavItem to="/notes" icon={<FileEdit />} text="My Notes" />
          <NavItem to="/record" icon={<List />} text="Record" />
          <NavItem to="/chatbot" icon={<MessageSquare />} text="Chatbot" />
        </ul>
        <div className="p-5">
          <button
            onClick={signOut}
            className="flex items-center space-x-3 text-red-600 dark:text-red-400 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 w-full"
          >
            <LogOut />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main content */}
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

function NavItem({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) {
  return (
    <li>
      <Link to={to} className="flex items-center space-x-3 text-gray-700 dark:text-gray-200 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
        {icon}
        <span>{text}</span>
      </Link>
    </li>
  )
}

export default App
