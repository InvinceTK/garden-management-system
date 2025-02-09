import { LocalStorageKey } from '../types/LocalStorageKey'


export const filterMediaDevices = async (
  devices
) => {
  const videoInputId = localStorage.getItem(LocalStorageKey.VideoInputKey)
  const audioInputId = localStorage.getItem(LocalStorageKey.AudioInputKey)
  const audioOutputId = localStorage.getItem(LocalStorageKey.AudioOutputKey)

  let videoInput = devices.find((device) => device.deviceId === videoInputId)
  let audioInput = devices.find((device) => device.deviceId === audioInputId)
  let audioOutput = devices.find((device) => device.deviceId === audioOutputId)

  if (videoInput == null) {
    videoInput = devices.find((device) => device.kind === 'videoinput')
  }

  if (audioInput == null) {
    audioInput = devices.find((device) => device.kind === 'audioinput')
  }

  if (audioOutput == null) {
    audioOutput = devices.find((device) => device.kind === 'audiooutput')
  }

  return {
    videoInput,
    audioInput,
    audioOutput
  }
}
