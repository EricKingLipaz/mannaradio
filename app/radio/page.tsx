"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import { Volume2, Pause, Play } from "lucide-react"
import dynamic from "next/dynamic"

const LiveChat = dynamic(() => import("@/components/live-chat").then((mod) => ({ default: mod.LiveChat })), {
  ssr: false,
})

export default function RadioPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null)

  const radioStreamUrl = "https://stream-39.zeno.fm/huvatsbzum0uv?zs=QdJvFjEeQ3-JTdgAopEWpg"

  useEffect(() => {
    return () => {
      if (audioRef) {
        audioRef.pause()
      }
    }
  }, [audioRef])

  const togglePlayPause = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause()
      } else {
        audioRef.play().catch((err) => console.error("Playback error:", err))
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleAudioRef = (element: HTMLAudioElement) => {
    setAudioRef(element)
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2 text-balance">
              Manna Radio
            </h1>
            <p className="text-xl text-muted-foreground">24/7 Streaming Inspiration</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Player */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
                <div className="relative overflow-hidden rounded-xl mb-8 bg-gradient-to-br from-purple-600 to-pink-600 h-64 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full blur-2xl" />
                    <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full blur-2xl" />
                  </div>
                  <Volume2 className="text-white" size={80} />
                </div>

                {/* Now Playing Info */}
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold mb-2">Live Stream</h2>
                  <p className="text-muted-foreground text-lg">{isPlaying ? "Now Playing" : "Ready to Play"}</p>
                </div>

                {/* Player Controls */}
                <div className="flex items-center justify-center gap-6 mb-8">
                  <audio ref={handleAudioRef} src={radioStreamUrl} onEnded={() => setIsPlaying(false)} />
                  <button
                    onClick={togglePlayPause}
                    className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground flex items-center justify-center hover:shadow-lg transition-smooth hover:scale-105"
                  >
                    {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                  </button>
                </div>

                {/* Info Box */}

              </div>

              {/* About Radio */}
              <div className="mt-8 bg-card border border-border rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-4">About Our Radio Station</h3>
                <p className="text-muted-foreground mb-4">
                  Manna Radio brings you inspiring music, powerful teachings, and spiritual growth 24 hours a day, 7
                  days a week. Join our community of listeners worldwide as we share the message of hope and faith.
                </p>
                <p className="text-muted-foreground">
                  Whether you're starting your day, commuting, or seeking spiritual guidance, Manna Radio is here to
                  uplift your spirit with quality content from Manna Temple Church.
                </p>
              </div>
            </div>

            {/* Live Chat Sidebar */}
            <div className="lg:col-span-1">
              <div className="h-96 md:h-[600px]">
                <LiveChat />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
