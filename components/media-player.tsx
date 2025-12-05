"use client"

import { useEffect } from "react"

interface MediaPlayerProps {
  streamUrl: string
  type: "audio" | "video"
  onPlayStart?: () => void
  onPlayStop?: () => void
}

export function MediaPlayer({ streamUrl, type, onPlayStart, onPlayStop }: MediaPlayerProps) {
  useEffect(() => {
    // Listen for media stream changes
    const handleMediaChange = (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail?.activeStream !== type) {
        onPlayStop?.()
      }
    }

    window.addEventListener("mediaStreamChange", handleMediaChange)
    return () => {
      window.removeEventListener("mediaStreamChange", handleMediaChange)
    }
  }, [type, onPlayStop])

  return null // Component is used for coordination
}
