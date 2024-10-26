import React, { useState } from 'react';
import { X, Plus, Layout, Sidebar as SidebarIcon } from 'lucide-react';
import { WorkspaceState, Tab, TextSelection, Comment, EditorState } from '../lib/types';
import WorkspaceEditor from '../components/WorkspaceEditor';
import CommentPanel from '../components/CommentPanel';

const MyWorkspace: React.FC = () => {
  const [workspace, setWorkspace] = useState<WorkspaceState>({
    tabs: [
      {
        id: '1',
        title: 'New Document',
        type: 'document',
        editorState: {
          content: '',
          selection: null,
          commentThreads: [],
          activeThread: null,
          bold: false,
          italic: false,
          underline: false,
          align: 'left',
        },
      },
    ],
    activeTab: '1',
    showComments: true,
    isEditing: true,
    patientName: '',
    language: 'en',
    isTranscribing: false,
    transcriptionTime: 0,
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const addTab = (type: Tab['type'] = 'document') => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: 'New Document',
      type,
      editorState: {
        content: '',
        selection: null,
        commentThreads: [],
        activeThread: null,
        bold: false,
        italic: false,
        underline: false,
        align: 'left',
      },
    };

    setWorkspace(prev => ({
      ...prev,
      tabs: [newTab, ...prev.tabs],
      activeTab: newTab.id,
    }));
  };

  const removeTab = (id: string) => {
    setWorkspace(prev => {
      const newTabs = prev.tabs.filter(tab => tab.id !== id);
      return {
        ...prev,
        tabs: newTabs,
        activeTab: id === prev.activeTab ? newTabs[0]?.id || '' : prev.activeTab,
      };
    });
  };

  const updateEditorState = (editorState: EditorState) => {
    setWorkspace(prev => ({
      ...prev,
      tabs: prev.tabs.map(tab =>
        tab.id === prev.activeTab ? { ...tab, editorState } : tab
      ),
    }));
  };

  const handleAddComment = (selection: TextSelection) => {
    const timestamp = new Date().toISOString();
    const newThread = {
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
        createdAt: timestamp,
        replies: [],
        status: 'active' as const,
        text: selection.text,
        timestamp: timestamp
      }],
      status: 'open' as const,
      createdAt: timestamp,
    };

    setWorkspace(prev => {
      const activeTab = prev.tabs.find(tab => tab.id === prev.activeTab);
      if (!activeTab) return prev;

      return {
        ...prev,
        tabs: prev.tabs.map(tab =>
          tab.id === prev.activeTab
            ? {
                ...tab,
                editorState: {
                  ...tab.editorState,
                  commentThreads: [...tab.editorState.commentThreads, newThread],
                  activeThread: newThread.id,
                },
              }
            : tab
        ),
        showComments: true,
      };
    });
  };

  const handleResolveComment = (threadId: string) => {
    setWorkspace(prev => {
      const activeTab = prev.tabs.find(tab => tab.id === prev.activeTab);
      if (!activeTab) return prev;

      return {
        ...prev,
        tabs: prev.tabs.map(tab =>
          tab.id === prev.activeTab
            ? {
                ...tab,
                editorState: {
                  ...tab.editorState,
                  commentThreads: tab.editorState.commentThreads.map(thread =>
                    thread.id === threadId
                      ? { ...thread, status: thread.status === 'open' ? 'resolved' : 'open' }
                      : thread
                  ),
                },
              }
            : tab
        ),
      };
    });
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
      createdAt: timestamp,
      replies: [],
      status: 'active',
      text: content,
      timestamp: timestamp
    };

    setWorkspace(prev => {
      const activeTab = prev.tabs.find(tab => tab.id === prev.activeTab);
      if (!activeTab) return prev;

      return {
        ...prev,
        tabs: prev.tabs.map(tab =>
          tab.id === prev.activeTab
            ? {
                ...tab,
                editorState: {
                  ...tab.editorState,
                  commentThreads: tab.editorState.commentThreads.map(thread =>
                    thread.id === threadId
                      ? { ...thread, comments: [...thread.comments, newComment] }
                      : thread
                  ),
                },
              }
            : tab
        ),
      };
    });
  };

  const activeTab = workspace.tabs.find(tab => tab.id === workspace.activeTab);

  return (
    <div className={`flex h-screen bg-gray-100 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Left Sidebar */}
      <div className={`bg-white border-r transition-all duration-200 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="p-4 border-b">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg w-full flex items-center justify-center"
          >
            <Layout className="w-5 h-5" />
          </button>
        </div>
        {/* Add sidebar content here */}
      </div>

      <div className="flex flex-col flex-grow overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <SidebarIcon className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">Workspace</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-white px-1">
          {workspace.tabs.map((tab) => (
            <div
              key={tab.id}
              className={`
                flex items-center px-4 py-2 cursor-pointer text-sm
                transition-colors duration-150 ease-in-out
                ${workspace.activeTab === tab.id
                  ? 'border-b-2 border-purple-500 text-purple-600 font-medium bg-purple-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}
              `}
              onClick={() => setWorkspace(prev => ({ ...prev, activeTab: tab.id }))}
            >
              {tab.title}
              {workspace.tabs.length > 1 && (
                <X
                  className="ml-2 w-4 h-4 text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTab(tab.id);
                  }}
                />
              )}
            </div>
          ))}
          <button
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors duration-150 ease-in-out"
            onClick={() => addTab()}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          {activeTab && (
            <WorkspaceEditor
              editorState={activeTab.editorState}
              onStateChange={updateEditorState}
              onAddComment={handleAddComment}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            />
          )}
        </div>
      </div>

      {/* Comment Panel */}
      {workspace.showComments && activeTab && (
        <div className="w-96 border-l bg-white">
          <CommentPanel
            threads={activeTab.editorState.commentThreads}
            activeThreadId={activeTab.editorState.activeThread}
            onThreadClick={(threadId) => updateEditorState({
              ...activeTab.editorState,
              activeThread: threadId,
            })}
            onResolve={handleResolveComment}
            onReply={handleAddReply}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </div>
      )}
    </div>
  );
};

export default MyWorkspace;
