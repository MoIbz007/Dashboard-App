import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../components/AuthProvider'
import { Recording } from '../lib/types'

export const useRecordings = () => {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [filteredRecordings, setFilteredRecordings] = useState<Recording[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const { user } = useAuth()

  const fetchRecordings = useCallback(async () => {
    if (!user) {
      setLoading(false)
      setError('Please log in to view your recordings.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('recordings')
        .select('*, tags(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (!data) {
        setRecordings([])
        setFilteredRecordings([])
      } else {
        const formattedRecordings: Recording[] = data.map(recording => ({
          ...recording,
          tags: recording.tags ? recording.tags.map((tag: any) => tag.name) : []
        }))
        setRecordings(formattedRecordings)
        setFilteredRecordings(formattedRecordings)
      }
    } catch (error: any) {
      console.error('Error fetching recordings:', error)
      setError(`Failed to fetch recordings: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }, [user])

  const fetchTags = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('name')
        .order('name')

      if (error) throw error

      if (data) {
        const tags = data.map(tag => tag.name)
        setAllTags(tags)
      }
    } catch (error: any) {
      console.error('Error fetching tags:', error)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchRecordings()
      fetchTags()
    }
  }, [user, fetchRecordings, fetchTags])

  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredRecordings(recordings)
    } else {
      const filtered = recordings.filter(recording =>
        selectedTags.every(tag => recording.tags && recording.tags.includes(tag))
      )
      setFilteredRecordings(filtered)
    }
  }, [selectedTags, recordings])

  const handleAddTag = (tag: string) => {
    setSelectedTags([...selectedTags, tag])
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag))
  }

  return {
    recordings,
    filteredRecordings,
    loading,
    error,
    selectedTags,
    allTags,
    fetchRecordings,
    fetchTags,
    handleAddTag,
    handleRemoveTag,
  }
}
