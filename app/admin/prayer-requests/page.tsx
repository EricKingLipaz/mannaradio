"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api/client"
import { MessageSquare, Calendar, User, Mail, Phone, CheckCircle, Clock, Send, Loader } from "lucide-react"

interface PrayerRequest {
  id: number
  full_name: string
  email: string
  phone: string
  prayer_request: string
  is_urgent: boolean
  status: 'pending' | 'replied'
  created_at: string
  replies?: PrayerRequestReply[]
}

interface PrayerRequestReply {
  id: number
  reply_text: string
  created_at: string
  pastor_name?: string
}

export default function PrayerRequestsPage() {
  const [requests, setRequests] = useState<PrayerRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'replied'>('all')
  const [selectedRequest, setSelectedRequest] = useState<PrayerRequest | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isSendingReply, setIsSendingReply] = useState(false)

  const fetchRequests = async () => {
    setIsLoading(true)
    try {
      const data = await apiClient.getPrayerRequests()
      setRequests(data.prayer_requests || [])
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRequest || !replyText.trim()) return

    setIsSendingReply(true)
    try {
      await apiClient.replyToPrayerRequest(selectedRequest.id, replyText)

      // Refresh requests and close modal
      await fetchRequests()
      setSelectedRequest(null)
      setReplyText("")
    } catch (error) {
      console.error("Error sending reply:", error)
      alert("Failed to send reply. Please try again.")
    } finally {
      setIsSendingReply(false)
    }
  }

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true
    return req.status === filter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Prayer Requests</h1>
          <p className="text-muted-foreground">Manage and reply to prayer requests</p>
        </div>

        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'pending'
              ? 'bg-orange-500 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('replied')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'replied'
              ? 'bg-green-500 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            Replied
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading requests...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No {filter !== 'all' ? filter : ''} prayer requests found.
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border transition-all cursor-pointer hover:shadow-md ${req.is_urgent
                ? 'border-red-200 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10'
                : 'border-gray-200 dark:border-gray-700'
                }`}
              onClick={() => setSelectedRequest(req)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${req.is_urgent ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'
                    }`}>
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{req.full_name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar size={14} />
                      <span>{formatDate(req.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${req.status === 'replied'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                  {req.status === 'replied' ? <CheckCircle size={12} /> : <Clock size={12} />}
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 line-clamp-2 mb-4">
                {req.prayer_request}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                {req.is_urgent && (
                  <span className="text-red-600 font-semibold flex items-center gap-1">
                    ⚠️ Urgent Request
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail & Reply Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h2 className="text-xl font-bold">Prayer Request Details</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Request Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${selectedRequest.is_urgent ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'
                    }`}>
                    {selectedRequest.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{selectedRequest.full_name}</h3>
                    <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail size={14} /> {selectedRequest.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={14} /> {selectedRequest.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${selectedRequest.is_urgent
                  ? 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30'
                  : 'bg-gray-50 border-gray-100 dark:bg-gray-700/30 dark:border-gray-700'
                  }`}>
                  <h4 className="text-sm font-semibold mb-2 text-gray-500 uppercase tracking-wider">Prayer Request</h4>
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">
                    {selectedRequest.prayer_request}
                  </p>
                </div>
              </div>

              {/* Previous Replies */}
              {selectedRequest.replies && selectedRequest.replies.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Previous Replies</h4>
                  {selectedRequest.replies.map(reply => (
                    <div key={reply.id} className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                      <p className="text-gray-800 dark:text-gray-200 mb-2">{reply.reply_text}</p>
                      <div className="text-xs text-gray-500 flex justify-between">
                        <span>By: {reply.pastor_name || 'Pastor'}</span>
                        <span>{formatDate(reply.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare size={18} className="text-primary" />
                  Send a Reply
                </h4>
                <form onSubmit={handleReply} className="space-y-4">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your prayer or encouraging message here..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(null)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSendingReply || !replyText.trim()}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSendingReply ? (
                        <>
                          <Loader size={18} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Send Reply
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
