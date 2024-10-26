import { useState, useCallback } from 'react';
import { Message, ArtifactV3, ArtifactContentV3, GraphInput } from '../../lib/types';
import { convertToOpenAIFormat } from '../../lib/convert_messages';

interface UseGraphProps {
  userId: string;
  threadId: string | null;
  assistantId: string | null;
}

export function useGraph({ userId, threadId, assistantId }: UseGraphProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [artifact, setArtifact] = useState<ArtifactV3 | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [updateRenderedArtifactRequired, setUpdateRenderedArtifactRequired] = useState(false);
  const [isArtifactSaved, setIsArtifactSaved] = useState(true);
  const [firstTokenReceived, setFirstTokenReceived] = useState(false);

  const streamMessage = useCallback(async (input: GraphInput) => {
    if (!threadId || !assistantId) return;
    
    setIsStreaming(true);
    setFirstTokenReceived(false);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId,
          assistantId,
          userId,
          messages: input.messages.map(convertToOpenAIFormat),
          highlightedCode: input.highlightedCode,
        }),
      });

      if (!response.ok) throw new Error('Stream request failed');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        try {
          const data = JSON.parse(chunk);
          if (data.type === 'token') {
            if (!firstTokenReceived) setFirstTokenReceived(true);
            // Handle token update
          } else if (data.type === 'artifact') {
            setArtifact(data.artifact);
          }
        } catch (e) {
          console.error('Error parsing chunk:', e);
        }
      }
    } catch (error) {
      console.error('Error streaming message:', error);
    } finally {
      setIsStreaming(false);
    }
  }, [threadId, assistantId, userId, firstTokenReceived]);

  const setArtifactContent = useCallback((content: ArtifactContentV3) => {
    if (!artifact) return;
    
    const updatedContents = artifact.contents.map(c =>
      c.index === artifact.currentIndex ? content : c
    );

    setArtifact({
      ...artifact,
      contents: updatedContents,
    });
    setIsArtifactSaved(false);
  }, [artifact]);

  const setSelectedArtifact = useCallback((index: number) => {
    if (!artifact) return;
    setArtifact({
      ...artifact,
      currentIndex: index,
    });
  }, [artifact]);

  const clearState = useCallback(() => {
    setMessages([]);
    setArtifact(null);
    setSelectedBlocks([]);
    setIsStreaming(false);
    setUpdateRenderedArtifactRequired(false);
    setIsArtifactSaved(true);
    setFirstTokenReceived(false);
  }, []);

  const switchSelectedThread = useCallback((thread: any, setThreadId: (id: string) => void) => {
    clearState();
    if (thread.values?.messages) {
      setMessages(thread.values.messages);
    }
    if (thread.values?.artifact) {
      setArtifact(thread.values.artifact);
    }
    setThreadId(thread.id);
  }, [clearState]);

  return {
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
  };
}
