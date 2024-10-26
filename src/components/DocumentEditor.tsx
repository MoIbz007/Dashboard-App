import React, { useRef, useEffect, useState } from 'react';
import { EditorState, TextSelection } from '../lib/types';
import { Plus, Edit } from 'lucide-react';

interface DocumentEditorProps {
  state: EditorState;
  onChange: (state: EditorState) => void;
  onAddComment: (selection: TextSelection) => void;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  state,
  onChange,
  onAddComment,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [selection, setSelection] = useState<{
    position: { top: number; left: number };
    isVisible: boolean;
    text: string;
  }>({
    position: { top: 0, left: 0 },
    isVisible: false,
    text: ''
  });

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== state.content) {
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      const cursorPosition = range?.startOffset || 0;
      
      editorRef.current.innerHTML = state.content;
      
      if (selection && range && editorRef.current.firstChild) {
        range.setStart(editorRef.current.firstChild, cursorPosition);
        range.setEnd(editorRef.current.firstChild, cursorPosition);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, [state.content]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || !editorRef.current) return;

      if (selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        if (editorRef.current.contains(range.commonAncestorContainer)) {
          const rect = range.getBoundingClientRect();
          const editorRect = editorRef.current.getBoundingClientRect();
          
          setSelection({
            position: {
              top: rect.top - editorRect.top,
              left: rect.right - editorRect.left
            },
            isVisible: true,
            text: range.toString()
          });
          
          const start = getTextOffset(range.startContainer, range.startOffset);
          const end = getTextOffset(range.endContainer, range.endOffset);
          
          onChange({
            ...state,
            selection: {
              position: { start, end },
              text: range.toString(),
            },
          });
        }
      } else {
        setSelection(prev => ({ ...prev, isVisible: false }));
        onChange({
          ...state,
          selection: null,
        });
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [state, onChange]);

  const getTextOffset = (node: Node, offset: number): number => {
    let totalOffset = 0;
    const walker = document.createTreeWalker(
      editorRef.current!,
      NodeFilter.SHOW_TEXT,
      null
    );

    while (walker.nextNode()) {
      if (walker.currentNode === node) {
        return totalOffset + offset;
      }
      totalOffset += walker.currentNode.textContent?.length || 0;
    }

    return totalOffset;
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange({
      ...state,
      content: e.currentTarget.innerHTML
    });
  };

  const handleSuggestEdit = () => {
    // Implement edit suggestion functionality
    console.log('Suggesting edit for:', selection.text);
  };

  return (
    <div 
      className="relative bg-white rounded-lg shadow-sm"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[500px] p-8 focus:outline-none prose max-w-none"
        onInput={handleInput}
      />
      
      {/* Floating + button on hover */}
      {isHovering && !selection.isVisible && (
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-sm 
                     hover:shadow-md transition-shadow duration-200 text-gray-600"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}

      {/* Selection toolbar */}
      {selection.isVisible && (
        <div className="absolute flex flex-col items-center gap-2 bg-white rounded-lg shadow-lg p-2"
             style={{
               right: '0',
               top: selection.position.top,
               transform: 'translateX(calc(100% + 1rem))',
             }}>
          <button
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Suggest edits button */}
      {selection.isVisible && (
        <button
          className="absolute bg-gray-900 text-white px-3 py-1.5 rounded-md text-sm"
          style={{
            left: selection.position.left + 8,
            top: selection.position.top + 24,
          }}
          onClick={handleSuggestEdit}
        >
          Suggest edits
        </button>
      )}

      {state.commentThreads.map((thread) => (
        <div
          key={thread.id}
          className="absolute bg-yellow-100 opacity-30 pointer-events-none"
          style={{
            left: 0,
            top: `${thread.selection.position.start}px`,
            height: `${thread.selection.position.end - thread.selection.position.start}px`,
            width: '100%',
          }}
        />
      ))}
    </div>
  );
};

export default DocumentEditor;
