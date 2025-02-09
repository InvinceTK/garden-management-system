"use client"

import { useEffect, useMemo, useState } from 'react'
import { createVpaas, createVpaasSignals } from '@pexip/vpaas-sdk'
import { Selfview } from '@pexip/media-components'
import { config } from '../../lib/video-config'
import { processImage } from '../actions/processImage'
import { Camera, AlertTriangle, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

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
      
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      
      const formData = new FormData()
      formData.append('image', blob, 'capture.jpg')
      
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
      className="rounded-lg shadow-lg w-full aspect-video object-cover"
      isVideoInputMuted={false}
      shouldShowUserAvatar={false}
      username="User"
      localMediaStream={localStream}
    />
  ), [localStream])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent opacity-40" />
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-4">
              Weed Detection System
            </h1>
            <p className="text-lg text-zinc-400">
              Real-time garden monitoring and weed identification
            </p>
          </div>

          <Card className="bg-zinc-900 border-green-500/20 hover:border-green-500/40 transition-all w-full mx-auto flex justify-center">
            <CardContent className="p-6">
              <div className="relative rounded-lg overflow-hidden w-full max-w-5xl mx-auto">
                {localStream && selfie}
                <button
                  onClick={handleCapture}
                  disabled={isProcessing}
                  className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 hover:bg-green-500 disabled:bg-green-800 disabled:cursor-not-allowed px-6 py-3 rounded-full flex items-center gap-3 transition-all shadow-lg hover:shadow-green-500/20"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                  <span className="font-semibold">
                    {isProcessing ? 'Processing...' : 'Take Snapshot'}
                  </span>
                </button>
              </div>
              
              {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Error: {error}</span>
                </div>
              )}
              
              {processedImage && (
                <div className="mt-6">
                  <h2 className="text-2xl font-semibold text-green-400 mb-4">Analysis Results</h2>
                  <div className="rounded-lg overflow-hidden border border-green-500/20">
                    <img 
                      src={processedImage} 
                      alt="Processed" 
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}