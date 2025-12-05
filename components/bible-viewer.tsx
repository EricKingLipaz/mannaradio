"use client"

import { useState } from "react"
import { Copy, Share2 } from "lucide-react"

// King James Bible - Sample books for demonstration
const BIBLE_BOOKS = {
  genesis: {
    name: "Genesis",
    chapters: 50,
    verses: {
      1: [
        "In the beginning God created the heaven and the earth.",
        "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
        "And God said, Let there be light: and there was light.",
      ],
    },
  },
  exodus: {
    name: "Exodus",
    chapters: 40,
    verses: {
      1: [
        "Now these are the names of the children of Israel, which came into Egypt; every man and his household came with Jacob.",
        "Joseph, Benjamin, Naphtali, and Asher:",
        "And the number of all the persons was threescore and ten souls: for Joseph was in Egypt already.",
      ],
    },
  },
  psalms: {
    name: "Psalms",
    chapters: 150,
    verses: {
      23: [
        "The LORD is my shepherd; I shall not want.",
        "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
        "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
        "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
        "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.",
        "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.",
      ],
    },
  },
  john: {
    name: "John",
    chapters: 21,
    verses: {
      3: [
        "Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.",
        "Nicodemus saith unto him, How can a man be born when he is old? can he enter the second time into his mother's womb, and be born?",
        "Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God.",
      ],
    },
  },
}

export function BibleViewer() {
  const [selectedBook, setSelectedBook] = useState<string>("psalms")
  const [selectedChapter, setSelectedChapter] = useState<number>(23)
  const [expandedVerse, setExpandedVerse] = useState<number | null>(null)
  const [copiedVerse, setCopiedVerse] = useState<string | null>(null)

  const book = BIBLE_BOOKS[selectedBook as keyof typeof BIBLE_BOOKS]
  const verses = book?.verses[selectedChapter as keyof typeof book.verses] || []

  const copyToClipboard = (verseText: string, index: number) => {
    const text = `${book?.name} ${selectedChapter}:${index + 1} - ${verseText}`
    navigator.clipboard.writeText(text)
    setCopiedVerse(`${index + 1}`)
    setTimeout(() => setCopiedVerse(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Book Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Object.entries(BIBLE_BOOKS).map(([key, value]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedBook(key)
              setSelectedChapter(1)
            }}
            className={`p-3 rounded-lg font-semibold transition-smooth text-sm ${
              selectedBook === key
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-card border border-border hover:border-primary"
            }`}
          >
            {value.name}
          </button>
        ))}
      </div>

      {/* Chapter Selection */}
      {book && (
        <div>
          <label className="block text-sm font-semibold mb-2">Chapter</label>
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(Number(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
          >
            {Array.from({ length: book.chapters }, (_, i) => i + 1).map((ch) => (
              <option key={ch} value={ch}>
                {book.name} {ch}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Verses Display */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold mb-4">
          {book?.name} {selectedChapter}
        </h3>

        {verses.length > 0 ? (
          verses.map((verse, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-smooth group"
            >
              <div className="flex gap-3">
                <span className="font-bold text-primary flex-shrink-0 w-8">{index + 1}</span>
                <div className="flex-1">
                  <p className="text-foreground leading-relaxed">{verse}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-smooth">
                <button
                  onClick={() => copyToClipboard(verse, index)}
                  className="flex items-center gap-1 text-xs px-3 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-smooth"
                >
                  <Copy size={14} />
                  {copiedVerse === `${index + 1}` ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => {
                    const shareText = `${book?.name} ${selectedChapter}:${index + 1} - ${verse}`
                    if (navigator.share) {
                      navigator.share({
                        title: "Bible Verse",
                        text: shareText,
                      })
                    }
                  }}
                  className="flex items-center gap-1 text-xs px-3 py-1 rounded bg-secondary/10 text-secondary hover:bg-secondary/20 transition-smooth"
                >
                  <Share2 size={14} />
                  Share
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Verses not available for this chapter. Please select another chapter.
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Tip:</strong> Click on any verse to copy it to your clipboard or share it with others.
        </p>
      </div>
    </div>
  )
}
