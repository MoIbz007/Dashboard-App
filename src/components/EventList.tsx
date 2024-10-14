import React from 'react'
import moment from 'moment'
import { CalendarEvent } from '../lib/types'
import { Edit, Trash, Info } from 'lucide-react'

interface EventListProps {
  events: CalendarEvent[]
  onEditEvent: (event: CalendarEvent) => void
  onDeleteEvent: (event: CalendarEvent) => void
  onViewDetails: (event: CalendarEvent) => void
}

const EventList: React.FC<EventListProps> = ({ events, onEditEvent, onDeleteEvent, onViewDetails }) => {
  return (
    <div className="space-y-4">
      {events.map((event: CalendarEvent) => (
        <div key={event.id} className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{event.title}</h2>
              <p className="text-gray-600">
                {moment(event.start_time).format('MMMM D, YYYY h:mm A')} -{' '}
                {moment(event.end_time).format('h:mm A')}
              </p>
              {event.description && (
                <p className="text-gray-700 mt-2">{event.description}</p>
              )}
              <span className={`inline-block text-xs px-2 py-1 rounded-full mt-2 ${
                event.type === 'meeting' 
                  ? 'bg-blue-100 text-blue-800' 
                  : event.type === 'outlook'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {event.type === 'meeting' ? 'Meeting' : event.type === 'outlook' ? 'Outlook Event' : 'Event'}
              </span>
              <span className={`inline-block text-xs px-2 py-1 rounded-full mt-2 ml-2 ${
                event.importance === 'high'
                  ? 'bg-red-100 text-red-800'
                  : event.importance === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {event.importance || 'medium'}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onViewDetails(event)}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <Info size={16} />
              </button>
              <button
                onClick={() => onEditEvent(event)}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onDeleteEvent(event)}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default EventList
