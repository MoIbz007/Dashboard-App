import React, { useState } from 'react'
import { useRecordings } from '../hooks/useRecordings'
import RecordingList from '../components/RecordingList'
import RecordingTimeline from '../components/RecordingTimeline'
import TagManager from '../components/TagManager'
import { Clock, List, Tag } from 'react-feather'

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
  const [showTagManager, setShowTagManager] = useState(false)

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'timeline' : 'list')
  }

  const toggleTagManager = () => {
    setShowTagManager(!showTagManager)
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
