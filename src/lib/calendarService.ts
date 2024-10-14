import { supabase } from './supabaseClient'
import { CalendarEvent } from './types'

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

// Add more calendar-related functions as needed
