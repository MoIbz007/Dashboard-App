import React, { useEffect, useState, useCallback } from 'react'
import { FileText, Download, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../components/AuthProvider'

interface Transcript {
  transcript_id: number
  meeting_id: number | null
  content: string | null
  recording_id: number | null
  user_id: string
  meetings?: { meeting_title: string | null }
  recordings?: { name: string | null; duration: number | null }
}

const MyTranscripts = () => {
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchTranscripts = useCallback(async () => {
    if (!user) {
      console.log('No user found, skipping transcript fetch')
      setLoading(false)
      return
    }

    console.log('Fetching transcripts for user:', user.id)

    try {
      setLoading(true)
      setError(null)
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

      if (error) throw error

      console.log('Fetched transcripts:', data)
      setTranscripts(data || [])
    } catch (error) {
      console.error('Error fetching transcripts:', error)
      setError('Failed to fetch transcripts. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchTranscripts()
  }, [fetchTranscripts])

  const handleDeleteTranscript = async (transcriptId: number) => {
    // Implementation for deleting a transcript
    console.log('Delete transcript:', transcriptId)
  }

  if (loading) {
    return <div className="text-center">Loading transcripts...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  console.log('Rendering transcripts:', transcripts.length, 'User:', user?.id)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Transcripts</h1>
      {transcripts.length === 0 ? (
        <p className="text-center text-gray-600">No transcripts found for id: {user?.id || 'Unknown'}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transcripts.map((transcript) => (
            <div key={transcript.transcript_id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {transcript.meetings?.meeting_title || transcript.recordings?.name || 'Untitled Transcript'}
              </h2>
              <p className="text-gray-600 mb-2">
                Duration: {transcript.recordings?.duration ? `${transcript.recordings.duration} seconds` : 'N/A'}
              </p>
              <p className="text-gray-600 mb-2">
                Content: {transcript.content ? transcript.content.substring(0, 50) + '...' : 'No content available'}
              </p>
              <div className="flex justify-between items-center mt-4">
                <button className="text-blue-600 hover:text-blue-900">
                  <FileText className="w-6 h-6" />
                </button>
                <button className="text-green-600 hover:text-green-900">
                  <Download className="w-6 h-6" />
                </button>
                <button
                  className="text-red-600 hover:text-red-900"
                  onClick={() => handleDeleteTranscript(transcript.transcript_id)}
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyTranscripts