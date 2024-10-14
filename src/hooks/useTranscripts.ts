import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Transcript } from '../lib/types';

export const useTranscripts = (user: User | null) => {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [filteredTranscripts, setFilteredTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  const fetchTranscripts = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setError('Please log in to view your transcripts.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('transcripts')
        .select(`
          *,
          meetings (meeting_title),
          recordings!transcripts_recording_id_fkey (name, duration)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transcriptsWithTags = data.map((transcript: Transcript) => ({
        ...transcript,
        tags: transcript.tags || []
      }));

      setTranscripts(transcriptsWithTags);
      setFilteredTranscripts(transcriptsWithTags);

      const tags = Array.from(new Set(transcriptsWithTags.flatMap((t: Transcript) => t.tags.filter((tag): tag is string => tag !== null))));
      setAllTags(tags);
    } catch (error: any) {
      console.error('Error fetching transcripts:', error);
      setError(`Failed to fetch transcripts: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTranscripts();
  }, [fetchTranscripts]);

  return { transcripts, filteredTranscripts, setFilteredTranscripts, loading, error, allTags, fetchTranscripts };
};
