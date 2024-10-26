import React, { useState, useCallback } from 'react'
import { useAuth } from '../components/AuthProvider'
import TranscriptTimeline from '../components/TranscriptTimeline'
import { Clock, List, Tag } from 'react-feather'
import NewNoteModal from '../components/NewNoteModal'
import LinkMeetingModal from '../components/LinkMeetingModal'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTranscripts } from '../hooks/useTranscripts'
import TranscriptList from '../components/TranscriptList'
import { supabase } from '../lib/supabaseClient'
import { Transcript } from '../lib/types'

const MyTranscripts: React.FC = () => {
  const { user } = useAuth()
  const { transcripts, filteredTranscripts, loading, error, allTags, fetchTranscripts } = useTranscripts(user)
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false)
  const [isLinkMeetingModalOpen, setIsLinkMeetingModalOpen, setSelectedTranscript] = useState<Transcript | null>(null)
  const [isCreatingNote, setIsCreatingNote] = useState(false)

  const handleAction = useCallback((action: string, transcriptId: number) => {
    const transcript = transcripts.find(t => t.transcript_id === transcriptId)
    if (!transcript) {
      console.error(`Transcript with id ${transcriptId} not found`)
      return
    }

    switch(action) {
      case 'view':
      case 'download':
      case 'edit':
      case 'delete':
        console.log(`${action} action for transcript ${transcriptId}`)
        break
      case 'createNote':
        setSelectedTranscript(transcript)
        setIsNewNoteModalOpen(true)
        break
      case 'linkMeeting':
        setSelectedTranscript(transcript)
        setIsLinkMeetingModalOpen(true)
        break
      default:
        console.log(`Unknown action ${action} for transcript ${transcriptId}`)
    }
  }, [transcripts])

  const handleCreateNote = async (title: string, content: string, tags: string[]) => {
    if (!user || !selectedTranscript) return

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
            transcript_id: selectedTranscript.transcript_id
          }
        ])
        .select()

      if (error) throw error

      console.log('New note created:', data)
      toast.success('Note created successfully!')
    } catch (error) {
      console.error('Error creating new note:', error)
      toast.error('Failed to create note. Please try again.')
    } finally {
      setIsCreatingNote(false)
      setIsNewNoteModalOpen(false)
      setSelectedTranscript(null)
    }
  }

  const handleLinkMeeting = async (meetingId: string) => {
    if (!selectedTranscript || !user) return

    try {
      const { error: transcriptError } = await supabase
        .from('transcripts')
        .update({ meeting_id: meetingId })
        .eq('transcript_id', selectedTranscript.transcript_id)

      if (transcriptError) throw transcriptError

      if (selectedTranscript.recording_id) {
        const { error: recordingError } = await supabase
          .from('recordings')
          .update({ meeting_id: meetingId })
          .eq('recording_id', selectedTranscript.recording_id)

        if (recordingError) throw recordingError
      }

      console.log(`Transcript ${selectedTranscript.transcript_id} linked to meeting ${meetingId}`)
      toast.success('Transcript linked to meeting successfully!')
    } catch (error) {
      console.error('Error linking transcript to meeting:', error)
      toast.error('Failed to link transcript to meeting. Please try again.')
    } finally {
      setIsLinkMeetingModalOpen(false)
      setSelectedTranscript(null)
    }
  }

  const toggleViewMode = () => {
    setViewMode(prevMode => (prevMode === 'list' ? 'timeline' : 'list'))
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    )
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
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Filter by Tags</h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full ${
                selectedTags.includes(tag)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!loading && !error && filteredTranscripts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No transcripts found. Create a new recording to get started.</p>
        </div>
      )}

      {viewMode === 'list' ? (
        <TranscriptList transcripts={filteredTranscripts} onActionClick={handleAction} />
      ) : (
        <TranscriptTimeline transcripts={filteredTranscripts} onActionClick={handleAction} />
      )}

      <NewNoteModal
        isOpen={isNewNoteModalOpen}
        onClose={() => {
          setIsNewNoteModalOpen(false);
          setSelectedTranscript(null);
        }}
        onSave={handleCreateNote}
        initialContent={selectedTranscript?.content || ''}
        initialTags={selectedTranscript?.tags || []}
        isLoading={isCreatingNote}
      />

      <LinkMeetingModal
        isOpen={isLinkMeetingModalOpen}
        onClose={() => {
          setIsLinkMeetingModalOpen(false);
          setSelectedTranscript(null);
        }}
        onLink={handleLinkMeeting}
        userId={user?.id || ''}
        transcriptId={selectedTranscript?.transcript_id || 0}
      />

      <ToastContainer />
    </div>
  )
}

export default MyTranscripts
