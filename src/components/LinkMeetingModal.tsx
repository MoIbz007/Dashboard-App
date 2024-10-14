import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Meeting } from '../lib/types';

interface LinkMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLink: (meetingId: string) => void;
  userId: string;
  transcriptId: number;
}

const LinkMeetingModal: React.FC<LinkMeetingModalProps> = ({ isOpen, onClose, onLink, userId, transcriptId }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [linkingStatus, setLinkingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchMeetings();
    }
  }, [isOpen, userId]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching meetings for user:', userId);
      console.log('Current timestamp:', new Date().toISOString());

      const query = supabase
        .from('meetings')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false });

      // Log query details
      console.log('Query details:', {
        table: 'meetings',
        select: '*',
        filter: `user_id = ${userId}`,
        order: 'start_time DESC'
      });

      const { data, error } = await query;

      console.log('Query execution complete');
      console.log('Error:', error);
      console.log('Raw data received:', data);

      if (error) {
        throw error;
      }

      console.log('Fetched meetings:', data);
      console.log('Number of meetings found:', data ? data.length : 0);

      setMeetings(data || []);
      console.log('State updated with meetings:', data || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      setError('Failed to fetch meetings. Please try again.');
    } finally {
      setLoading(false);
      console.log('Loading state set to false');
    }
  };

  const handleLinkMeeting = async (meetingId: string) => {
    try {
      setLinkingStatus('Linking transcript to meeting...');
      const { data, error } = await supabase
        .from('transcripts')
        .update({ meeting_id: meetingId })
        .eq('transcript_id', transcriptId);

      if (error) {
        throw error;
      }

      console.log('Transcript linked successfully:', data);
      setLinkingStatus('Transcript linked successfully!');
      onLink(meetingId);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error linking transcript to meeting:', error);
      setLinkingStatus('Failed to link transcript. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Link Transcript to Meeting</h3>
          <div className="mt-2 px-7 py-3">
            {loading && <p>Loading meetings...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {linkingStatus && <p className={linkingStatus.includes('Failed') ? 'text-red-500' : 'text-green-500'}>{linkingStatus}</p>}
            {!loading && !error && meetings.length === 0 && (
              <p>No meetings found. Create a meeting first. (User ID: {userId})</p>
            )}
            {!loading && !error && meetings.length > 0 && (
              <ul className="max-h-60 overflow-y-auto">
                {meetings.map((meeting) => (
                  <li
                    key={meeting.id}
                    className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                    onClick={() => handleLinkMeeting(meeting.id)}
                  >
                    {meeting.meeting_type || 'Untitled Meeting'} - {new Date(meeting.start_time).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkMeetingModal;
