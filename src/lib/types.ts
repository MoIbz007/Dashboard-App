export interface CalendarEvent {
  id: string;
  user_id: string;
  event_id: string | null;
  source: string;
  title: string;
  description: string | null;
  start_time: Date;
  end_time: Date;
  all_day: boolean;
  is_meeting: boolean;
  importance: string | null;
  organizer: string | null;
  attendees: any[] | null;
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
  ms_teams_id: string | null;
  meeting_url: string | null;
  meeting_type: string | null;
  organizer_email: string | null;
  agenda: string | null;
  minutes: string | null;
  action_items: any[] | null; // Consider creating a more specific type for action items
  start_time: Date;
  end_time: Date;
  all_day: boolean;
  importance: string | null;
  attendees: any[] | null;
  recurrence: any | null;
  reminders: any[] | null;
  created_at: Date;
  updated_at: Date;
  last_synced: Date;
}
