import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ArtifactV3, Message, Thread } from './types';

interface StoreState {
  threads: Thread[];
  currentThread?: Thread;
  artifacts: Record<string, ArtifactV3>;
  darkMode: boolean;
  threadHistory: Record<string, Message[]>;
  artifactHistory: Record<string, ArtifactV3[]>;
}

interface StoreActions {
  setThreads: (threads: Thread[]) => void;
  setCurrentThread: (thread: Thread) => void;
  setArtifact: (threadId: string, artifact: ArtifactV3) => void;
  setDarkMode: (enabled: boolean) => void;
  addToThreadHistory: (threadId: string, messages: Message[]) => void;
  addToArtifactHistory: (threadId: string, artifact: ArtifactV3) => void;
  clearHistory: (threadId: string) => void;
  clearAllHistory: () => void;
}

export const useStore = create<StoreState & StoreActions>()(
  persist(
    (set) => ({
      threads: [],
      artifacts: {},
      darkMode: false,
      threadHistory: {},
      artifactHistory: {},

      setThreads: (threads) => set({ threads }),
      setCurrentThread: (thread) => set({ currentThread: thread }),
      setArtifact: (threadId, artifact) =>
        set((state) => ({
          artifacts: { ...state.artifacts, [threadId]: artifact },
        })),
      setDarkMode: (enabled) => set({ darkMode: enabled }),

      addToThreadHistory: (threadId, messages) =>
        set((state) => ({
          threadHistory: {
            ...state.threadHistory,
            [threadId]: [...(state.threadHistory[threadId] || []), ...messages],
          },
        })),

      addToArtifactHistory: (threadId, artifact) =>
        set((state) => ({
          artifactHistory: {
            ...state.artifactHistory,
            [threadId]: [...(state.artifactHistory[threadId] || []), artifact],
          },
        })),

      clearHistory: (threadId) =>
        set((state) => ({
          threadHistory: {
            ...state.threadHistory,
            [threadId]: [],
          },
          artifactHistory: {
            ...state.artifactHistory,
            [threadId]: [],
          },
        })),

      clearAllHistory: () =>
        set({
          threadHistory: {},
          artifactHistory: {},
        }),
    }),
    {
      name: 'canvas-store',
      partialize: (state) => ({
        darkMode: state.darkMode,
        threadHistory: state.threadHistory,
        artifactHistory: state.artifactHistory,
      }),
    }
  )
);
