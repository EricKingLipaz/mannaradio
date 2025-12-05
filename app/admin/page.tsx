"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api/client"
import { Users, MessageSquare, Activity, Calendar } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    membersCount: 0,
    prayerRequestsCount: 0,
    pendingRequestsCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch members count
        const membersData = await apiClient.getMembers({ count: true })

        // Fetch prayer requests
        const requestsData = await apiClient.getPrayerRequests()
        const pending = requestsData.requests.filter((r: any) => r.status === 'pending').length

        setStats({
          membersCount: membersData.count || 0,
          prayerRequestsCount: requestsData.total || 0,
          pendingRequestsCount: pending,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return <div>Loading dashboard...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Pastor.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Members Stat */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Users className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <h3 className="text-2xl font-bold">{stats.membersCount}</h3>
          <p className="text-gray-500 dark:text-gray-400">Total Members</p>
        </div>

        {/* Prayer Requests Stat */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <MessageSquare className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <span className="text-sm font-medium text-purple-600 bg-purple-100 dark:bg-purple-900/20 px-2 py-1 rounded-full">
              All Time
            </span>
          </div>
          <h3 className="text-2xl font-bold">{stats.prayerRequestsCount}</h3>
          <p className="text-gray-500 dark:text-gray-400">Prayer Requests</p>
        </div>

        {/* Pending Requests Stat */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Activity className="text-orange-600 dark:text-orange-400" size={24} />
            </div>
            {stats.pendingRequestsCount > 0 && (
              <span className="text-sm font-medium text-orange-600 bg-orange-100 dark:bg-orange-900/20 px-2 py-1 rounded-full">
                Action Needed
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold">{stats.pendingRequestsCount}</h3>
          <p className="text-gray-500 dark:text-gray-400">Pending Requests</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-xl border border-primary/20">
          <h3 className="font-bold text-lg mb-2">Morning Devotion</h3>
          <p className="text-sm text-muted-foreground mb-4">
            "The Lord is my shepherd; I shall not want." - Psalm 23:1
          </p>
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <Calendar size={16} />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
