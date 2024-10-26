import React from 'react';
import { Select } from '../ui/select/Select';
import { ProgrammingLanguageOptions } from '../../lib/types';

const PROGRAMMING_LANGUAGES = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'ruby', label: 'Ruby' },
] as const;

interface ProgrammingLangDropdownProps {
  value: ProgrammingLanguageOptions;
  onChange: (value: ProgrammingLanguageOptions) => void;
  className?: string;
}

export function ProgrammingLangDropdown({
  value,
  onChange,
  className,
}: ProgrammingLangDropdownProps) {
  return (
    <Select
      value={value}
      onChange={(newValue) => onChange(newValue as ProgrammingLanguageOptions)}
      options={PROGRAMMING_LANGUAGES}
      className={className}
    />
  );
}
