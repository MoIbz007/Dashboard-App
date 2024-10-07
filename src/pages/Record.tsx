import React, { useState, useRef, useEffect } from 'react'
import { Mic, StopCircle } from 'lucide-react'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

const Record = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingName, setRecordingName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { user } = useAuth()
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = handleRecordingStop

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setError(null)

      timerRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1)
      }, 1000)
    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Failed to start recording. Please check your microphone permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const handleRecordingStop = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
    const fileName = `${uuidv4()}.webm`
    const filePath = `audio-recordings/private/${user?.id}/${fileName}`

    try {
      const { data, error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(filePath, audioBlob)

      if (uploadError) throw uploadError

      const { data: recordingData, error: insertError } = await supabase
        .from('recordings')
        .insert({
          user_id: user?.id,
          file_path: filePath,
          duration: recordingTime,
          name: recordingName || 'Untitled Recording',
        })
        .select()  // This line is added to select the inserted data

      if (insertError) throw insertError

      setSuccess('Recording saved successfully!')
      setRecordingName('')
      setRecordingTime(0)
      audioChunksRef.current = []
    } catch (err) {
      console.error('Error saving recording:', err)
      setError('Failed to save recording. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Record Audio</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Recording Name"
          value={recordingName}
          onChange={(e) => setRecordingName(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-center items-center space-x-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              <Mic className="w-6 h-6" />
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              <StopCircle className="w-6 h-6" />
            </button>
          )}
        </div>
        {isRecording && (
          <p className="text-center mt-4 text-xl font-semibold text-gray-700">
            Recording: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
          </p>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </div>
    </div>
  )
}

export default Record
