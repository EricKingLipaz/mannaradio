"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Users, Heart, AlertCircle } from "lucide-react"

interface DashboardStats {
  totalMembers: number
  prayerRequests: number
  urgentRequests: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    prayerRequests: 0,
    urgentRequests: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/admin/login")
        return
      }

      try {
        // Fetch member count
        const { count: memberCount } = await supabase.from("members").select("*", { count: "exact" })

        // Fetch prayer request count
        const { count: prayerCount } = await supabase.from("prayer_requests").select("*", { count: "exact" })

        // Fetch urgent prayer request count
        const { count: urgentCount } = await supabase
          .from("prayer_requests")
          .select("*", { count: "exact" })
          .eq("is_urgent", true)

        setStats({
          totalMembers: memberCount || 0,
          prayerRequests: prayerCount || 0,
          urgentRequests: urgentCount || 0,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [router])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground mt-2">Here's your church administration dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Members */}
        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-smooth">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Total Members</h3>
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <Users className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
          </div>
          <p className="text-4xl font-bold">{stats.totalMembers}</p>
          <p className="text-sm text-muted-foreground mt-2">Active members in the church</p>
        </div>

        {/* Prayer Requests */}
        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-smooth">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Prayer Requests</h3>
            <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-950 flex items-center justify-center">
              <Heart className="text-pink-600 dark:text-pink-400" size={20} />
            </div>
          </div>
          <p className="text-4xl font-bold">{stats.prayerRequests}</p>
          <p className="text-sm text-muted-foreground mt-2">Submitted prayer requests</p>
        </div>

        {/* Urgent Requests */}
        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-smooth">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Urgent Requests</h3>
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center">
              <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
            </div>
          </div>
          <p className="text-4xl font-bold">{stats.urgentRequests}</p>
          <p className="text-sm text-muted-foreground mt-2">Need immediate attention</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/members"
            className="p-4 border border-border rounded-lg hover:bg-accent/5 transition-smooth flex items-center justify-between group"
          >
            <div>
              <p className="font-semibold group-hover:text-primary transition-smooth">View All Members</p>
              <p className="text-sm text-muted-foreground">Manage church members</p>
            </div>
            <Users className="text-primary" size={24} />
          </a>
          <a
            href="/admin/prayer-requests"
            className="p-4 border border-border rounded-lg hover:bg-accent/5 transition-smooth flex items-center justify-between group"
          >
            <div>
              <p className="font-semibold group-hover:text-primary transition-smooth">View Prayer Requests</p>
              <p className="text-sm text-muted-foreground">Review and intercede</p>
            </div>
            <Heart className="text-primary" size={24} />
          </a>
        </div>
      </div>
    </div>
  )
}
