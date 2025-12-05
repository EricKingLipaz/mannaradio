"use client"

import type React from "react"

import { useState } from "react"
import { Heart, Loader } from "lucide-react"
import { apiClient } from "@/lib/api/client"

export function PrayerRequestForm() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    prayer_request: "",
    is_urgent: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      await apiClient.createPrayerRequest({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        prayer_request: formData.prayer_request,
        is_urgent: formData.is_urgent,
      })

      setMessage({
        type: "success",
        text: "Your prayer request has been submitted. Our prayer team will intercede for you.",
      })
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        prayer_request: "",
        is_urgent: false,
      })
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to submit prayer request",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">Full Name</label>
          <input
            type="text"
            required
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder="Your full name"
            className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-2">Email Address</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
            className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold mb-2">Phone Number</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+27 ..."
            className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Prayer Request */}
        <div>
          <label className="block text-sm font-semibold mb-2">Prayer Request</label>
          <textarea
            required
            value={formData.prayer_request}
            onChange={(e) => setFormData({ ...formData, prayer_request: e.target.value })}
            placeholder="Share your prayer request with us..."
            rows={6}
            className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* Urgent Checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="urgent"
            checked={formData.is_urgent}
            onChange={(e) => setFormData({ ...formData, is_urgent: e.target.checked })}
            className="w-5 h-5 rounded border border-border cursor-pointer"
          />
          <label htmlFor="urgent" className="text-sm font-semibold cursor-pointer">
            This is an urgent prayer request
          </label>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`p-4 rounded-lg ${message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
              }`}
          >
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Heart size={20} />
              Submit Prayer Request
            </>
          )}
        </button>
      </form>
    </div>
  )
}
