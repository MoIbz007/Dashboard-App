import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { Button } from '../../../ui/button';
import { Select } from '../../../ui/select/Select';
import { Switch } from '../../../ui/switch/Switch';
import {
  ArtifactV3,
  ArtifactContentV3,
  Reflections,
  ProgrammingLanguageOptions,
  SelectProps
} from '../../../../lib/types';

interface SettingsPanelProps {
  artifact: ArtifactV3;
  currentContent: ArtifactContentV3;
  onClose: () => void;
  setSelectedArtifact: (index: number) => void;
  handleGetReflections: () => Promise<void>;
  handleDeleteReflections: () => Promise<boolean>;
  reflections?: Reflections;
  isLoadingReflections: boolean;
}

const languageOptions = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'ruby', label: 'Ruby' },
] as const;

export function SettingsPanel({
  artifact,
  currentContent,
  onClose,
  setSelectedArtifact,
  handleGetReflections,
  handleDeleteReflections,
  reflections,
  isLoadingReflections,
}: SettingsPanelProps) {
  const [autoSave, setAutoSave] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [language, setLanguage] = React.useState<ProgrammingLanguageOptions>(
    currentContent.type === 'code' ? currentContent.language : 'typescript'
  );

  const handleLanguageChange = (value: string) => {
    setLanguage(value as ProgrammingLanguageOptions);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 space-y-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Settings</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          {currentContent.type === 'code' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select
                value={language}
                onChange={handleLanguageChange}
                options={languageOptions}
                className="w-full"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Auto Save</label>
            <Switch
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Dark Mode</label>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // TODO: Save settings
              onClose();
            }}
          >
            Save Changes
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
