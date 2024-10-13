import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../components/AuthProvider'
import RecordingTimeline from '../components/RecordingTimeline'
import TagManager from '../components/TagManager'
import { Clock, List, FileText, Tag, MoreVertical, Play, Download, Edit3, Trash2 } from 'react-feather'

interface Recording {
  recording_id: number
  user_id: string
  file_path: string
  created_at: string
  meeting_id: number | null
  transcript_id: number | null
  duration: number
  name: string | null
  tags: string[]
  content?: string | null
}

const MyRecordings: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [filteredRecordings, setFilteredRecordings] = useState<Recording[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [showTagManager, setShowTagManager] = useState(false)
  const [activeMenu, setActiveMenu] = useState<number | null>(null)
  const [hoveredRecording, setHoveredRecording] = useState<number | null>(null)
  const { user } = useAuth()

  const fetchRecordings = useCallback(async () => {
    if (!user) {
      console.log('No user found, skipping recording fetch')
      setLoading(false)
      setError('Please log in to view your recordings.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log('Fetching recordings for user:', user.id)

      const { data, error } = await supabase
        .from('recordings')
        .select('*, tags(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (!data) {
        console.log('No data returned from Supabase')
        setRecordings([])
        setFilteredRecordings([])
      } else {
        console.log('Fetched recordings:', data)
        const formattedRecordings = data.map(recording => ({
          ...recording,
          tags: recording.tags.map((tag: any) => tag.name)
        }))
        setRecordings(formattedRecordings)
        setFilteredRecordings(formattedRecordings)
      }
    } catch (error: any) {
      console.error('Error fetching recordings:', error)
      setError(`Failed to fetch recordings: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }, [user])

  const fetchTags = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('name')
        .order('name')

      if (error) throw error

      if (data) {
        const tags = data.map(tag => tag.name)
        setAllTags(tags)
      }
    } catch (error: any) {
      console.error('Error fetching tags:', error)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchRecordings()
      fetchTags()
    }
  }, [user, fetchRecordings, fetchTags])

  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredRecordings(recordings)
    } else {
      const filtered = recordings.filter(recording =>
        selectedTags.every(tag => recording.tags.includes(tag))
      )
      setFilteredRecordings(filtered)
    }
  }, [selectedTags, recordings])

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'timeline' : 'list')
  }

  const handleAddTag = (tag: string) => {
    setSelectedTags([...selectedTags, tag])
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag))
  }

  const toggleTagManager = () => {
    setShowTagManager(!showTagManager)
  }

  const handleActionClick = (e: React.MouseEvent, recordingId: number) => {
    e.stopPropagation()
    setActiveMenu(activeMenu === recordingId ? null : recordingId)
  }

  const handleAction = (action: string, recordingId: number) => {
    switch(action) {
      case 'play':
        console.log(`Playing recording ${recordingId}`)
        break
      case 'download':
        console.log(`Downloading recording ${recordingId}`)
        break
      case 'edit':
        console.log(`Editing tags for recording ${recordingId}`)
        break
      case 'delete':
        console.log(`Deleting recording ${recordingId}`)
        break
      default:
        console.log(`Unknown action ${action} for recording ${recordingId}`)
    }
    setActiveMenu(null)
  }

  const getContentPreview = (content: string | null | undefined) => {
    if (!content) return 'No content available'
    return content.slice(0, 100) + (content.length > 100 ? '...' : '')
  }

  if (loading) {
    return <div className="text-center py-4">Loading recordings...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Recordings</h1>
        <div className="flex space-x-2">
          <button
            onClick={toggleViewMode}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {viewMode === 'list' ? <Clock className="mr-2" /> : <List className="mr-2" />}
            {viewMode === 'list' ? 'Timeline View' : 'List View'}
          </button>
          <button
            onClick={toggleTagManager}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Tag className="mr-2" />
            Manage Tags
          </button>
        </div>
      </div>

      {showTagManager && (
        <div className="mb-6">
          <TagManager
            tags={selectedTags}
            allTags={allTags}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />
        </div>
      )}

      {filteredRecordings.length === 0 ? (
        <p className="text-center py-4">No recordings found. Try creating a new recording or adjusting your tag filters.</p>
      ) : viewMode === 'list' ? (
        <div className="bg-white shadow-md rounded-lg overflow-visible">
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
              {filteredRecordings.map((recording) => (
                <tr key={recording.recording_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <div className="ml-4 relative">
                        <div
                          className="text-sm font-medium text-gray-900 cursor-pointer"
                          onMouseEnter={() => setHoveredRecording(recording.recording_id)}
                          onMouseLeave={() => setHoveredRecording(null)}
                        >
                          {recording.name || `Recording ${recording.recording_id}`}
                        </div>
                        {hoveredRecording === recording.recording_id && (
                          <div className="absolute z-10 p-2 bg-gray-100 rounded shadow-lg mt-1">
                            {getContentPreview(recording.content)}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(recording.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{`${Math.floor(recording.duration / 60)}:${(recording.duration % 60).toString().padStart(2, '0')}`}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {recording.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={(e) => handleActionClick(e, recording.recording_id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      {activeMenu === recording.recording_id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <button
                              onClick={() => handleAction('play', recording.recording_id)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Play className="mr-3 h-5 w-5 text-gray-400" /> Play
                            </button>
                            <button
                              onClick={() => handleAction('download', recording.recording_id)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Download className="mr-3 h-5 w-5 text-gray-400" /> Download
                            </button>
                            <button
                              onClick={() => handleAction('edit', recording.recording_id)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Edit3 className="mr-3 h-5 w-5 text-gray-400" /> Edit Tags
                            </button>
                            <button
                              onClick={() => handleAction('delete', recording.recording_id)}
                              className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Trash2 className="mr-3 h-5 w-5 text-red-400" /> Delete
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
        <RecordingTimeline recordings={filteredRecordings} onActionClick={handleAction} />
      )}
    </div>
  )
}

export default MyRecordings
