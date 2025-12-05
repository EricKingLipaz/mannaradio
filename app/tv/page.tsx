"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useState } from "react"

export default function TVPage() {
  const [isPlaying, setIsPlaying] = useState(true)

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background to-primary/10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2 text-balance">
              Manna TV
            </h1>
            <p className="text-xl text-muted-foreground">Watch Our Live Sermons & Worship</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-2xl p-2 shadow-xl overflow-hidden">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/videoseries?list=PLOoRTn_YGC9vFTsYINkbV6lNMts52EPbA&modestbranding=1&controls=1&showinfo=0&rel=0"
                    title="Manna TV"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Video Info */}
              <div className="mt-8 bg-card border border-border rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-4">Live Sermons & Teachings</h3>
                <p className="text-muted-foreground mb-4">
                  Watch our complete video series featuring powerful sermons, worship sessions, and spiritual teachings
                  from Manna Temple Church.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm font-semibold text-primary">Sermons</p>
                    <p className="text-2xl font-bold mt-2">Weekly</p>
                  </div>
                  <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                    <p className="text-sm font-semibold text-secondary">Worship</p>
                    <p className="text-2xl font-bold mt-2">Daily</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold mb-4 text-primary">Community & Events</h3>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Join us for live worship and spiritual teachings every week. Check our prayer requests and connect
                    with our community.
                  </p>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs font-semibold text-primary mb-2">UPCOMING</p>
                    <p className="text-sm font-bold">Sunday Service</p>
                    <p className="text-xs text-muted-foreground">10 AM - 1 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
