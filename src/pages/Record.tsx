import { useState, useRef, useEffect, useCallback } from 'react'
import { Mic, StopCircle, Loader, Pause, Play } from 'lucide-react'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import FileNameModal from '../components/FileNameModal'
import VolumeIndicator from '../components/VolumeIndicator'

const Record = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [volume, setVolume] = useState(0)

  const { user } = useAuth()
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const updateVolume = useCallback(() => {
    if (analyserRef.current && dataArrayRef.current && !isPaused) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current)
      const average = dataArrayRef.current.reduce((acc, val) => acc + val, 0) / dataArrayRef.current.length
      setVolume(average)
    }
    animationFrameRef.current = requestAnimationFrame(updateVolume)
  }, [isPaused])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (audioContextRef.current) audioContextRef.current.close()
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(streamRef.current)

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      sourceRef.current = audioContextRef.current.createMediaStreamSource(streamRef.current)
      sourceRef.current.connect(analyserRef.current)
      analyserRef.current.fftSize = 256
      const bufferLength = analyserRef.current.frequencyBinCount
      dataArrayRef.current = new Uint8Array(bufferLength)

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(audioBlob)
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        setIsModalOpen(true)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setIsPaused(false)
      setError(null)
      setSuccess(null)

      timerRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1)
      }, 1000)

      updateVolume()
    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Failed to start recording. Please check your microphone permissions.')
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1)
      }, 1000)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      if (timerRef.current) clearInterval(timerRef.current)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      setVolume(0)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }

  const handleSaveRecording = async (fileName: string) => {
    if (!audioBlob) return

    setIsProcessing(true)
    setError(null)
    setSuccess(null)

    const formattedFileName = fileName.toLowerCase().replace(/\s+/g, '-')
    const uid = uuidv4()
    const finalFileName = `${uid}_${formattedFileName}.webm`
    const filePath = `${user?.id}/${finalFileName}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('audio-recordings')
        .upload(filePath, audioBlob)

      if (uploadError) {
        console.error('Upload Error:', uploadError.message)
        throw uploadError
      }

      const { error: insertError } = await supabase
        .from('recordings')
        .insert({
          user_id: user?.id,
          file_path: filePath,
          duration: recordingTime,
          name: formattedFileName,
        })
        .select()

      if (insertError) {
        console.error('Database Insert Error:', insertError.message)
        throw insertError
      }

      setSuccess('Recording saved successfully!')
      setRecordingTime(0)
      audioChunksRef.current = []
      setAudioBlob(null)
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
        setAudioUrl(null)
      }
    } catch (err: any) {
      console.error('Error saving recording:', err)
      setError(`Failed to save recording: ${err.message}. Please try again.`)
    } finally {
      setIsProcessing(false)
      setIsModalOpen(false)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Record Audio</h1>
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <svg className="w-48 h-48">
              <circle
                className="text-gray-300"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
                r="70"
                cx="96"
                cy="96"
              />
              <circle
                className="text-blue-600"
                strokeWidth="5"
                strokeDasharray={440}
                strokeDashoffset={440 - (recordingTime / 60) * 440}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="70"
                cx="96"
                cy="96"
              />
            </svg>
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold">
              {formatTime(recordingTime)}
            </span>
          </div>
          <VolumeIndicator volume={volume} />
          <div className="flex space-x-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="bg-red-500 text-white p-4 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-110"
                disabled={isProcessing}
              >
                <Mic className="w-8 h-8" />
              </button>
            ) : (
              <>
                {!isPaused ? (
                  <button
                    onClick={pauseRecording}
                    className="bg-yellow-500 text-white p-4 rounded-full hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out"
                  >
                    <Pause className="w-8 h-8" />
                  </button>
                ) : (
                  <button
                    onClick={resumeRecording}
                    className="bg-green-500 text-white p-4 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out"
                  >
                    <Play className="w-8 h-8" />
                  </button>
                )}
                <button
                  onClick={stopRecording}
                  className="bg-gray-500 text-white p-4 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out"
                >
                  <StopCircle className="w-8 h-8" />
                </button>
              </>
            )}
          </div>
        </div>
        {isProcessing && (
          <div className="flex items-center justify-center mt-4">
            <Loader className="w-6 h-6 animate-spin mr-2" />
            <span>Processing recording...</span>
          </div>
        )}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mt-4 text-center">{success}</p>}
      </div>
      <FileNameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRecording}
        audioUrl={audioUrl}
      />
    </div>
  )
}

export default Record
