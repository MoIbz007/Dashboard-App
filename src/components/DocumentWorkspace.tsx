import React, { useState } from 'react';
import { Document, EditorState, Comment, TextSelection, CommentThread } from '../lib/types';
import DocumentEditor from './DocumentEditor';
import CommentPanel from './CommentPanel';

interface DocumentWorkspaceProps {
  document?: Document;
  onSave?: (document: Document) => void;
}

const DocumentWorkspace: React.FC<DocumentWorkspaceProps> = ({
  document: initialDocument,
  onSave,
}) => {
  const [editorState, setEditorState] = useState<EditorState>(() => ({
    content: initialDocument?.content || '',
    selection: null,
    commentThreads: [],
    activeThread: null,
    bold: false,
    italic: false,
    underline: false,
    align: 'left',
  }));

  const [showComments] = useState(true);

  const handleEditorChange = (newState: EditorState) => {
    setEditorState(newState);
    if (onSave && initialDocument) {
      onSave({
        ...initialDocument,
        content: newState.content,
        updated_at: new Date().toISOString(),
      });
    }
  };

  const handleAddComment = (selection: TextSelection) => {
    const timestamp = new Date().toISOString();
    const newThread: CommentThread = {
      id: Date.now().toString(),
      selection,
      text: selection.text,
      comments: [{
        id: Date.now().toString(),
        author: {
          id: '1',
          name: 'Current User',
        },
        content: '',
        text: selection.text,
        createdAt: timestamp,
        timestamp: timestamp,
        replies: [],
        status: 'active',
      }],
      status: 'open',
      createdAt: timestamp,
    };

    setEditorState(prev => ({
      ...prev,
      commentThreads: [...prev.commentThreads, newThread],
      activeThread: newThread.id,
    }));
  };

  const handleResolveComment = (threadId: string) => {
    setEditorState(prev => ({
      ...prev,
      commentThreads: prev.commentThreads.map(thread =>
        thread.id === threadId
          ? { ...thread, status: thread.status === 'open' ? 'resolved' : 'open' }
          : thread
      ),
    }));
  };

  const handleAddReply = (threadId: string, content: string) => {
    const timestamp = new Date().toISOString();
    const newComment: Comment = {
      id: Date.now().toString(),
      author: {
        id: '1',
        name: 'Current User',
      },
      content,
      text: content,
      createdAt: timestamp,
      timestamp: timestamp,
      replies: [],
      status: 'active',
    };

    setEditorState(prev => ({
      ...prev,
      commentThreads: prev.commentThreads.map(thread =>
        thread.id === threadId
          ? { ...thread, comments: [...thread.comments, newComment] }
          : thread
      ),
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 overflow-hidden flex">
        <div className={`flex-1 p-6 ${showComments ? 'mr-96' : ''}`}>
          <DocumentEditor
            state={editorState}
            onChange={handleEditorChange}
            onAddComment={handleAddComment}
          />
        </div>

        {showComments && (
          <CommentPanel
            threads={editorState.commentThreads}
            activeThreadId={editorState.activeThread}
            onThreadClick={(threadId) => setEditorState(prev => ({
              ...prev,
              activeThread: threadId,
            }))}
            onResolve={handleResolveComment}
            onReply={handleAddReply}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentWorkspace;
