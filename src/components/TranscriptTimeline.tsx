import React from 'react'
import { FileText } from 'lucide-react'

interface Transcript {
  transcript_id: number
  created_at: string
  meetings?: { meeting_title: string | null }
  recordings?: { name: string | null; duration: number | null }
}

interface TranscriptTimelineProps {
  transcripts: Transcript[]
  onActionClick: (e: React.MouseEvent, transcriptId: number) => void
}

const TranscriptTimeline: React.FC<TranscriptTimelineProps> = ({ transcripts, onActionClick }) => {
  return (
    <div className="relative">
      <div className="absolute left-1/2 w-0.5 h-full bg-gray-200 transform -translate-x-1/2"></div>
      {transcripts.map((transcript, index) => (
        <div key={transcript.transcript_id} className={`mb-8 flex justify-${index % 2 === 0 ? 'start' : 'end'}`}>
          <div className="relative w-1/2">
            <div className={`absolute top-0 ${index % 2 === 0 ? '-right-6' : '-left-6'} w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center`}>
              <FileText className="text-white" />
            </div>
            <div className={`p-4 bg-white rounded shadow ${index % 2 === 0 ? 'mr-8' : 'ml-8'}`}>
              <h3 className="text-lg font-semibold">
                {transcript.meetings?.meeting_title || transcript.recordings?.name || 'Untitled Transcript'}
              </h3>
              <p className="text-sm text-gray-500">{new Date(transcript.created_at).toLocaleString()}</p>
              <button
                onClick={(e) => onActionClick(e, transcript.transcript_id)}
                className="mt-2 text-blue-500 hover:text-blue-700"
              >
                Actions
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TranscriptTimeline
