import React from 'react'
import { FileEdit, Trash2 } from 'lucide-react'

const MyNotes = () => {
  const notes = [
    { id: 1, title: 'Project Ideas', content: 'Brainstorming session outcomes...', date: '2023-03-18' },
    { id: 2, title: 'Meeting Action Items', content: 'Follow up with client...', date: '2023-03-17' },
    { id: 3, title: 'Research Notes', content: 'Key findings from market analysis...', date: '2023-03-16' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Notes</h1>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search notes..."
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          New Note
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div key={note.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{note.title}</h2>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900">
                  <FileEdit className="w-5 h-5" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{note.content}</p>
            <p className="text-sm text-gray-500">{note.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyNotes