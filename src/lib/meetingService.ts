import { Meeting } from './types'
import { supabase } from './supabaseClient'

export async function getMeetings(userId: string): Promise<Meeting[]> {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('user_id', userId)
    .order('start_time', { ascending: false })

  if (error) {
    console.error('Error fetching meetings:', error)
    throw error
  }

  return data || []
}

export async function createMeeting(meeting: Partial<Meeting>): Promise<Meeting> {
  const { data, error } = await supabase
    .from('meetings')
    .insert(meeting)
    .single()

  if (error) {
    console.error('Error creating meeting:', error)
    throw error
  }

  return data
}

export async function updateMeeting(meeting: Meeting): Promise<Meeting> {
  const { data, error } = await supabase
    .from('meetings')
    .update(meeting)
    .eq('id', meeting.id)
    .single()

  if (error) {
    console.error('Error updating meeting:', error)
    throw error
  }

  return data
}

export async function deleteMeeting(meetingId: string): Promise<void> {
  const { error } = await supabase
    .from('meetings')
    .delete()
    .eq('id', meetingId)

  if (error) {
    console.error('Error deleting meeting:', error)
    throw error
  }
}
