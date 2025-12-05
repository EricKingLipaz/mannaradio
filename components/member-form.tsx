"use client"

import type React from "react"

import { useState } from "react"
import { Users, Loader } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function MemberRegistrationForm() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    date_of_birth: "",
    baptism_date: "",
    rank: "Member",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("members").insert([
        {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          date_of_birth: formData.date_of_birth || null,
          baptism_date: formData.baptism_date || null,
          rank: formData.rank,
        },
      ])

      if (error) throw error

      setMessage({
        type: "success",
        text: "Welcome to Manna Temple Church! Your membership registration has been received. A pastor will contact you soon.",
      })
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        address: "",
        date_of_birth: "",
        baptism_date: "",
        rank: "Member",
      })
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to register",
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
          <label className="block text-sm font-semibold mb-2">Full Name *</label>
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
          <label className="block text-sm font-semibold mb-2">Email Address *</label>
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
          <label className="block text-sm font-semibold mb-2">Phone Number *</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+27 ..."
            className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold mb-2">Address *</label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Your address"
            className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Date of Birth */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Date of Birth</label>
            <input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Baptism Date */}
          <div>
            <label className="block text-sm font-semibold mb-2">Baptism Date</label>
            <input
              type="date"
              value={formData.baptism_date}
              onChange={(e) => setFormData({ ...formData, baptism_date: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Rank */}
        <div>
          <label className="block text-sm font-semibold mb-2">Rank/Position</label>
          <select
            value={formData.rank}
            onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Member">Member</option>
            <option value="Deacon">Deacon</option>
            <option value="Elder">Elder</option>
            <option value="Pastor">Pastor</option>
            <option value="Minister">Minister</option>
          </select>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
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
          className="w-full py-3 bg-gradient-to-r from-secondary to-primary text-secondary-foreground rounded-lg font-semibold hover:shadow-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Registering...
            </>
          ) : (
            <>
              <Users size={20} />
              Register as Member
            </>
          )}
        </button>

        <p className="text-sm text-muted-foreground text-center">
          * Required fields. Your information will be kept secure and only used for church purposes.
        </p>
      </form>
    </div>
  )
}
