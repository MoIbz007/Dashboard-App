import React, { useCallback } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { CalendarEvent } from '../lib/types'

const localizer = momentLocalizer(moment)

interface EventCalendarProps {
  events: CalendarEvent[]
  onSelectEvent: (event: CalendarEvent) => void
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events, onSelectEvent }) => {
  const getEventStyle = useCallback((event: CalendarEvent) => {
    if (event.type === 'meeting') {
      return { style: { backgroundColor: '#4299e1', borderColor: '#3182ce' } }
    } else if (event.type === 'outlook') {
      return { style: { backgroundColor: '#48bb78', borderColor: '#38a169' } }
    }
    return {}
  }, [])

  return (
    <div className="h-[600px]">
      <Calendar
        localizer={localizer}
        events={events.map((event: CalendarEvent) => ({
          ...event,
          start: new Date(event.start_time),
          end: new Date(event.end_time),
        }))}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        style={{ height: '100%' }}
        eventPropGetter={getEventStyle}
        onSelectEvent={(event) => onSelectEvent(event as CalendarEvent)}
      />
    </div>
  )
}

export default EventCalendar
