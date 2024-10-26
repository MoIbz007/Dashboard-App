import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Mic, FileText, Calendar, FileEdit, List, MessageSquare, Layout, LogOut, ChevronLeft } from 'lucide-react'
import { signOut } from '../lib/supabaseClient'
import './sidebar.css'

interface MenuItem {
  icon: React.ElementType
  title: string
  path: string
  subItems?: MenuItem[]
}

interface SidebarProps {
  darkMode: boolean
}

const menuItems: MenuItem[] = [
  { icon: Home, title: 'Home', path: '/' },
  { 
    icon: Layout, 
    title: 'Workspace', 
    path: '/workspace',
    subItems: [
      { icon: FileText, title: 'Documents', path: '/workspace/documents' },
      { icon: List, title: 'Tasks', path: '/workspace/tasks' }
    ]
  },
  { icon: Mic, title: 'Recordings', path: '/recordings' },
  { icon: FileText, title: 'Transcripts', path: '/transcripts' },
  { icon: Calendar, title: 'Calendar', path: '/calendar' },
  { icon: FileEdit, title: 'Notes', path: '/notes' },
  { icon: List, title: 'Record', path: '/record' },
  { icon: MessageSquare, title: 'Chatbot', path: '/chatbot' }
]

const Sidebar: React.FC<SidebarProps> = ({ darkMode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([])
  const location = useLocation()
  const sidebarRef = useRef<HTMLDivElement>(null)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
    if (!isCollapsed) {
      setOpenSubMenus([])
    }
  }

  const toggleSubMenu = (path: string) => {
    if (isCollapsed) return
    setOpenSubMenus(prev => 
      prev.includes(path) 
        ? prev.filter(item => item !== path)
        : [...prev, path]
    )
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (isCollapsed && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
      setOpenSubMenus([])
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCollapsed])

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isActive = location.pathname === item.path
    const isOpen = openSubMenus.includes(item.path)
    const hasSubItems = item.subItems && item.subItems.length > 0
    const Icon = item.icon

    return (
      <li 
        key={item.path} 
        className={`menu-item ${hasSubItems ? 'sub-menu' : ''} ${isOpen ? 'open' : ''} ${isActive ? 'active' : ''}`}
      >
        <Link
          to={hasSubItems ? '#' : item.path}
          className="menu-link"
          onClick={(e) => {
            if (hasSubItems) {
              e.preventDefault()
              toggleSubMenu(item.path)
            }
          }}
        >
          <span className="menu-icon">
            <Icon />
          </span>
          <span className="menu-title">{item.title}</span>
          {hasSubItems && <span className="menu-arrow" />}
        </Link>
        {hasSubItems && item.subItems && (
          <ul className="sub-menu-list">
            {item.subItems.map(subItem => renderMenuItem(subItem, level + 1))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <div ref={sidebarRef} className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${darkMode ? 'dark' : ''}`}>
      <div id="sidebar-collapser" onClick={toggleCollapse}>
        <ChevronLeft />
      </div>
      <div className="sidebar-layout">
        <div className="sidebar-header">
          <span className="app-icon">AI</span>
          <span className="app-name">Playground</span>
        </div>
        
        <div className="sidebar-content">
          <nav className="menu">
            <ul>
              {menuItems.map(item => renderMenuItem(item))}
            </ul>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button onClick={signOut} className="sign-out-btn">
            <LogOut />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
