import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ActionsToolbar } from './actions_toolbar/ActionsToolbar';
import { CodeRenderer } from './CodeRenderer';
import { TextRenderer } from './TextRenderer';
import { cn } from '../../../lib/utils';
import {
  ArtifactV3,
  ArtifactContentV3,
  Reflections,
} from '../../../lib/types';

interface ArtifactRendererProps {
  userId: string;
  artifact?: ArtifactV3;
  setArtifact: (artifact: ArtifactV3) => void;
  setSelectedBlocks: (blocks: string[]) => void;
  selectedBlocks: string[];
  assistantId?: string;
  handleGetReflections: () => void;
  handleDeleteReflections: () => void;
  reflections?: Reflections;
  isLoadingReflections: boolean;
  setIsEditing: (isEditing: boolean) => void;
  isEditing: boolean;
  setArtifactContent: (content: ArtifactContentV3) => void;
  setSelectedArtifact: (id: string | undefined) => void;
  messages: any[];
  setMessages: (messages: any[]) => void;
  streamMessage: (message: string) => Promise<void>;
  isStreaming: boolean;
  updateRenderedArtifactRequired: boolean;
  setUpdateRenderedArtifactRequired: (required: boolean) => void;
  firstTokenReceived?: boolean;
  isArtifactSaved?: boolean;
}

export function ArtifactRenderer({
  userId,
  artifact,
  setArtifact,
  setSelectedBlocks,
  selectedBlocks,
  assistantId,
  handleGetReflections,
  handleDeleteReflections,
  reflections,
  isLoadingReflections,
  setIsEditing,
  isEditing,
  setArtifactContent,
  setSelectedArtifact,
  messages,
  setMessages,
  streamMessage,
  isStreaming,
  updateRenderedArtifactRequired,
  setUpdateRenderedArtifactRequired,
  firstTokenReceived,
  isArtifactSaved,
}: ArtifactRendererProps) {
  const [showToolbar, setShowToolbar] = useState(false);
  const [currentContent, setCurrentContent] = useState<ArtifactContentV3>();

  useEffect(() => {
    if (!artifact) return;
    const content = artifact.contents.find(
      (content) => content.index === artifact.currentIndex
    );
    setCurrentContent(content);
  }, [artifact]);

  const handleContentChange = useCallback(
    (newContent: string) => {
      if (!currentContent || !artifact) return;

      const updatedContent = {
        ...currentContent,
        ...(currentContent.type === 'code'
          ? { code: newContent }
          : { fullMarkdown: newContent }),
      };

      const updatedContents = artifact.contents.map((content) =>
        content.index === currentContent.index ? updatedContent : content
      );

      setArtifact({
        ...artifact,
        contents: updatedContents,
      });
    },
    [currentContent, artifact, setArtifact]
  );

  if (!artifact || !currentContent) {
    return null;
  }

  return (
    <div className="relative h-full w-full">
      <motion.div
        className={cn(
          'h-full w-full overflow-auto bg-white dark:bg-gray-900',
          isEditing && 'cursor-text'
        )}
        onHoverStart={() => setShowToolbar(true)}
        onHoverEnd={() => setShowToolbar(false)}
      >
        {currentContent.type === 'code' ? (
          <CodeRenderer
            content={currentContent}
            onChange={handleContentChange}
            isEditing={isEditing}
            selectedBlocks={selectedBlocks}
            setSelectedBlocks={setSelectedBlocks}
          />
        ) : (
          <TextRenderer
            content={currentContent}
            onChange={handleContentChange}
            isEditing={isEditing}
            selectedBlocks={selectedBlocks}
            setSelectedBlocks={setSelectedBlocks}
          />
        )}
      </motion.div>

      <ActionsToolbar
        userId={userId}
        show={showToolbar}
        artifact={artifact}
        currentContent={currentContent}
        setArtifact={setArtifact}
        assistantId={assistantId}
        handleGetReflections={handleGetReflections}
        handleDeleteReflections={handleDeleteReflections}
        reflections={reflections}
        isLoadingReflections={isLoadingReflections}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
        setArtifactContent={setArtifactContent}
        setSelectedArtifact={setSelectedArtifact}
        messages={messages}
        setMessages={setMessages}
        streamMessage={streamMessage}
        isStreaming={isStreaming}
        updateRenderedArtifactRequired={updateRenderedArtifactRequired}
        setUpdateRenderedArtifactRequired={setUpdateRenderedArtifactRequired}
        firstTokenReceived={firstTokenReceived}
        isArtifactSaved={isArtifactSaved}
      />
    </div>
  );
}
