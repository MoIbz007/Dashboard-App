import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

interface PlaybackComponentProps {
  filePath: string
  onPlayStateChange: (isPlaying: boolean) => void
}

const PlaybackComponent: React.FC<PlaybackComponentProps> = ({ filePath, onPlayStateChange }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const fetchAudioFile = async () => {
      try {
        const { data, error } = await supabase.storage
          .from('recordings')
          .createSignedUrl(filePath, 3600) // URL valid for 1 hour

        if (error) throw error

        if (audioRef.current) {
          audioRef.current.src = data.signedUrl
        }
      } catch (error) {
        console.error('Error fetching audio file:', error)
        setError('Failed to load audio file. Please try again later.')
      }
    }

    fetchAudioFile()
  }, [filePath])

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
      onPlayStateChange(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    onPlayStateChange(false)
  }

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
      setIsPlaying(true)
      onPlayStateChange(true)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="flex flex-col items-center">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      <div className="flex items-center space-x-2">
        <button
          onClick={togglePlayPause}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={handleRestart}
          className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          <RotateCcw size={24} />
        </button>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
      <div className="w-full mt-2 bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}

export default PlaybackComponent