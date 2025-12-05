"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PrayerRequestForm } from "@/components/prayer-form"
import { Heart } from "lucide-react"

export default function PrayerRequestPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background to-red-50 dark:to-red-950/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                <Heart className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2 text-balance">
                  Prayer Requests
                </h1>
                <p className="text-xl text-muted-foreground">Share your prayers with our community</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Prayer Warriors Unite</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              At Manna Temple Church, we believe in the power of prayer. We have dedicated prayer warriors who intercede
              for our community daily. Your pastor and prayer team are ready to lift your prayer requests to the throne
              of God.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Submit your prayer request below, and our prayer team will intercede on your behalf. Whether your request
              is personal, for family, or for our community, we are here to support you in prayer.
            </p>
          </div>

          {/* Prayer Form */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-8">Submit Your Prayer Request</h2>
            <PrayerRequestForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
