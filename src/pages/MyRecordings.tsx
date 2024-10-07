import React, { useEffect, useState } from 'react'
import { Trash2, Play, Pause } from 'lucide-react'
import { getRecordings, deleteRecording, Recording } from '../lib/supabaseService'
// Remove the import for PlaybackComponent as it's not found
import PlaybackComponent from '../components/PlaybackComponent'

const MyRecordings = () => {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [error, setError] = useState<string | null>(null)
  const [playingRecordingId, setPlayingRecordingId] = useState<number | null>(null)

  useEffect(() => {
    fetchRecordings()
  }, [])

  async function fetchRecordings() {
    try {
      const data = await getRecordings()
      setRecordings(data)
      setError(null)
    } catch (error) {
      console.error('Error fetching recordings:', error)
      setError('Failed to fetch recordings. Please try again later.')
    }
  }

  async function handleDeleteRecording(id: number) {
    try {
      await deleteRecording(id)
      fetchRecordings()
    } catch (error) {
      console.error('Error deleting recording:', error)
      setError('Failed to delete recording. Please try again later.')
    }
  }

  const handlePlayStateChange = (recordingId: number, isPlaying: boolean) => {
    setPlayingRecordingId(isPlaying ? recordingId : null)
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-4">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Recordings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recordings.map((recording) => (
          <div key={recording.recording_id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{recording.name || 'Untitled Recording'}</h2>
            <p className="text-gray-600 mb-2">Duration: {recording.duration} seconds</p>
            <p className="text-gray-600 mb-4">Created: {new Date(recording.created_at!).toLocaleString()}</p>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => handlePlayStateChange(recording.recording_id!, playingRecordingId !== recording.recording_id)}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {playingRecordingId === recording.recording_id ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button
                className="text-red-600 hover:text-red-900"
                onClick={() => handleDeleteRecording(recording.recording_id!)}
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
            {playingRecordingId === recording.recording_id && (
              <PlaybackComponent
                filePath={recording.file_path}
                onPlayStateChange={(isPlaying) => handlePlayStateChange(recording.recording_id!, isPlaying)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyRecordings