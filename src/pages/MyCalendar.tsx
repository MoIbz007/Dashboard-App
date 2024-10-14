import React, { useState, useMemo, useCallback } from 'react'
import { Calendar as CalendarIcon, List, Plus, RefreshCw } from 'lucide-react'
import { useEvents } from '../hooks/useEvents'
import EventList from '../components/EventList'
import EventCalendar from '../components/EventCalendar'
import CreateEventModal from '../components/CreateEventModal'
import EditEventModal from '../components/EditEventModal'
import EventDetailsModal from '../components/EventDetailsModal'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import FilterComponent from '../components/FilterComponent'
import { CalendarEvent } from '../lib/types'
import { debounce } from 'lodash'

const eventTypes = ['meeting', 'event', 'outlook'] as const
type EventType = typeof eventTypes[number]

const importanceLevels = ['low', 'medium', 'high'] as const
type ImportanceLevel = typeof importanceLevels[number]

const MyCalendar: React.FC = () => {
  const { events, isLoading, error, fetchAllEvents, handleCreateEvent, handleEditEvent, handleDeleteEvent } = useEvents()
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([...eventTypes])
  const [selectedImportance, setSelectedImportance] = useState<ImportanceLevel[]>([...importanceLevels])
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleEventTypeChange = useCallback((eventType: EventType) => {
    setSelectedEventTypes(prev =>
      prev.includes(eventType)
        ? prev.filter(type => type !== eventType)
        : [...prev, eventType]
    )
  }, [])

  const handleImportanceChange = useCallback((importance: ImportanceLevel) => {
    setSelectedImportance(prev =>
      prev.includes(importance)
        ? prev.filter(level => level !== importance)
        : [...prev, importance]
    )
  }, [])

  const debouncedEventTypeChange = useMemo(() => debounce(handleEventTypeChange, 300), [handleEventTypeChange])
  const debouncedImportanceChange = useMemo(() => debounce(handleImportanceChange, 300), [handleImportanceChange])

  const filteredEvents = useMemo(() => {
    return events.filter(event =>
      selectedEventTypes.includes(event.type as EventType) &&
      selectedImportance.includes(event.importance as ImportanceLevel)
    )
  }, [events, selectedEventTypes, selectedImportance])

  const refreshEvents = async () => {
    setIsRefreshing(true)
    await fetchAllEvents()
    setIsRefreshing(false)
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

  const handleCreateEventSubmit = async (newEvent: Partial<CalendarEvent>) => {
    const createdEvent = await handleCreateEvent(newEvent)
    if (createdEvent) {
      setSuccessMessage('Event created successfully')
      setIsCreateModalOpen(false)
    }
  }

  const handleEditEventSubmit = async (updatedEvent: CalendarEvent) => {
    const editedEvent = await handleEditEvent(updatedEvent)
    if (editedEvent) {
      setSuccessMessage('Event updated successfully')
      setIsEditModalOpen(false)
    }
  }

  const handleDeleteEventConfirm = async () => {
    if (selectedEvent) {
      const success = await handleDeleteEvent(selectedEvent.id, selectedEvent.type === 'outlook' ? 'event' : selectedEvent.type)
      if (success) {
        setSuccessMessage('Event deleted successfully')
        setIsDeleteConfirmOpen(false)
      }
    }
  }

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
          onClick={refreshEvents}
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
        onEventTypeChange={debouncedEventTypeChange}
        importanceLevels={importanceLevels}
        selectedImportance={selectedImportance}
        onImportanceChange={debouncedImportanceChange}
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
          <EventList
            events={filteredEvents}
            onEditEvent={openEditModal}
            onDeleteEvent={openDeleteConfirm}
            onViewDetails={openDetailsModal}
          />
        ) : (
          <EventCalendar
            events={filteredEvents}
            onSelectEvent={openDetailsModal}
          />
        )
      )}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateEvent={handleCreateEventSubmit}
      />
      {selectedEvent && (
        <>
          <EditEventModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onEditEvent={handleEditEventSubmit}
            event={selectedEvent}
          />
          <EventDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            event={selectedEvent}
          />
          <DeleteConfirmationModal
            isOpen={isDeleteConfirmOpen}
            onClose={() => setIsDeleteConfirmOpen(false)}
            onConfirm={handleDeleteEventConfirm}
          />
        </>
      )}
    </div>
  )
}

export default MyCalendar
