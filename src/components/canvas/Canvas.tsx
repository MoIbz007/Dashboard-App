import { useCallback, useEffect, useState } from 'react';
import { ArtifactRenderer } from './artifacts/ArtifactRenderer';
import { ContentComposer } from './ContentComposer';
import { useGraph } from '../../hooks/use-graph/useGraph';
import { useStore } from '../../hooks/useStore';
import { useThread } from '../../hooks/useThread';
import { getLanguageTemplate } from '../../lib/get_language_template';
import { cn } from '../../lib/utils';
import {
  ArtifactV3,
  ArtifactCodeV3,
  ArtifactMarkdownV3,
  ProgrammingLanguageOptions,
  Thread,
  ThreadValues
} from '../../lib/types';

interface CanvasProps {
  userId: string;
}

export function Canvas({ userId }: CanvasProps) {
  const [chatStarted, setChatStarted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    threadId: rawThreadId,
    assistantId: rawAssistantId,
    createThread,
    searchOrCreateThread,
    deleteThread,
    userThreads,
    isUserThreadsLoading,
    getUserThreads,
    setThreadId,
    getOrCreateAssistant,
    clearThreadsWithNoValues,
  } = useThread(userId);

  // Convert undefined to null for components that expect null
  const threadId = rawThreadId ?? null;
  const assistantId = rawAssistantId ?? null;

  const {
    streamMessage,
    setMessages,
    setArtifact,
    messages,
    setSelectedArtifact,
    setArtifactContent,
    clearState,
    switchSelectedThread,
    artifact,
    setSelectedBlocks,
    isStreaming,
    updateRenderedArtifactRequired,
    setUpdateRenderedArtifactRequired,
    isArtifactSaved,
    firstTokenReceived,
    selectedBlocks,
  } = useGraph({
    userId,
    threadId,
    assistantId,
  });

  const {
    reflections,
    deleteReflections,
    getReflections,
    isLoadingReflections,
  } = useStore({
    assistantId,
    userId,
  });

  // Initialize thread and assistant
  useEffect(() => {
    const initializeCanvas = async () => {
      if (!rawThreadId) {
        await searchOrCreateThread(userId);
      }
      if (!rawAssistantId) {
        await getOrCreateAssistant();
      }
    };
    
    initializeCanvas();
  }, [rawThreadId, rawAssistantId, searchOrCreateThread, getOrCreateAssistant, userId]);

  // Clean up threads with no values
  useEffect(() => {
    if (!rawThreadId) return;
    clearThreadsWithNoValues(userId);
  }, [rawThreadId, clearThreadsWithNoValues, userId]);

  // Load user threads
  useEffect(() => {
    if (!userId || userThreads.length) return;
    getUserThreads(userId);
  }, [userId, userThreads.length, getUserThreads]);

  // Load reflections
  useEffect(() => {
    if (!rawAssistantId) return;
    if (
      (reflections?.content || reflections?.styleRules) &&
      reflections.assistantId === rawAssistantId
    )
      return;

    getReflections();
  }, [rawAssistantId, reflections, getReflections]);

  const createThreadWithChatStarted = useCallback(async () => {
    setChatStarted(false);
    clearState();
    await createThread(userId);
  }, [createThread, clearState, userId]);

  const handleQuickStart = useCallback(
    (type: 'text' | 'code', language?: ProgrammingLanguageOptions) => {
      if (type === 'code' && !language) {
        console.error('Language not selected');
        return;
      }
      setChatStarted(true);

      let artifactContent: ArtifactCodeV3 | ArtifactMarkdownV3;
      const title = `Quick start ${type}`;

      if (type === 'code' && language) {
        const code = getLanguageTemplate(language);
        artifactContent = {
          index: 1,
          type: 'code',
          title,
          code,
          language,
          content: code // content is the same as code for code artifacts
        };
      } else {
        artifactContent = {
          index: 1,
          type: 'text',
          title,
          fullMarkdown: '',
          content: '' // content is the same as fullMarkdown for text artifacts
        };
      }

      const newArtifact: ArtifactV3 = {
        currentIndex: 1,
        contents: [artifactContent],
        title
      };
      setArtifact(newArtifact);
      setIsEditing(true);
    },
    [setArtifact]
  );

  const handleThreadSwitch = useCallback((thread: Thread) => {
    switchSelectedThread(thread, setThreadId);
    const threadValues = thread.values as ThreadValues;
    setChatStarted(!!threadValues?.messages?.length);
  }, [switchSelectedThread, setThreadId]);

  const handleThreadDelete = useCallback(async (id: string) => {
    await deleteThread(id, () => setMessages([]));
  }, [deleteThread, setMessages]);

  const handleSetSelectedArtifact = useCallback((id: string | undefined) => {
    if (id) {
      const index = parseInt(id, 10);
      if (!isNaN(index)) {
        setSelectedArtifact(index);
      }
    }
  }, [setSelectedArtifact]);

  return (
    <main className="h-screen flex flex-row">
      <div
        className={cn(
          'transition-all duration-700',
          chatStarted ? 'w-[35%]' : 'w-full',
          'h-full mr-auto bg-gray-50/70 shadow-inner-right'
        )}
      >
        <ContentComposer
          userId={userId}
          getUserThreads={() => getUserThreads(userId)}
          isUserThreadsLoading={isUserThreadsLoading}
          userThreads={userThreads}
          switchSelectedThread={handleThreadSwitch}
          deleteThread={handleThreadDelete}
          handleGetReflections={getReflections}
          handleDeleteReflections={async () => {
            await deleteReflections();
            return;
          }}
          reflections={reflections}
          isLoadingReflections={isLoadingReflections}
          streamMessage={streamMessage}
          messages={messages}
          setMessages={setMessages}
          createThread={createThreadWithChatStarted}
          setChatStarted={setChatStarted}
          showNewThreadButton={chatStarted}
          handleQuickStart={handleQuickStart}
        />
      </div>
      {chatStarted && artifact && (
        <div className="w-full ml-auto">
          <ArtifactRenderer
            userId={userId}
            firstTokenReceived={firstTokenReceived}
            isArtifactSaved={isArtifactSaved}
            artifact={artifact}
            setArtifact={setArtifact}
            setSelectedBlocks={setSelectedBlocks}
            selectedBlocks={selectedBlocks}
            assistantId={assistantId}
            handleGetReflections={getReflections}
            handleDeleteReflections={async () => {
              await deleteReflections();
              return;
            }}
            reflections={reflections}
            isLoadingReflections={isLoadingReflections}
            setIsEditing={setIsEditing}
            isEditing={isEditing}
            setArtifactContent={setArtifactContent}
            setSelectedArtifact={handleSetSelectedArtifact}
            messages={messages}
            setMessages={setMessages}
            streamMessage={streamMessage}
            isStreaming={isStreaming}
            updateRenderedArtifactRequired={updateRenderedArtifactRequired}
            setUpdateRenderedArtifactRequired={setUpdateRenderedArtifactRequired}
          />
        </div>
      )}
    </main>
  );
}
