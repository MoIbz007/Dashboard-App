import React, { useCallback, useEffect, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import styles from './CodeRenderer.module.css';
import { ArtifactCodeV3 } from '../../../lib/types';

interface CodeRendererProps {
  content: ArtifactCodeV3;
  onChange: (value: string) => void;
  isEditing: boolean;
  selectedBlocks: string[];
  setSelectedBlocks: (blocks: string[]) => void;
}

export function CodeRenderer({
  content,
  onChange,
  isEditing,
  selectedBlocks,
  setSelectedBlocks,
}: CodeRendererProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = useCallback((editor: any) => {
    editorRef.current = editor;
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;
    
    const handleSelectionChange = () => {
      if (!isEditing) return;
      
      const selection = editorRef.current.getSelection();
      if (!selection) return;
      
      const selectedText = editorRef.current.getModel().getValueInRange(selection);
      if (!selectedText) {
        setSelectedBlocks([]);
        return;
      }
      
      setSelectedBlocks([selectedText]);
    };

    editorRef.current.onDidChangeCursorSelection(handleSelectionChange);
    
    return () => {
      if (editorRef.current?.dispose) {
        editorRef.current.dispose();
      }
    };
  }, [isEditing, setSelectedBlocks]);

  return (
    <motion.div
      className={cn(
        styles.codeRenderer,
        'h-full w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700',
        isEditing ? 'cursor-text' : 'cursor-default'
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Editor
        height="100%"
        defaultLanguage={content.language}
        value={content.code}
        onChange={(value) => onChange(value || '')}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          readOnly: !isEditing,
          wordWrap: 'on',
          theme: 'vs-dark',
        }}
        onMount={handleEditorDidMount}
      />
    </motion.div>
  );
}
