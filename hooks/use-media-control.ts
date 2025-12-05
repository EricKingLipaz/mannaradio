"use client"

import { useState, useCallback } from "react"

export function useMediaControl() {
  const [activeStream, setActiveStream] = useState<"radio" | "tv" | null>(null)

  const stopOtherStreams = useCallback(async (currentStream: "radio" | "tv") => {
    // Store in localStorage for cross-tab communication
    localStorage.setItem("active-stream", currentStream)

    // Update local state
    setActiveStream(currentStream)

    // Notify other streams to stop
    window.dispatchEvent(
      new CustomEvent("mediaStreamChange", {
        detail: { activeStream: currentStream },
      }),
    )
  }, [])

  const checkActiveStream = useCallback(
    (stream: "radio" | "tv") => {
      return activeStream === stream
    },
    [activeStream],
  )

  return { stopOtherStreams, checkActiveStream, activeStream }
}
