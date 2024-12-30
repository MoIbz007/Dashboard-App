import { CalendarEvent } from './types'
import { supabase } from './supabaseClient'

export interface Recording {
  id: number
  user_id: string
  title: string
  audio_url: string
  created_at: string
  duration: number
}

export async function getCalendarEvents(userId: string): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', userId)
    .order('start_time', { ascending: false })

  if (error) {
    console.error('Error fetching calendar events:', error)
    throw error
  }

  return data || []
}

export async function getMeetings(userId: string): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('user_id', userId)
    .order('start_time', { ascending: false })

  if (error) {
    console.error('Error fetching meetings:', error)
    throw error
  }

  return data.map(meeting => ({
    ...meeting,
    type: 'meeting',
    source: 'manual',
  })) || []
}

export async function createEvent(event: Partial<CalendarEvent>, userId: string, type: 'meeting' | 'event'): Promise<CalendarEvent> {
  const table = type === 'meeting' ? 'meetings' : 'calendar_events'
  const { data, error } = await supabase
    .from(table)
    .insert({ ...event, user_id: userId })
    .single()

  if (error) {
    console.error(`Error creating ${type}:`, error)
    throw error
  }

  return data
}

export async function updateEvent(event: CalendarEvent): Promise<CalendarEvent> {
  const table = event.type === 'meeting' ? 'meetings' : 'calendar_events'
  const { data, error } = await supabase
    .from(table)
    .update(event)
    .eq('id', event.id)
    .single()

  if (error) {
    console.error(`Error updating ${event.type}:`, error)
    throw error
  }

  return data
}

export async function deleteEvent(eventId: string, type: 'meeting' | 'event'): Promise<void> {
  const table = type === 'meeting' ? 'meetings' : 'calendar_events'
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', eventId)

  if (error) {
    console.error(`Error deleting ${type}:`, error)
    throw error
  }
}

export async function getRecordings(): Promise<Recording[]> {
  const { data, error } = await supabase
    .from('recordings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching recordings:', error)
    throw error
  }

  return data || []
}

export async function deleteRecording(id: number): Promise<void> {
  const { error } = await supabase
    .from('recordings')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting recording:', error)
    throw error
  }
}
