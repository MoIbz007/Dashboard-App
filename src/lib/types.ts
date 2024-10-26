// Store Types
export interface StoreState {
  threads: Thread[];
  currentThread?: Thread;
  artifacts: Record<string, ArtifactV3>;
  darkMode: boolean;
  threadHistory: Record<string, Message[]>;
  artifactHistory: Record<string, ArtifactV3[]>;
}

export interface StoreActions {
  setThreads: (threads: Thread[]) => void;
  setCurrentThread: (thread: Thread) => void;
  setArtifact: (threadId: string, artifact: ArtifactV3) => void;
  setDarkMode: (enabled: boolean) => void;
  addToThreadHistory: (threadId: string, messages: Message[]) => void;
  addToArtifactHistory: (threadId: string, artifact: ArtifactV3) => void;
  clearHistory: (threadId: string) => void;
  clearAllHistory: () => void;
}

// Cookie Types
export interface CookieOptions {
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

// Artifact Types
export interface ArtifactContentV3 {
  type: string;
  content: any;
  index: number;
  title: string;
}

export interface ArtifactCodeV3 extends ArtifactContentV3 {
  type: 'code';
  language: string;
  code: string;
}

export interface ArtifactMarkdownV3 extends ArtifactContentV3 {
  type: 'text';
  fullMarkdown: string;
}

export interface ArtifactV3 {
  id?: string;
  contents: (ArtifactCodeV3 | ArtifactMarkdownV3)[];
  currentIndex: number;
  title?: string;
  language?: string;
}

// Message Types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  created_at: string;
}

export interface ThreadValues {
  messages?: Message[];
  artifact?: ArtifactV3;
}

export interface Thread {
  id: string;
  messages: Message[];
  created_at: string;
  values?: ThreadValues;
}

// Calendar Event Types
export interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  start_time: string;
  end_time: string;
  type: 'meeting' | 'event';
  source: string;
}

// Recording Types
export interface Recording {
  recording_id: number;
  user_id: string;
  path: string;
  created_at: string;
}

// Programming Language Options
export type ProgrammingLanguageOptions =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'java'
  | 'cpp'
  | 'go'
  | 'rust'
  | 'ruby'
  | 'php'
  | 'html'
  | 'sql';

// Animation Types
export interface AnimationProps {
  initial: Record<string, any>;
  animate: Record<string, any>;
  exit: Record<string, any>;
  transition: Record<string, any>;
}

// Meeting Type
export interface Meeting extends CalendarEvent {}

// Reflection Types
export interface Reflections {
  content?: string[];
  styleRules?: string[];
  assistantId?: string;
}

// Comment Types
export interface Author {
  id: string;
  name: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  author: Author;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface CommentThread {
  id: string;
  text: string;
  status: 'open' | 'resolved';
  comments: Comment[];
}
