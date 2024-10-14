import React from 'react';
import { Eye, Download, Edit3, Trash2, PlusSquare, Link } from 'react-feather';

interface TranscriptActionsMenuProps {
  transcriptId: number;
  onActionClick: (action: string, transcriptId: number) => void;
}

const TranscriptActionsMenu: React.FC<TranscriptActionsMenuProps> = ({ transcriptId, onActionClick }) => {
  return (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        <button
          onClick={() => onActionClick('view', transcriptId)}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          <Eye className="mr-3 h-5 w-5 text-gray-400" /> View
        </button>
        <button
          onClick={() => onActionClick('download', transcriptId)}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          <Download className="mr-3 h-5 w-5 text-gray-400" /> Download
        </button>
        <button
          onClick={() => onActionClick('edit', transcriptId)}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          <Edit3 className="mr-3 h-5 w-5 text-gray-400" /> Edit Tags
        </button>
        <button
          onClick={() => onActionClick('delete', transcriptId)}
          className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
        >
          <Trash2 className="mr-3 h-5 w-5 text-red-400" /> Delete
        </button>
        <button
          onClick={() => onActionClick('createNote', transcriptId)}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          <PlusSquare className="mr-3 h-5 w-5 text-gray-400" /> Create Note
        </button>
        <button
          onClick={() => onActionClick('linkMeeting', transcriptId)}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          <Link className="mr-3 h-5 w-5 text-gray-400" /> Link to Meeting
        </button>
      </div>
    </div>
  );
};

export default TranscriptActionsMenu;
