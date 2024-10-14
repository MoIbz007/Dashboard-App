import React, { useState } from 'react'
import { useRecordings } from '../hooks/useRecordings'
import RecordingList from '../components/RecordingList'
import RecordingTimeline from '../components/RecordingTimeline'
import { Clock, List } from 'react-feather'

const MyRecordings: React.FC = () => {
  const {
    filteredRecordings,
    loading,
    error,
    selectedTags,
    allTags,
    handleAddTag,
    handleRemoveTag,
  } = useRecordings()

  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list')

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'timeline' : 'list')
  }

  const handleActionClick = (action: string, recordingId: number) => {
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
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      handleRemoveTag(tag)
    } else {
      handleAddTag(tag)
    }
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

      {filteredRecordings.length === 0 ? (
        <p className="text-center py-4">No recordings found. Try adjusting your tag filters.</p>
      ) : viewMode === 'list' ? (
        <RecordingList
          recordings={filteredRecordings}
          onActionClick={handleActionClick}
        />
      ) : (
        <RecordingTimeline recordings={filteredRecordings} onActionClick={handleActionClick} />
      )}
    </div>
  )
}

export default MyRecordings
