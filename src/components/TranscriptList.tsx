import React, { useState } from 'react';
import { FileText, MoreVertical } from 'react-feather';
import { Transcript } from '../lib/types';
import TranscriptActionsMenu from './TranscriptActionsMenu';

interface TranscriptListProps {
  transcripts: Transcript[];
  onActionClick: (action: string, transcriptId: number) => void;
}

const TranscriptList: React.FC<TranscriptListProps> = ({ transcripts, onActionClick }) => {
  const [hoveredTranscript, setHoveredTranscript] = useState<number | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const getContentPreview = (content: string | null) => {
    if (!content) return 'No content available';
    return content.slice(0, 100) + (content.length > 100 ? '...' : '');
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-visible">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transcripts.map((transcript: Transcript) => (
            <tr key={transcript.transcript_id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <FileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
                  <div className="ml-4 relative">
                    <div
                      className="text-sm font-medium text-gray-900 cursor-pointer"
                      onMouseEnter={() => setHoveredTranscript(transcript.transcript_id)}
                      onMouseLeave={() => setHoveredTranscript(null)}
                    >
                      {transcript.meetings?.meeting_title || transcript.recordings?.name || 'Untitled Transcript'}
                    </div>
                    {hoveredTranscript === transcript.transcript_id && (
                      <div className="absolute z-10 p-2 bg-gray-100 rounded shadow-lg mt-1">
                        {getContentPreview(transcript.content)}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{new Date(transcript.created_at).toLocaleDateString()}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {transcript.recordings?.duration ? `${Math.round(transcript.recordings.duration / 60)} mins` : 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {transcript.tags.map((tag: string) => (
                    <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="relative">
                  <button
                    onClick={() => setActiveMenu(activeMenu === transcript.transcript_id ? null : transcript.transcript_id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  {activeMenu === transcript.transcript_id && (
                    <TranscriptActionsMenu
                      transcriptId={transcript.transcript_id}
                      onActionClick={onActionClick}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TranscriptList;
