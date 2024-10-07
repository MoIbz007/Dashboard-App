import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Home, Mic, FileText, Calendar, FileEdit, List, LogOut } from 'lucide-react'
import HomePage from './pages/HomePage'
import MyRecordings from './pages/MyRecordings'
import MyTranscripts from './pages/MyTranscripts'
import MyCalendar from './pages/MyCalendar'
import MyNotes from './pages/MyNotes'
import Record from './pages/Record'
import Login from './pages/Login'
import { AuthProvider, useAuth } from './components/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'
import { signOut } from './lib/supabaseClient'

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <nav className="w-64 bg-white shadow-lg">
        <div className="p-5">
          <h1 className="text-2xl font-bold text-gray-800">AI Playground</h1>
        </div>
        <ul className="space-y-2 p-5">
          <NavItem to="/" icon={<Home />} text="Home" />
          <NavItem to="/recordings" icon={<Mic />} text="My Recordings" />
          <NavItem to="/transcripts" icon={<FileText />} text="My Transcripts" />
          <NavItem to="/calendar" icon={<Calendar />} text="My Calendar" />
          <NavItem to="/notes" icon={<FileEdit />} text="My Notes" />
          <NavItem to="/record" icon={<List />} text="Record" />
        </ul>
        <div className="p-5">
          <button
            onClick={signOut}
            className="flex items-center space-x-3 text-red-600 p-2 rounded-lg hover:bg-red-100 w-full"
          >
            <LogOut />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/recordings" element={<ProtectedRoute><MyRecordings /></ProtectedRoute>} />
          <Route path="/transcripts" element={<ProtectedRoute><MyTranscripts /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><MyCalendar /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><MyNotes /></ProtectedRoute>} />
          <Route path="/record" element={<ProtectedRoute><Record /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

function NavItem({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) {
  return (
    <li>
      <Link to={to} className="flex items-center space-x-3 text-gray-700 p-2 rounded-lg hover:bg-gray-200">
        {icon}
        <span>{text}</span>
      </Link>
    </li>
  )
}

export default App