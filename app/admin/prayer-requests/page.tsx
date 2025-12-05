"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AlertCircle, Loader, Send, X, Mail } from "lucide-react"

interface PrayerRequest {
  id: string
  full_name: string
  email: string
  phone: string
  prayer_request: string
  is_urgent: boolean
  status: string
  pastor_reply: string | null
  created_at: string
}

export default function PrayerRequestsPage() {
  const [requests, setRequests] = useState<PrayerRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<PrayerRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<PrayerRequest | null>(null)
  const [replyText, setReplyText] = useState("")
  const [sendEmailCopy, setSendEmailCopy] = useState(true)
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [replyMessage, setReplyMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchRequests = async () => {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/admin/login")
        return
      }

      try {
        const { data, error } = await supabase
          .from("prayer_requests")
          .select("*")
          .order("is_urgent", { ascending: false })
          .order("created_at", { ascending: false })

        if (error) throw error
        setRequests(data || [])
        setFilteredRequests(data || [])
      } catch (error) {
        console.error("Error fetching prayer requests:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [router])

  useEffect(() => {
    let filtered = requests

    if (filterStatus !== "all") {
      filtered = filtered.filter((r) => r.status === filterStatus)
    }

    setFilteredRequests(filtered)
  }, [filterStatus, requests])

  const handleReplySubmit = async () => {
    if (!selectedRequest || !replyText.trim()) {
      setReplyMessage({ type: "error", text: "Please enter a reply message" })
      return
    }

    setIsSubmittingReply(true)
    setReplyMessage(null)

    try {
      const response = await fetch("/api/prayer-request/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prayerRequestId: selectedRequest.id,
          replyText: replyText.trim(),
          sendEmail: sendEmailCopy,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit reply")
      }

      // Update local state
      const updatedRequests = requests.map((r) =>
        r.id === selectedRequest.id ? { ...r, status: "answered", pastor_reply: replyText } : r,
      )
      setRequests(updatedRequests)
      setSelectedRequest(null)
      setReplyText("")
      setReplyMessage({
        type: "success",
        text: `Reply saved${sendEmailCopy ? " and email sent to " + selectedRequest.email : ""}`,
      })

      setTimeout(() => setReplyMessage(null), 3000)
    } catch (error) {
      setReplyMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to submit reply",
      })
    } finally {
      setIsSubmittingReply(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Prayer Requests</h1>
        <p className="text-muted-foreground mt-2">
          Total: <span className="font-semibold text-primary">{requests.length}</span> requests
        </p>
      </div>

      {/* Filter */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="answered">Answered</option>
        </select>
      </div>

      {/* Requests List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin text-primary" size={40} />
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-smooth"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    {request.is_urgent && (
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm font-semibold">
                        <AlertCircle size={14} />
                        Urgent
                      </div>
                    )}
                    <h3 className="text-lg font-bold">{request.full_name}</h3>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground mb-4 leading-relaxed">{request.prayer_request}</p>

                  {/* Reply if exists */}
                  {request.pastor_reply && (
                    <div className="mb-4 p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                      <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">Pastor's Reply:</p>
                      <p className="text-green-800 dark:text-green-200">{request.pastor_reply}</p>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <strong>Email:</strong> {request.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {request.phone}
                    </p>
                    <p>
                      <strong>Submitted:</strong> {new Date(request.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex gap-2 min-w-max">
                  {request.status !== "answered" && (
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-smooth flex items-center gap-2"
                    >
                      <Send size={18} />
                      Reply
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No prayer requests found</p>
        </div>
      )}

      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Reply to Prayer Request</h2>
              <button
                onClick={() => {
                  setSelectedRequest(null)
                  setReplyText("")
                  setReplyMessage(null)
                }}
                className="p-2 hover:bg-accent/10 rounded-lg transition-smooth"
              >
                <X size={24} />
              </button>
            </div>

            {/* Prayer Request Summary */}
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mb-6">
              <p className="font-semibold text-foreground mb-2">{selectedRequest.full_name}'s Prayer Request:</p>
              <p className="text-muted-foreground">{selectedRequest.prayer_request}</p>
            </div>

            {/* Reply Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Your Reply</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your pastoral response here..."
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-40"
                />
              </div>

              {/* Send Email Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendEmailCopy}
                  onChange={(e) => setSendEmailCopy(e.target.checked)}
                  className="w-4 h-4 rounded border border-border"
                />
                <span className="text-sm font-medium flex items-center gap-2">
                  <Mail size={16} />
                  Send reply email to {selectedRequest.email}
                </span>
              </label>
            </div>

            {/* Messages */}
            {replyMessage && (
              <div
                className={`p-4 rounded-lg mb-6 text-sm font-medium flex items-center gap-2 ${
                  replyMessage.type === "success"
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                {replyMessage.text}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleReplySubmit}
                disabled={isSubmittingReply || !replyText.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmittingReply ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Submit Reply
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setSelectedRequest(null)
                  setReplyText("")
                  setReplyMessage(null)
                }}
                className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-accent/5 transition-smooth"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
