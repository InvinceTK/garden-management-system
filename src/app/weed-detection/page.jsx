"use client"

import { useEffect, useMemo, useState } from 'react'
import {
  createVpaas,
  createVpaasSignals,
} from '@pexip/vpaas-sdk'
import { Selfview } from '@pexip/media-components'
import { config } from '../../lib/video-config'
import { processImage } from '../actions/processImage'
import { Camera } from 'lucide-react'

let vpaas

export default function Meeting() {
  const [participant, setParticipant] = useState()
  const [localStream, setLocalStream] = useState()
  const [meetingId, setMeetingId] = useState('')
  const [processedImage, setProcessedImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function createMeeting() {
      try {
        const response = await fetch(`${config.server}/meetings`, {
          method: 'POST'
        })
        const data = await response.json()
        setMeetingId(data.id)
      } catch (e) {
        console.log('Cannot create the meeting')
      }
    }
    createMeeting()
  }, [])

  useEffect(() => {
    const bootstrap = async () => {
      if (vpaas == null) {
        vpaas = await createVpaas({ vpaasSignals: createVpaasSignals(), config: {} })
      }
      
      const participant = await fetch(`${config.server}/meetings/${meetingId}/participants`, { method: 'POST' })
        .then(res => res.json())
        .catch(() => null)
      
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setParticipant(participant)
      setLocalStream(localStream)
    }
    
    if (meetingId) {
      bootstrap().catch(console.error)
    }
  }, [meetingId])

  const captureFrame = (videoElement) => {
    const canvas = document.createElement('canvas')
    canvas.width = videoElement.videoWidth
    canvas.height = videoElement.videoHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL('image/jpeg')
    }
    return ''
  }

  const processFrame = async (dataUrl) => {
    try {
      setIsProcessing(true)
      setError(null)
      
      // Convert base64 to blob
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      
      // Create FormData and append the blob
      const formData = new FormData()
      formData.append('image', blob, 'capture.jpg')
      
      // Call the server action
      const result = await processImage(formData)
      
      if (result.success) {
        setProcessedImage(result.processedImage)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCapture = () => {
    const videoElement = document.querySelector('video')
    if (videoElement) {
      const frame = captureFrame(videoElement)
      if (frame) {
        processFrame(frame)
      }
    }
  }

  const selfie = useMemo(() => (
    <Selfview
      className="rounded-lg border border-gray-700 shadow-lg"
      isVideoInputMuted={false}
      shouldShowUserAvatar={false}
      username="User"
      localMediaStream={localStream}
    />
  ), [localStream])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-semibold mb-4">Weed Detection</h1>
      <div className="w-full max-w-4xl bg-gray-800 border border-gray-700 shadow-lg p-4 rounded-lg">
        <div className="relative">
          {localStream && selfie}
          <button
            onClick={handleCapture}
            disabled={isProcessing}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed px-4 py-2 rounded-full flex items-center gap-2 transition-colors"
          >
            <Camera className="w-5 h-5" />
            {isProcessing ? 'Processing...' : 'Take Snapshot'}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 text-center text-red-400">
            Error: {error}
          </div>
        )}
        {processedImage && (
          <div className="mt-4">
            <h2 className="text-xl mb-2">Processed Image:</h2>
            <img 
              src={processedImage} 
              alt="Processed" 
              className="rounded-lg border border-gray-700"
            />
          </div>
        )}
      </div>
    </div>
  )
}