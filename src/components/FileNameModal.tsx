import React, { useState } from 'react'

interface FileNameModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (fileName: string) => void
  audioUrl: string | null
}

const FileNameModal: React.FC<FileNameModalProps> = ({ isOpen, onClose, onSave, audioUrl }) => {
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSave = () => {
    if (!fileName.trim()) {
      setError('File name cannot be empty')
      return
    }

    if (!/^[a-zA-Z0-9-_\s]+$/.test(fileName)) {
      setError('File name can only contain letters, numbers, spaces, hyphens, and underscores')
      return
    }

    onSave(fileName)
    setFileName('')
    setError(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Name Your Recording</h2>
        <input
          type="text"
          value={fileName}
          onChange={(e) => {
            setFileName(e.target.value)
            setError(null)
          }}
          placeholder="Enter file name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {audioUrl && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Preview:</h3>
            <audio controls src={audioUrl} className="w-full">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default FileNameModal
