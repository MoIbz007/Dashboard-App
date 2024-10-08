import { supabase } from './supabaseClient'

export interface Meeting {
  meeting_id?: number
  meeting_title: string
  date_time: string
  duration?: number
  organizer_id?: number
  agenda?: string
  scheduled_meeting?: boolean
}

export interface Recording {
  recording_id?: number
  user_id: string
  file_path: string
  created_at?: string
  meeting_id?: number
  transcript_id?: number
  duration: number
  name?: string
}

export interface Transcript {
  transcript_id?: number
  meeting_id?: number
  content?: string
  recording_id?: number
}

// Helper function to check if Supabase client is initialized
const checkSupabaseClient = () => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Please check your environment variables.')
  }
}

export const createMeeting = async (meeting: Meeting) => {
  checkSupabaseClient()
  const { data, error } = await supabase!.from('meetings').insert(meeting).single()
  if (error) throw error
  return data
}

export const getMeetings = async () => {
  checkSupabaseClient()
  const { data, error } = await supabase!.from('meetings').select('*')
  if (error) throw error
  return data
}

export const updateMeeting = async (meeting_id: number, updates: Partial<Meeting>) => {
  checkSupabaseClient()
  const { data, error } = await supabase!.from('meetings').update(updates).eq('meeting_id', meeting_id).single()
  if (error) throw error
  return data
}

export const deleteMeeting = async (meeting_id: number) => {
  checkSupabaseClient()
  const { error } = await supabase!.from('meetings').delete().eq('meeting_id', meeting_id)
  if (error) throw error
}

export const createRecording = async (recording: Recording) => {
  checkSupabaseClient()
  const { data, error } = await supabase!.from('recordings').insert(recording).single()
  if (error) throw error
  return data
}

export const getRecordings = async () => {
  checkSupabaseClient()
  const { data, error } = await supabase!.from('recordings').select('*')
  if (error) throw error
  return data
}

export const updateRecording = async (recording_id: number, updates: Partial<Recording>) => {
  checkSupabaseClient()
  const { data, error } = await supabase!.from('recordings').update(updates).eq('recording_id', recording_id).single()
  if (error) throw error
  return data
}

export const deleteRecording = async (recording_id: number) => {
  checkSupabaseClient()
  const { error } = await supabase!.from('recordings').delete().eq('recording_id', recording_id)
  if (error) throw error
}

export const createTranscript = async (transcript: Transcript) => {
  checkSupabaseClient()
  const { data, error } = await supabase!.from('transcripts').insert(transcript).single()
  if (error) throw error
  return data
}

export const getTranscripts = async () => {
  checkSupabaseClient()
  const { data, error } = await supabase!.from('transcripts').select('*')
  if (error) throw error
  return data
}

export const updateTranscript = async (transcript_id: number, updates: Partial<Transcript>) => {
  checkSupabaseClient()
  const { data, error } = await supabase!.from('transcripts').update(updates).eq('transcript_id', transcript_id).single()
  if (error) throw error
  return data
}

export const deleteTranscript = async (transcript_id: number) => {
  checkSupabaseClient()
  const { error } = await supabase!.from('transcripts').delete().eq('transcript_id', transcript_id)
  if (error) throw error
}