import { createClient } from '@supabase/supabase-js'
import { CalendarEvent, Meeting } from './types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getMeetings(userId: string): Promise<Meeting[]> {
  console.log('Fetching meetings for user:', userId)
  
  // Check if the meetings table exists
  const { data: tableInfo, error: tableError } = await supabase
    .from('meetings')
    .select('*')
    .limit(1)

  if (tableError) {
    console.error('Error checking meetings table:', tableError)
    return []
  }

  if (!tableInfo || tableInfo.length === 0) {
    console.error('Meetings table does not exist or is empty')
    return []
  }

  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('user_id', userId)
  
  if (error) {
    console.error('Error fetching meetings:', error)
    console.error('Error details:', error.details)
    console.error('Error hint:', error.hint)
    return []
  }
  
  console.log('Fetched meetings:', data)
  return data || []
}

export async function getOutlookEvents(userId: string): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('source', 'outlook')
    .eq('user_id', userId)
  
  if (error) {
    console.error('Error fetching Outlook events:', error)
    return []
  }
  
  return data.map((event: any) => ({
    ...event,
    start_time: new Date(event.start_time),
    end_time: new Date(event.end_time),
    created_at: new Date(event.created_at),
    updated_at: new Date(event.updated_at),
    last_synced: new Date(event.last_synced),
  })) || []
}

export async function createEvent(event: Partial<CalendarEvent>, user_id: string): Promise<CalendarEvent | null> {
  const eventWithUserId = { ...event, user_id }
  const { data, error } = await supabase
    .from('calendar_events')
    .insert([eventWithUserId])
    .single()

  if (error) {
    console.error('Error creating event:', error)
    throw error
  }

  return data as CalendarEvent
}

export async function updateEvent(event: CalendarEvent): Promise<CalendarEvent | null> {
  const { data, error } = await supabase
    .from('calendar_events')
    .update(event)
    .eq('id', event.id)
    .single()

  if (error) {
    console.error('Error updating event:', error)
    throw error
  }

  return data as CalendarEvent
}

export async function deleteEvent(eventId: string): Promise<void> {
  const { error } = await supabase
    .from('calendar_events')
    .delete()
    .eq('id', eventId)

  if (error) {
    console.error('Error deleting event:', error)
    throw error
  }
}

export async function getChatbotResponse(message: string): Promise<string> {
  // This is a placeholder implementation. You'll need to replace this
  // with actual logic to interact with your chatbot service via Supabase.
  const { data, error } = await supabase
    .from('chatbot_responses')
    .select('response')
    .eq('input', message)
    .single()

  if (error) {
    console.error('Error fetching chatbot response:', error)
    return "I'm sorry, I couldn't process your request at the moment."
  }

  return data?.response || "I don't have a specific response for that input."
}
