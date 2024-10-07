import React, { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, List } from 'lucide-react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { getMeetings, Meeting } from '../lib/supabaseService'

const localizer = momentLocalizer(moment)

interface Event {
  id: number
  title: string
  start: Date
  end: Date
}

const MyCalendar = () => {
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    fetchMeetings()
  }, [])

  async function fetchMeetings() {
    try {
      const meetings = await getMeetings()
      const formattedEvents = meetings.map((meeting: Meeting) => ({
        id: meeting.meeting_id!,
        title: meeting.meeting_title,
        start: new Date(meeting.date_time),
        end: new Date(new Date(meeting.date_time).getTime() + (meeting.duration || 0) * 60000),
      }))
      setEvents(formattedEvents)
    } catch (error) {
      console.error('Error fetching meetings:', error)
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
      </div>
      {view === 'list' ? (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800">{event.title}</h2>
              <p className="text-gray-600">
                {moment(event.start).format('MMMM D, YYYY h:mm A')} -{' '}
                {moment(event.end).format('h:mm A')}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[600px]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
          />
        </div>
      )}
    </div>
  )
}

export default MyCalendar