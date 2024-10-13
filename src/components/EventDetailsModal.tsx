import React from 'react';
import moment from 'moment';
import { CalendarEvent } from '../lib/types';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ isOpen, onClose, event }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{event.title}</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              {moment(event.start_time).format('MMMM D, YYYY h:mm A')} -{' '}
              {moment(event.end_time).format('h:mm A')}
            </p>
            {event.description && (
              <p className="text-sm text-gray-700 mt-2">{event.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Type: {event.is_meeting ? 'Meeting' : event.source}
            </p>
            <p className="text-sm text-gray-500">
              Importance: {event.importance || 'Not specified'}
            </p>
            {event.organizer && (
              <p className="text-sm text-gray-500">Organizer: {event.organizer}</p>
            )}
            {event.attendees && event.attendees.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Attendees:</p>
                <ul className="list-disc list-inside">
                  {event.attendees.map((attendee, index) => (
                    <li key={index} className="text-sm text-gray-500">{attendee}</li>
                  ))}
                </ul>
              </div>
            )}
            {event.recurrence && (
              <p className="text-sm text-gray-500 mt-2">Recurrence: {event.recurrence}</p>
            )}
            {event.reminders && event.reminders.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Reminders:</p>
                <ul className="list-disc list-inside">
                  {event.reminders.map((reminder, index) => (
                    <li key={index} className="text-sm text-gray-500">{reminder}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="items-center px-4 py-3">
          <button
            id="ok-btn"
            className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
