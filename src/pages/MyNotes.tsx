import React, { useState, useEffect, useMemo } from 'react'
import { FileEdit, Trash2, Tag, ChevronDown, Plus, Star, Pin, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import NewNoteModal from '../components/NewNoteModal'
import EditNoteModal from '../components/EditNoteModal'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import { supabase } from '../lib/supabaseClient'

interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  tags: string[]
  is_favorite: boolean
  is_pinned: boolean
  order_index: number | null
}

type SortOption = 'updated_at' | 'title'
type SortOrder = 'asc' | 'desc'

interface MyNotesProps {
  darkMode: boolean
}

const NOTES_PER_PAGE = 9

const MyNotes: React.FC<MyNotesProps> = ({ darkMode }) => {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('updated_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false)
  const [isEditNoteModalOpen, setIsEditNoteModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [deletingNote, setDeletingNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalNotes, setTotalNotes] = useState(0)

  useEffect(() => {
    fetchNotes()
    fetchTotalNotes()
  }, [currentPage, sortOption, sortOrder])

  const fetchNotes = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order(sortOption, { ascending: sortOrder === 'asc' })
      .range((currentPage - 1) * NOTES_PER_PAGE, currentPage * NOTES_PER_PAGE - 1)

    if (error) {
      console.error('Error fetching notes:', error)
    } else {
      setNotes(data || [])
    }
    setIsLoading(false)
  }

  const fetchTotalNotes = async () => {
    const { count, error } = await supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Error fetching total notes count:', error)
    } else {
      setTotalNotes(count || 0)
    }
  }

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            note.content.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTag = filterTag ? note.tags.includes(filterTag) : true
      return matchesSearch && matchesTag
    })
  }, [notes, searchTerm, filterTag])

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    notes.forEach((note) => note.tags.forEach((tag) => tagSet.add(tag)))
    return Array.from(tagSet)
  }, [notes])

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const addNewNote = async (title: string, content: string, tags: string[]) => {
    // Updated to use supabase.auth.getUser() instead of the deprecated supabase.auth.user()
    // This change was made to resolve TypeScript errors and use the latest Supabase API
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('User not authenticated:', userError)
      return
    }

    const newNote = {
      user_id: user.id,
      title,
      content,
      tags,
      is_favorite: false,
      is_pinned: false,
    }

    const { data, error } = await supabase
      .from('notes')
      .insert([newNote])
      .select()

    if (error) {
      console.error('Error adding new note:', error)
    } else if (data) {
      setNotes([data[0], ...notes])
      setTotalNotes(totalNotes + 1)
    }
  }

  const updateNote = async (id: string, title: string, content: string, tags: string[]) => {
    const { data, error } = await supabase
      .from('notes')
      .update({ title, content, tags })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating note:', error)
    } else if (data) {
      setNotes(notes.map(n => n.id === id ? { ...n, title, content, tags } : n))
    }
  }

  const deleteNote = async (id: string) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting note:', error)
    } else {
      setNotes(notes.filter(n => n.id !== id))
      setTotalNotes(totalNotes - 1)
    }
  }

  const toggleFavorite = async (note: Note) => {
    const { data, error } = await supabase
      .from('notes')
      .update({ is_favorite: !note.is_favorite })
      .eq('id', note.id)
      .select()

    if (error) {
      console.error('Error updating note:', error)
    } else if (data) {
      setNotes(notes.map(n => n.id === note.id ? { ...n, is_favorite: !n.is_favorite } : n))
    }
  }

  const togglePin = async (note: Note) => {
    const { data, error } = await supabase
      .from('notes')
      .update({ is_pinned: !note.is_pinned })
      .eq('id', note.id)
      .select()

    if (error) {
      console.error('Error updating note:', error)
    } else if (data) {
      setNotes(notes.map(n => n.id === note.id ? { ...n, is_pinned: !n.is_pinned } : n))
    }
  }

  const openEditModal = (note: Note) => {
    setEditingNote(note)
    setIsEditNoteModalOpen(true)
  }

  const openDeleteModal = (note: Note) => {
    setDeletingNote(note)
    setIsDeleteModalOpen(true)
  }

  const totalPages = Math.ceil(totalNotes / NOTES_PER_PAGE)

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const renderNoteContent = (content: string) => {
    return { __html: content }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${darkMode ? 'dark' : ''}`}>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">My Notes</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="flex space-x-4 w-full sm:w-auto">
          <div className="relative">
            <select
              className="appearance-none bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded-md border border-gray-300 dark:border-gray-600 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
            >
              <option value="updated_at">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          <button
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md border border-gray-300 dark:border-gray-600 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onClick={toggleSortOrder}
          >
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
          <div className="relative">
            <select
              className="appearance-none bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded-md border border-gray-300 dark:border-gray-600 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterTag || ''}
              onChange={(e) => setFilterTag(e.target.value || null)}
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center"
            onClick={() => setIsNewNoteModalOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            New Note
          </button>
        </div>
      </div>
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${note.is_pinned ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">{note.title}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleFavorite(note)}
                    className={`text-yellow-500 hover:text-yellow-600 transition-colors duration-150 ${
                      note.is_favorite ? 'opacity-100' : 'opacity-50'
                    }`}
                  >
                    <Star className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => togglePin(note)}
                    className={`text-blue-500 hover:text-blue-600 transition-colors duration-150 ${
                      note.is_pinned ? 'opacity-100' : 'opacity-50'
                    }`}
                  >
                    <Pin className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openEditModal(note)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-150"
                  >
                    <FileEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(note)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-150"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div 
                className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 overflow-hidden"
                dangerouslySetInnerHTML={renderNoteContent(note.content)}
              />
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag, index) => (
                    <span key={index} className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(note.updated_at).toLocaleDateString()}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <div className="mt-8 flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <span className="sr-only">Previous</span>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index + 1)}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white dark:bg-gray-800 text-sm font-medium ${
                currentPage === index + 1
                  ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-300'
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <span className="sr-only">Next</span>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
      <NewNoteModal
        isOpen={isNewNoteModalOpen}
        onClose={() => setIsNewNoteModalOpen(false)}
        onSave={addNewNote}
      />
      <EditNoteModal
        isOpen={isEditNoteModalOpen}
        onClose={() => setIsEditNoteModalOpen(false)}
        onSave={updateNote}
        note={editingNote}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (deletingNote) {
            deleteNote(deletingNote.id)
            setIsDeleteModalOpen(false)
          }
        }}
      />
    </div>
  )
}

export default MyNotes
