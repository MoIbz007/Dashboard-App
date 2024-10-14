import React from 'react'

type EventType = 'meeting' | 'event' | 'outlook'
type ImportanceLevel = 'low' | 'medium' | 'high'

interface FilterComponentProps {
  eventTypes: readonly EventType[]
  selectedEventTypes: EventType[]
  onEventTypeChange: (eventType: EventType) => void
  importanceLevels: readonly ImportanceLevel[]
  selectedImportance: ImportanceLevel[]
  onImportanceChange: (importance: ImportanceLevel) => void
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  eventTypes,
  selectedEventTypes,
  onEventTypeChange,
  importanceLevels,
  selectedImportance,
  onImportanceChange
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Event Types</h3>
        <div className="flex flex-wrap gap-2">
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => onEventTypeChange(type)}
              className={`px-3 py-1 rounded-full ${
                selectedEventTypes.includes(type)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Importance</h3>
        <div className="flex flex-wrap gap-2">
          {importanceLevels.map((level) => (
            <button
              key={level}
              onClick={() => onImportanceChange(level)}
              className={`px-3 py-1 rounded-full ${
                selectedImportance.includes(level)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FilterComponent
