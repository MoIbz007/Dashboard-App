import React, { useState } from 'react'
import { FileText, MoreVertical, Play, Download, Edit3, Trash2 } from 'react-feather'
import { Recording } from '../lib/types'

interface RecordingListProps {
  recordings: Recording[]
  onActionClick: (action: string, recordingId: number) => void
}

const RecordingList: React.FC<RecordingListProps> = ({ recordings, onActionClick }) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null)
  const [hoveredRecording, setHoveredRecording] = useState<number | null>(null)

  const handleActionClick = (e: React.MouseEvent, recordingId: number) => {
    e.stopPropagation()
    setActiveMenu(activeMenu === recordingId ? null : recordingId)
  }

  const getContentPreview = (content: string | null | undefined) => {
    if (!content) return 'No content available'
    return content.slice(0, 100) + (content.length > 100 ? '...' : '')
  }

  return (
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
          {recordings.map((recording) => (
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
                  {recording.tags && recording.tags.map((tag: string) => (
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
                      <div className="py-1" role="menu">
                        <button
                          onClick={() => onActionClick('play', recording.recording_id)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Play className="mr-3 h-5 w-5 text-gray-400" /> Play
                        </button>
                        <button
                          onClick={() => onActionClick('download', recording.recording_id)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Download className="mr-3 h-5 w-5 text-gray-400" /> Download
                        </button>
                        <button
                          onClick={() => onActionClick('edit', recording.recording_id)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Edit3 className="mr-3 h-5 w-5 text-gray-400" /> Edit Tags
                        </button>
                        <button
                          onClick={() => onActionClick('delete', recording.recording_id)}
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
  )
}

export default RecordingList
