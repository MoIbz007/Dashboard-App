export interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

export interface Recording {
  recording_id: number;
  user_id: string;
  file_path: string;
  created_at: string;
  meeting_id?: number | null;
  transcript_id?: number | null;
  duration: number;
  name: string | null;
  content?: string;
  tags?: string[];
}

export interface Transcript {
  transcript_id: number;
  user_id: string;
  recording_id: number | null;
  content: string;
  created_at: string;
  updated_at: string;
  tags: string[];
}

export type MeetingType = 'one_on_one' | 'group' | 'conference' | 'other';

export interface CalendarEvent {
  id: string;
  user_id: string;
  event_id: string;
  type: 'meeting' | 'event' | 'outlook';
  source: string;
  title: string;
  description: string | null;
  start_time: Date;
  end_time: Date;
  all_day: boolean;
  importance: 'low' | 'medium' | 'high';
  organizer: string | null;
  attendees: string[] | null;
  recurrence: any | null;
  reminders: any[] | null;
  created_at: Date;
  updated_at: Date;
  last_synced: Date;
}

export interface Meeting {
  id: string;
  user_id: string;
  calendar_event_id: string;
  meeting_type: MeetingType;
  agenda: string | null;
  start_time: string;
  end_time: string;
  all_day: boolean;
  importance: 'low' | 'medium' | 'high';
  organizer_email: string | null;
  attendees: string[] | null;
  recurrence: any | null;
  reminders: any[] | null;
  created_at: string;
  updated_at: string;
  last_synced: string;
}
