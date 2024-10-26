import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import DocumentEditor from './DocumentEditor';
import { EditorState, TextSelection } from '../lib/types';

interface WorkspaceEditorProps {
  editorState: EditorState;
  onStateChange: (state: EditorState) => void;
  onAddComment: (selection: TextSelection) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const WorkspaceEditor: React.FC<WorkspaceEditorProps> = ({
  editorState,
  onStateChange,
  onAddComment,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const newWidth = Math.max(200, Math.min(600, e.clientX));
    setSidebarWidth(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className={`flex flex-col h-full bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowToolbar(!showToolbar)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {showToolbar ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
          {showToolbar && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onStateChange({ ...editorState, bold: !editorState.bold })}
                className={`p-2 rounded ${editorState.bold ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              >
                B
              </button>
              <button
                onClick={() => onStateChange({ ...editorState, italic: !editorState.italic })}
                className={`p-2 rounded ${editorState.italic ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              >
                I
              </button>
              <button
                onClick={() => onStateChange({ ...editorState, underline: !editorState.underline })}
                className={`p-2 rounded ${editorState.underline ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              >
                U
              </button>
              <div className="h-6 w-px bg-gray-300 mx-2" />
              <select
                value={editorState.align}
                onChange={(e) => onStateChange({ ...editorState, align: e.target.value as any })}
                className="p-2 rounded border hover:bg-gray-100"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
          )}
        </div>
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 p-6">
          <DocumentEditor
            state={editorState}
            onChange={onStateChange}
            onAddComment={onAddComment}
          />
        </div>

        {/* Resizable sidebar */}
        <div
          className="relative"
          style={{ width: sidebarWidth }}
        >
          <div
            className="absolute left-0 top-0 w-1 h-full cursor-ew-resize bg-transparent hover:bg-gray-300 transition-colors"
            onMouseDown={handleMouseDown}
          />
          <div className="h-full bg-white border-l overflow-y-auto">
            {/* Sidebar content */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900">Document Properties</h3>
              {/* Add document properties here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceEditor;
