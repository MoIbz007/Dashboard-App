import React, { useState } from 'react'
import { FileText, MoreVertical, Play, Download, Edit3, Trash2 } from 'react-feather'

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
}

interface RecordingTimelineProps {
  recordings: Recording[]
  onActionClick: (action: string, recordingId: number) => void
}

const RecordingTimeline: React.FC<RecordingTimelineProps> = ({ recordings, onActionClick }) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null)

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleActionClick = (e: React.MouseEvent, recordingId: number) => {
    e.stopPropagation()
    setActiveMenu(activeMenu === recordingId ? null : recordingId)
  }

  const handleAction = (action: string, recordingId: number) => {
    onActionClick(action, recordingId)
    setActiveMenu(null)
  }

  return (
    <div className="space-y-8">
      {recordings.map((recording) => (
        <div key={recording.recording_id} className="flex">
          <div className="flex-shrink-0 w-12 relative">
            <div className="h-full w-0.5 bg-gray-200 absolute left-1/2 transform -translate-x-1/2"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            </div>
          </div>
          <div className="flex-grow pb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-semibold">
                    {recording.name || `Recording ${recording.recording_id}`}
                  </h3>
                </div>
                <div className="relative">
                  <button
                    onClick={(e) => handleActionClick(e, recording.recording_id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  {activeMenu === recording.recording_id && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
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
              </div>
              <p className="text-sm text-gray-500 mb-2">
                Created on {new Date(recording.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Duration: {formatDuration(recording.duration)}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {recording.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecordingTimeline
