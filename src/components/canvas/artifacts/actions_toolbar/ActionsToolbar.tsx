import React, { useState } from 'react';
import { 
  Save, 
  Edit2, 
  Copy, 
  FileText,
  Code,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Settings,
  Check,
} from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { 
  ArtifactV3, 
  ArtifactContentV3,
  Reflections,
  ButtonVariant 
} from '../../../../lib/types';
import { TooltipIconButton } from '../../../ui/icon-button/TooltipIconButton';
import { SettingsPanel } from './SettingsPanel';

interface ActionsToolbarProps {
  artifact: ArtifactV3;
  currentContent: ArtifactContentV3;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  isArtifactSaved: boolean;
  setSelectedArtifact: (index: number) => void;
  handleGetReflections: () => Promise<void>;
  handleDeleteReflections: () => Promise<boolean>;
  reflections?: Reflections;
  isLoadingReflections: boolean;
}

export function ActionsToolbar({
  artifact,
  currentContent,
  isEditing,
  setIsEditing,
  isArtifactSaved,
  setSelectedArtifact,
  handleGetReflections,
  handleDeleteReflections,
  reflections,
  isLoadingReflections,
}: ActionsToolbarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handlePrevious = () => {
    const currentIndex = artifact.contents.findIndex(
      (content) => content.index === artifact.currentIndex
    );
    if (currentIndex > 0) {
      setSelectedArtifact(artifact.contents[currentIndex - 1].index);
    }
  };

  const handleNext = () => {
    const currentIndex = artifact.contents.findIndex(
      (content) => content.index === artifact.currentIndex
    );
    if (currentIndex < artifact.contents.length - 1) {
      setSelectedArtifact(artifact.contents[currentIndex + 1].index);
    }
  };

  const handleCopy = async () => {
    setIsCopying(true);
    try {
      const textToCopy = currentContent.type === 'code' 
        ? currentContent.code 
        : currentContent.fullMarkdown;
      await navigator.clipboard.writeText(textToCopy);
    } catch (error) {
      console.error('Failed to copy content:', error);
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="border-b bg-white px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Navigation */}
          <TooltipIconButton
            tooltip="Previous"
            onClick={handlePrevious}
            disabled={artifact.currentIndex === artifact.contents[0].index}
            className={cn(
              'transition-colors',
              artifact.currentIndex === artifact.contents[0].index
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700'
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </TooltipIconButton>

          <TooltipIconButton
            tooltip="Next"
            onClick={handleNext}
            disabled={artifact.currentIndex === artifact.contents[artifact.contents.length - 1].index}
            className={cn(
              'transition-colors',
              artifact.currentIndex === artifact.contents[artifact.contents.length - 1].index
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700'
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </TooltipIconButton>

          {/* Content Type Indicator */}
          <div className="px-3 py-1 rounded-md bg-gray-100 flex items-center space-x-2">
            {currentContent.type === 'code' ? (
              <>
                <Code className="w-4 h-4" />
                <span className="text-sm font-medium">{currentContent.language}</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Text</span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {!isArtifactSaved && (
            <div className="text-sm text-yellow-600 mr-2">Unsaved changes</div>
          )}

          <TooltipIconButton
            tooltip="Copy content"
            onClick={handleCopy}
            loading={isCopying}
          >
            <Copy className="w-5 h-5" />
          </TooltipIconButton>

          <TooltipIconButton
            tooltip={isEditing ? 'Save changes' : 'Edit content'}
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? 'default' : 'ghost'}
          >
            {isEditing ? <Check className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
          </TooltipIconButton>

          <TooltipIconButton
            tooltip="Settings"
            onClick={() => setShowSettings(!showSettings)}
            variant={showSettings ? 'default' : 'ghost'}
          >
            <Settings className="w-5 h-5" />
          </TooltipIconButton>

          {!isLoadingReflections && (
            <TooltipIconButton
              tooltip="Refresh reflections"
              onClick={handleGetReflections}
            >
              <RotateCcw className="w-5 h-5" />
            </TooltipIconButton>
          )}
        </div>
      </div>

      {showSettings && (
        <SettingsPanel
          artifact={artifact}
          currentContent={currentContent}
          onClose={() => setShowSettings(false)}
          setSelectedArtifact={setSelectedArtifact}
          handleGetReflections={handleGetReflections}
          handleDeleteReflections={handleDeleteReflections}
          reflections={reflections}
          isLoadingReflections={isLoadingReflections}
        />
      )}
    </div>
  );
}
