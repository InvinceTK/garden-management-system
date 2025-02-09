"use client"

import { useEffect, useMemo, useState } from 'react'
import {
  createVpaas,
  createVpaasSignals,
} from '@pexip/vpaas-sdk'
import { config } from '../../lib/video-config'
import { Selfview } from '@pexip/media-components'

import './Live.css'

let vpaas

export default function Meeting () {
  const [participant, setParticipant] = useState()
  const [localStream, setLocalStream] = useState()
  const [meetingId, setMeetingId] = useState('');

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
    createMeeting();
  }, []);

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
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg');
    }
    return '';
  };

  useEffect(() => {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      const intervalId = setInterval(() => {
        const frame = captureFrame(videoElement);
        if (frame) {
          fetch(`${config.server}/weed-detection`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: frame })
          }).then(res => res.json()).then(console.log)
        }
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [localStream, meetingId]);

  const selfie = useMemo(() => (
    <Selfview
      className="rounded-lg border border-gray-700 shadow-lg"
      isVideoInputMuted={false}
      shouldShowUserAvatar={false}
      username="User"
      localMediaStream={localStream}
    />
  ), [localStream]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-semibold mb-4">Weed Detection</h1>
      <div className="w-full max-w-4xl bg-gray-800 border border-gray-700 shadow-lg p-4 rounded-lg">
        {localStream && selfie}
      </div>
    </div>
  )
}
