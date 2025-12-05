"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BibleViewer } from "@/components/bible-viewer"
import { BookOpen } from "lucide-react"

export default function BiblePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background to-green-50 dark:to-green-950/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <BookOpen className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2 text-balance">
                  King James Bible
                </h1>
                <p className="text-xl text-muted-foreground">Study, Read & Share Scripture</p>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-8">
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Welcome to our online Bible viewer featuring the King James Version (KJV). This timeless translation is
              known for its majestic language and literal accuracy to the original texts.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Use the Bible viewer below to search through books, read chapters, and share verses with your community.
              Copy verses to share on social media or include in your prayers and studies.
            </p>
          </div>

          {/* Bible Viewer */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <BibleViewer />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
