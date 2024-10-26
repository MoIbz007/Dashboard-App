import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../../../lib/utils';
import styles from './TextRenderer.module.css';
import { ArtifactMarkdownV3 } from '../../../lib/types';

interface TextRendererProps {
  content: ArtifactMarkdownV3;
  onChange: (value: string) => void;
  isEditing: boolean;
  selectedBlocks: string[];
  setSelectedBlocks: (blocks: string[]) => void;
}

export function TextRenderer({
  content,
  onChange,
  isEditing,
  selectedBlocks,
  setSelectedBlocks,
}: TextRendererProps) {
  const handleTextSelection = useCallback(() => {
    if (!isEditing) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setSelectedBlocks([]);
      return;
    }
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (!selectedText) {
      setSelectedBlocks([]);
      return;
    }
    
    setSelectedBlocks([selectedText]);
  }, [isEditing, setSelectedBlocks]);

  return (
    <motion.div
      className={cn(
        styles.textRenderer,
        'prose prose-sm dark:prose-invert max-w-none h-full w-full overflow-auto p-4',
        isEditing ? 'cursor-text' : 'cursor-default'
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseUp={handleTextSelection}
    >
      {isEditing ? (
        <textarea
          className="h-full w-full resize-none bg-transparent p-0 focus:outline-none"
          value={content.fullMarkdown}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className="whitespace-pre-wrap"
        >
          {content.fullMarkdown}
        </ReactMarkdown>
      )}
    </motion.div>
  );
}
