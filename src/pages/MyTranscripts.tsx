import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../components/AuthProvider'
import TranscriptTimeline from '../components/TranscriptTimeline'
import TagManager from '../components/TagManager'
import { Clock, List, Tag, FileText, MoreVertical, Eye, Download, Edit3, Trash2, PlusSquare } from 'react-feather'
import NewNoteModal from '../components/NewNoteModal'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Transcript {
  transcript_id: number
  meeting_id: number | null
  content: string | null
  recording_id: number | null
  user_id: string
  created_at: string
  tags: string[]
  meetings?: { meeting_title: string | null }
  recordings?: { name: string | null; duration: number | null }
}

const MyTranscripts: React.FC = () => {
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [filteredTranscripts, setFilteredTranscripts] = useState<Transcript[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeMenu, setActiveMenu] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [hoveredTranscript, setHoveredTranscript] = useState<number | null>(null)
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false)
  const [selectedTranscript, setSelectedTranscript] = useState<Transcript | null>(null)
  const [isCreatingNote, setIsCreatingNote] = useState(false)
  const { user } = useAuth()

  const fetchTranscripts = useCallback(async () => {
    if (!user) {
      console.log('No user found, skipping transcript fetch')
      setLoading(false)
      setError('Please log in to view your transcripts.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log('Fetching transcripts for user:', user.id)

      const { data: permissionCheck, error: permissionError } = await supabase
        .from('transcripts')
        .select('transcript_id')
        .limit(1)

      if (permissionError) {
        console.error('Permission check failed:', permissionError)
        throw new Error('You do not have permission to access transcripts.')
      }

      console.log('Permission check passed:', permissionCheck)

      const { data, error } = await supabase
        .from('transcripts')
        .select(`
          *,
          meetings (
            meeting_title
          ),
          recordings!transcripts_recording_id_fkey (
            name,
            duration
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Fetched transcripts:', data)

      if (!data) {
        throw new Error('No data returned from Supabase')
      }

      if (data.length === 0) {
        console.log('No transcripts found for the user')
      }

      const transcriptsWithTags = data.map((transcript: Transcript) => ({
        ...transcript,
        tags: transcript.tags || []
      }))

      setTranscripts(transcriptsWithTags)
      setFilteredTranscripts(transcriptsWithTags)

      // Extract all unique tags
      const tags = Array.from(new Set(transcriptsWithTags.flatMap((t: Transcript) => t.tags)))
      setAllTags(tags)
    } catch (error: any) {
      console.error('Error fetching transcripts:', error)
      if (error instanceof Error) {
        setError(`Failed to fetch transcripts: ${error.message}`)
      } else if (typeof error === 'object' && error !== null) {
        setError(`Failed to fetch transcripts: ${JSON.stringify(error)}`)
      } else {
        setError('An unknown error occurred while fetching transcripts')
      }
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchTranscripts()
  }, [fetchTranscripts])

  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredTranscripts(transcripts)
    } else {
      const filtered = transcripts.filter((transcript: Transcript) =>
        selectedTags.every(tag => transcript.tags.includes(tag))
      )
      setFilteredTranscripts(filtered)
    }
  }, [selectedTags, transcripts])

  const handleActionClick = (e: React.MouseEvent, transcriptId: number) => {
    e.stopPropagation()
    setActiveMenu(activeMenu === transcriptId ? null : transcriptId)
  }

  const handleAction = (action: string, transcriptId: number) => {
    const transcript = transcripts.find(t => t.transcript_id === transcriptId)
    if (!transcript) {
      console.error(`Transcript with id ${transcriptId} not found`)
      return
    }

    switch(action) {
      case 'view':
        // Implement view logic
        console.log(`Viewing transcript ${transcriptId}`)
        break
      case 'download':
        // Implement download logic
        console.log(`Downloading transcript ${transcriptId}`)
        break
      case 'edit':
        // Implement edit tags logic
        console.log(`Editing tags for transcript ${transcriptId}`)
        break
      case 'delete':
        // Implement delete logic
        console.log(`Deleting transcript ${transcriptId}`)
        break
      case 'createNote':
        setSelectedTranscript(transcript)
        setIsNewNoteModalOpen(true)
        break
      default:
        console.log(`Unknown action ${action} for transcript ${transcriptId}`)
    }
    setActiveMenu(null)
  }

  const handleCreateNote = async (title: string, content: string, tags: string[]) => {
    if (!user) {
      console.error('User not authenticated')
      toast.error('You must be logged in to create a note.')
      return
    }

    setIsCreatingNote(true)

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([
          {
            user_id: user.id,
            title,
            content,
            tags,
            transcript_id: selectedTranscript?.transcript_id
          }
        ])
        .select()

      if (error) {
        throw error
      }

      console.log('New note created:', data)
      toast.success('Note created successfully!')
      // You might want to update the UI here, e.g., add the new note to a list of notes if applicable
    } catch (error) {
      console.error('Error creating new note:', error)
      toast.error('Failed to create note. Please try again.')
    } finally {
      setIsCreatingNote(false)
      setIsNewNoteModalOpen(false)
      setSelectedTranscript(null)
    }
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'timeline' : 'list')
  }

  const handleAddTag = (tag: string) => {
    setSelectedTags([...selectedTags, tag])
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t: string) => t !== tag))
  }

  const getContentPreview = (content: string | null) => {
    if (!content) return 'No content available'
    return content.slice(0, 100) + (content.length > 100 ? '...' : '')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Transcripts</h1>
        <div className="flex space-x-4">
          <button
            onClick={toggleViewMode}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {viewMode === 'list' ? <Clock className="mr-2" /> : <List className="mr-2" />}
            {viewMode === 'list' ? 'Timeline View' : 'List View'}
          </button>
          <button
            onClick={() => setActiveMenu(activeMenu === -1 ? null : -1)}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Tag className="mr-2" />
            Manage Tags
          </button>
        </div>
      </div>

      {activeMenu === -1 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Manage Tags</h2>
          <TagManager
            tags={selectedTags}
            allTags={allTags}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />
        </div>
      )}

      {loading && <p className="text-center py-4">Loading transcripts...</p>}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {!loading && !error && filteredTranscripts.length === 0 && (
        <p className="text-center py-4">No transcripts found. Try creating a new transcript or adjusting your tag filters.</p>
      )}

      {viewMode === 'list' ? (
        <div className="bg-white shadow-md rounded-lg overflow-visible"> {/* Changed overflow to visible */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTranscripts.map((transcript: Transcript) => (
                <tr key={transcript.transcript_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <div className="ml-4 relative">
                        <div
                          className="text-sm font-medium text-gray-900 cursor-pointer"
                          onMouseEnter={() => setHoveredTranscript(transcript.transcript_id)}
                          onMouseLeave={() => setHoveredTranscript(null)}
                        >
                          {transcript.meetings?.meeting_title || transcript.recordings?.name || 'Untitled Transcript'}
                        </div>
                        {hoveredTranscript === transcript.transcript_id && (
                          <div className="absolute z-10 p-2 bg-gray-100 rounded shadow-lg mt-1">
                            {getContentPreview(transcript.content)}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(transcript.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {transcript.recordings?.duration ? `${Math.round(transcript.recordings.duration / 60)} mins` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {transcript.tags.map((tag: string) => (
                        <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={(e) => handleActionClick(e, transcript.transcript_id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      {activeMenu === transcript.transcript_id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"> {/* Increased z-index */}
                          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <button
                              onClick={() => handleAction('view', transcript.transcript_id)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Eye className="mr-3 h-5 w-5 text-gray-400" /> View
                            </button>
                            <button
                              onClick={() => handleAction('download', transcript.transcript_id)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Download className="mr-3 h-5 w-5 text-gray-400" /> Download
                            </button>
                            <button
                              onClick={() => handleAction('edit', transcript.transcript_id)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Edit3 className="mr-3 h-5 w-5 text-gray-400" /> Edit Tags
                            </button>
                            <button
                              onClick={() => handleAction('delete', transcript.transcript_id)}
                              className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Trash2 className="mr-3 h-5 w-5 text-red-400" /> Delete
                            </button>
                            <button
                              onClick={() => handleAction('createNote', transcript.transcript_id)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <PlusSquare className="mr-3 h-5 w-5 text-gray-400" /> Create Note
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <TranscriptTimeline transcripts={filteredTranscripts} onActionClick={handleActionClick} />
      )}

      <NewNoteModal
        isOpen={isNewNoteModalOpen}
        onClose={() => {
          setIsNewNoteModalOpen(false)
          setSelectedTranscript(null)
        }}
        onSave={handleCreateNote}
        initialContent={selectedTranscript?.content || ''}
        initialTags={selectedTranscript?.tags || []}
        isLoading={isCreatingNote}
      />

      <ToastContainer />
    </div>
  )
}

export default MyTranscripts
