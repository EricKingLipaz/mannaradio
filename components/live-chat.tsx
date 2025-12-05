"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { apiClient } from "@/lib/api/client"
import { Send, Heart, MessageCircle } from "lucide-react"

interface ChatMessage {
  id: string
  username: string
  message: string
  message_type: string
  created_at: string
}

export function LiveChat({ isTV = false }: { isTV?: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [hasUsername, setHasUsername] = useState(false)
  const [isLike, setIsLike] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current
      messagesContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth"
      })
    }
  }

  useEffect(() => {
    const storedUsername = localStorage.getItem("chat-username")
    if (storedUsername) {
      setUsername(storedUsername)
      setHasUsername(true)
    }
    setIsLoading(false)

    fetchMessages()
    const interval = setInterval(fetchMessages, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const data = await apiClient.getChatMessages(50)
      // Only update if messages have changed to avoid unnecessary re-renders
      setMessages(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(data.messages)) {
          return data.messages || []
        }
        return prev
      })
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const handleSetUsername = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      localStorage.setItem("chat-username", username)
      setHasUsername(true)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !username) return

    try {
      await apiClient.postChatMessage(username, newMessage, "text")
      setNewMessage("")
      fetchMessages()
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleLike = async () => {
    if (!username) return

    try {
      await apiClient.postChatMessage(username, "Liked the stream", "like")
      setIsLike(true)
      setTimeout(() => setIsLike(false), 500)
      fetchMessages()
    } catch (error) {
      console.error("Error sending like:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 h-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading chat...</p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col h-full shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageCircle className="text-primary-foreground" size={20} />
          <div>
            <h3 className="font-bold text-primary-foreground">Live Chat</h3>
            <p className="text-xs text-primary-foreground/80">{messages.length} messages</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 text-sm ${msg.message_type === "like" ? "justify-center" : ""}`}
            >
              {msg.message_type === "like" ? (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                  <Heart size={12} fill="currentColor" />
                  <span className="text-xs font-semibold">{msg.username} liked</span>
                </div>
              ) : (
                <>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary-foreground">
                      {msg.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-xs text-primary">{msg.username}</p>
                    <p className="text-foreground break-words">{msg.message}</p>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Username Setup */}
      {!hasUsername ? (
        <form onSubmit={handleSetUsername} className="border-t border-border p-3 space-y-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name to chat..."
            maxLength={20}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:shadow-md transition-smooth"
          >
            Join Chat
          </button>
        </form>
      ) : (
        <form onSubmit={handleSendMessage} className="border-t border-border p-3 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              maxLength={100}
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-md transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
            <button
              type="button"
              onClick={handleLike}
              className={`px-3 py-2 rounded-lg transition-smooth ${isLike ? "bg-red-500 text-white" : "bg-secondary/20 text-secondary hover:bg-secondary/30"
                }`}
            >
              <Heart size={18} fill={isLike ? "currentColor" : "none"} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Logged in as: <span className="font-semibold text-primary">{username}</span>
          </p>
        </form>
      )}
    </div>
  )
}
