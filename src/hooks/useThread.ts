import { useState, useCallback } from 'react';
import { Thread, Message } from '../lib/types';
import { supabase } from '../lib/supabaseClient';

interface UseThreadProps {
  userId: string;
}

export function useThread(userId: string) {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const [userThreads, setUserThreads] = useState<Thread[]>([]);
  const [isUserThreadsLoading, setIsUserThreadsLoading] = useState(false);

  const createThread = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('threads')
        .insert([{ user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      setThreadId(data.id);
      return data;
    } catch (error) {
      console.error('Error creating thread:', error);
      return undefined;
    }
  }, []);

  const searchOrCreateThread = useCallback(async (userId: string) => {
    try {
      const { data: existingThread, error: searchError } = await supabase
        .from('threads')
        .select()
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (searchError && searchError.code !== 'PGRST116') {
        throw searchError;
      }

      if (existingThread) {
        setThreadId(existingThread.id);
        return existingThread;
      }

      return createThread(userId);
    } catch (error) {
      console.error('Error searching/creating thread:', error);
      return undefined;
    }
  }, [createThread]);

  const deleteThread = useCallback(async (id: string, onSuccess?: () => void) => {
    try {
      const { error } = await supabase
        .from('threads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      if (onSuccess) onSuccess();
      await getUserThreads(userId);
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
  }, [userId]);

  const getUserThreads = useCallback(async (userId: string) => {
    setIsUserThreadsLoading(true);
    try {
      const { data, error } = await supabase
        .from('threads')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserThreads(data || []);
    } catch (error) {
      console.error('Error fetching user threads:', error);
    } finally {
      setIsUserThreadsLoading(false);
    }
  }, []);

  const getOrCreateAssistant = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('assistants')
        .select()
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setAssistantId(data.id);
        return data;
      }

      const { data: newAssistant, error: createError } = await supabase
        .from('assistants')
        .insert([{}])
        .select()
        .single();

      if (createError) throw createError;
      setAssistantId(newAssistant.id);
      return newAssistant;
    } catch (error) {
      console.error('Error getting/creating assistant:', error);
      return undefined;
    }
  }, []);

  const clearThreadsWithNoValues = useCallback(async (userId: string) => {
    try {
      const { error } = await supabase
        .from('threads')
        .delete()
        .eq('user_id', userId)
        .is('values', null);

      if (error) throw error;
    } catch (error) {
      console.error('Error clearing empty threads:', error);
    }
  }, []);

  return {
    threadId,
    assistantId,
    createThread,
    searchOrCreateThread,
    deleteThread,
    userThreads,
    isUserThreadsLoading,
    getUserThreads,
    setThreadId,
    getOrCreateAssistant,
    clearThreadsWithNoValues,
  };
}
