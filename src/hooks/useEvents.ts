import { useState, useEffect, useCallback } from 'react'
import { CalendarEvent } from '../lib/types'
import { getCalendarEvents, getMeetings, createEvent, updateEvent, deleteEvent } from '../lib/supabaseService'
import { useUser } from '../context/UserContext'

export const useEvents = () => {
  const { user } = useUser()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAllEvents = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    try {
      const [calendarEvents, meetings] = await Promise.all([
        getCalendarEvents(user.id),
        getMeetings(user.id)
      ])
      
      setEvents([...calendarEvents, ...meetings])
    } catch (error: any) {
      console.error('Error fetching events:', error)
      setError(`Failed to fetch events: ${error.message}. Please try again later.`)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchAllEvents()
    }
  }, [user, fetchAllEvents])

  const handleCreateEvent = async (newEvent: Partial<CalendarEvent>) => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    try {
      const createdEvent = await createEvent(newEvent, user.id, newEvent.type as 'meeting' | 'event')
      if (createdEvent) {
        setEvents(prevEvents => [...prevEvents, createdEvent])
      }
      return createdEvent
    } catch (error: any) {
      console.error('Error creating event:', error)
      setError('Failed to create event. Please try again.')
      return null
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
      }
      return editedEvent
    } catch (error: any) {
      console.error('Error updating event:', error)
      setError('Failed to update event. Please try again.')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEvent = async (eventId: string, eventType: 'meeting' | 'event') => {
    setIsLoading(true)
    setError(null)
    try {
      await deleteEvent(eventId, eventType)
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId))
      return true
    } catch (error: any) {
      console.error('Error deleting event:', error)
      setError('Failed to delete event. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }
  export function useRuns() {
    /**
     * Generates a public shared run ID for the given run ID.
     */
    const shareRun = async (runId: string): Promise<string | undefined> => {
      const res = await fetch("/api/runs/share", {
        method: "POST",
        body: JSON.stringify({ runId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        return;
      }
  
      const { sharedRunURL } = await res.json();
      return sharedRunURL;
    };
  
    return {
      shareRun,
    };
  }
  
  return {
    events,
    isLoading,
    error,
    fetchAllEvents,
    handleCreateEvent,
    handleEditEvent,
    handleDeleteEvent,
  }
}
