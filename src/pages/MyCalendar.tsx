import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Calendar as CalendarIcon, List, Plus, Edit, Trash, Info, RefreshCw } from 'lucide-react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { getMeetings, getOutlookEvents, createEvent, updateEvent, deleteEvent } from '../lib/supabaseService'
import { CalendarEvent, Meeting } from '../lib/types'
import CreateEventModal from '../components/CreateEventModal'
import EditEventModal from '../components/EditEventModal'
import FilterComponent from '../components/FilterComponent'
import EventDetailsModal from '../components/EventDetailsModal'
import { debounce } from 'lodash'
import { useUser } from '../context/UserContext'

const localizer = momentLocalizer(moment)

const eventTypes = ['meeting', 'outlook', 'manual']
const importanceLevels = ['low', 'medium', 'high']

interface User {
  id: string;
  // Add other user properties as needed
}

const MyCalendar: React.FC = () => {
  const { user } = useUser() as { user: User | null }
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(eventTypes)
  const [selectedImportance, setSelectedImportance] = useState<string[]>(importanceLevels)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (user) {
      fetchAllEvents()
    }
  }, [user])

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const fetchAllEvents = async () => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    setIsRefreshing(true)
    try {
      const [meetings, outlookEvents] = await Promise.all([
        getMeetings(user.id),
        getOutlookEvents(user.id)
      ])
      
      if (meetings.length === 0) {
        console.log('No meetings found or meetings table is empty')
      }
      
      const formattedMeetings: CalendarEvent[] = meetings.map((meeting: Meeting) => ({
        id: meeting.id,
        user_id: meeting.user_id,
        event_id: meeting.calendar_event_id,
        source: 'meeting',
        title: meeting.meeting_type || 'Untitled Meeting',
        description: meeting.agenda || null,
        start_time: new Date(meeting.start_time),
        end_time: new Date(meeting.end_time),
        all_day: meeting.all_day || false,
        is_meeting: true,
        importance: meeting.importance || 'medium',
        organizer: meeting.organizer_email || null,
        attendees: meeting.attendees || null,
        recurrence: meeting.recurrence || null,
        reminders: meeting.reminders || null,
        created_at: new Date(meeting.created_at),
        updated_at: new Date(meeting.updated_at),
        last_synced: new Date(meeting.last_synced),
      }))
      setEvents([...formattedMeetings, ...outlookEvents])
    } catch (error: any) {
      console.error('Error fetching events:', error)
      if (error.message === 'Meetings table does not exist or is empty') {
        setError('No meetings found. The meetings table might be empty or not set up correctly.')
      } else {
        setError(`Failed to fetch events: ${error.message}. Please try again later.`)
      }
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const getEventStyle = useCallback((event: CalendarEvent) => {
    if (event.is_meeting) {
      return { style: { backgroundColor: '#4299e1', borderColor: '#3182ce' } }
    } else if (event.source === 'outlook') {
      return { style: { backgroundColor: '#48bb78', borderColor: '#38a169' } }
    }
    return {}
  }, [])

  const handleCreateEvent = async (newEvent: Partial<CalendarEvent>) => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    try {
      const createdEvent = await createEvent(newEvent, user.id)
      if (createdEvent) {
        setEvents(prevEvents => [...prevEvents, createdEvent])
        setSuccessMessage('Event created successfully')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      setError('Failed to create event. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditEvent = async (updatedEvent: CalendarEvent) => {
    setIsLoading(true)
    setError(null)
    try {
      const editedEvent = await updateEvent(updatedEvent)
      if (editedEvent) {
        setEvents(prevEvents =>
          prevEvents.map(event => (event.id === editedEvent.id ? editedEvent : event))
        )
        setSuccessMessage('Event updated successfully')
      }
    } catch (error) {
      console.error('Error updating event:', error)
      setError('Failed to update event. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await deleteEvent(eventId)
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId))
      setSuccessMessage('Event deleted successfully')
    } catch (error) {
      console.error('Error deleting event:', error)
      setError('Failed to delete event. Please try again.')
    } finally {
      setIsLoading(false)
      setIsDeleteConfirmOpen(false)
    }
  }

  const openEditModal = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsEditModalOpen(true)
  }

  const openDetailsModal = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsDetailsModalOpen(true)
  }

  const openDeleteConfirm = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsDeleteConfirmOpen(true)
  }

  const handleEventTypeChange = useCallback(debounce((eventType: string) => {
    setSelectedEventTypes(prev =>
      prev.includes(eventType)
        ? prev.filter(type => type !== eventType)
        : [...prev, eventType]
    )
  }, 300), [])

  const handleImportanceChange = useCallback(debounce((importance: string) => {
    setSelectedImportance(prev =>
      prev.includes(importance)
        ? prev.filter(level => level !== importance)
        : [...prev, importance]
    )
  }, 300), [])

  const filteredEvents = useMemo(() => {
    return events.filter(event =>
      (selectedEventTypes.includes(event.source) || (event.is_meeting && selectedEventTypes.includes('meeting'))) &&
      selectedImportance.includes(event.importance || 'medium')
    )
  }, [events, selectedEventTypes, selectedImportance])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Calendar</h1>
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${
            view === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setView('list')}
        >
          <List className="inline-block mr-2" />
          List View
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            view === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setView('calendar')}
        >
          <CalendarIcon className="inline-block mr-2" />
          Calendar View
        </button>
        <button
          className="px-4 py-2 rounded-md bg-green-500 text-white"
          onClick={fetchAllEvents}
          disabled={isRefreshing}
        >
          <RefreshCw className={`inline-block mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Events'}
        </button>
        <button
          className="px-4 py-2 rounded-md bg-purple-500 text-white"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="inline-block mr-2" />
          Create Event
        </button>
      </div>
      <FilterComponent
        eventTypes={eventTypes}
        selectedEventTypes={selectedEventTypes}
        onEventTypeChange={handleEventTypeChange}
        importanceLevels={importanceLevels}
        selectedImportance={selectedImportance}
        onImportanceChange={handleImportanceChange}
      />
      {isLoading && (
        <div className="text-center py-4">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-600">Loading events...</p>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      {!isLoading && !error && (
        view === 'list' ? (
          <div className="space-y-4">
            {filteredEvents.map((event: CalendarEvent) => (
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
                      event.is_meeting 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {event.is_meeting ? 'Meeting' : 'Outlook Event'}
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
                      onClick={() => openDetailsModal(event)}
                      className="p-1 rounded-full hover:bg-gray-200"
                    >
                      <Info size={16} />
                    </button>
                    <button
                      onClick={() => openEditModal(event)}
                      className="p-1 rounded-full hover:bg-gray-200"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(event)}
                      className="p-1 rounded-full hover:bg-gray-200"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[600px]">
            <Calendar
              localizer={localizer}
              events={filteredEvents.map((event: CalendarEvent) => ({
                ...event,
                start: new Date(event.start_time),
                end: new Date(event.end_time),
              }))}
              startAccessor="start"
              endAccessor="end"
              titleAccessor="title"
              style={{ height: '100%' }}
              eventPropGetter={getEventStyle}
              onSelectEvent={(event) => openDetailsModal(event as CalendarEvent)}
            />
          </div>
        )
      )}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateEvent={handleCreateEvent}
      />
      {selectedEvent && (
        <>
          <EditEventModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onEditEvent={handleEditEvent}
            event={selectedEvent}
          />
          <EventDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            event={selectedEvent}
          />
          <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${isDeleteConfirmOpen ? '' : 'hidden'}`}>
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Confirm Delete</h3>
              <p className="mb-4">Are you sure you want to delete this event?</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MyCalendar
