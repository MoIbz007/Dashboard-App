import React, { useEffect, useRef, useState } from 'react';
import { EditorState, TextSelection } from '../lib/types';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Type, Quote, MessageCircle } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  editorState: EditorState;
  onChange: (content: string) => void;
  onEditorStateChange: (state: EditorState) => void;
  onAddComment: (selection: TextSelection) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  editorState,
  onChange,
  onEditorStateChange,
  onAddComment,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showCommentButton, setShowCommentButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        if (editorRef.current?.contains(range.commonAncestorContainer)) {
          const rect = range.getBoundingClientRect();
          setButtonPosition({
            x: rect.right + 10,
            y: rect.top + (rect.height / 2),
          });
          setShowCommentButton(true);
          
          const start = getTextOffset(range.startContainer, range.startOffset);
          const end = getTextOffset(range.endContainer, range.endOffset);
          
          onEditorStateChange({
            ...editorState,
            selection: {
              position: { start, end },
              text: range.toString(),
            },
          });
        }
      } else {
        setShowCommentButton(false);
        onEditorStateChange({
          ...editorState,
          selection: null,
        });
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [editorState, onEditorStateChange]);

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

  const handleAddComment = () => {
    if (editorState.selection) {
      onAddComment(editorState.selection);
      setShowCommentButton(false);
    }
  };

  const formatClassName = () => {
    const classes = ['min-h-[500px] p-8 focus:outline-none prose max-w-none'];
    if (editorState.bold) classes.push('font-bold');
    if (editorState.italic) classes.push('italic');
    if (editorState.underline) classes.push('underline');
    if (editorState.align) classes.push(`text-${editorState.align}`);
    return classes.join(' ');
  };

  return (
    <div className="relative bg-white rounded-lg shadow-sm">
      <div
        ref={editorRef}
        contentEditable
        className={formatClassName()}
        onInput={(e) => onChange(e.currentTarget.textContent || '')}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      {showCommentButton && (
        <button
          className="absolute bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          style={{
            left: buttonPosition.x,
            top: buttonPosition.y,
            transform: 'translate(0, -50%)',
          }}
          onClick={handleAddComment}
        >
          <MessageCircle className="w-4 h-4" />
        </button>
      )}

      {editorState.commentThreads.map((thread) => (
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

export default RichTextEditor;
