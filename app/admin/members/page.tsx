"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api/client"
import { Search, Filter, Mail, Phone, MapPin, Calendar, User } from "lucide-react"

interface Member {
  id: number
  full_name: string
  email: string
  phone: string
  address: string
  rank: string
  date_of_birth: string
  baptism_date: string
  created_at: string
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [rankFilter, setRankFilter] = useState("")
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  const fetchMembers = async () => {
    setIsLoading(true)
    try {
      const data = await apiClient.getMembers({
        search: searchQuery,
        rank: rankFilter
      })
      setMembers(data.members || [])
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchMembers()
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, rankFilter])

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Members Management</h1>
          <p className="text-muted-foreground">View and manage church members</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/20 px-3 py-1 rounded-full">
          <User size={16} />
          <span>Total Members: {members.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="w-full md:w-48 relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={rankFilter}
            onChange={(e) => setRankFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
          >
            <option value="">All Ranks</option>
            <option value="Member">Member</option>
            <option value="Deacon">Deacon</option>
            <option value="Elder">Elder</option>
            <option value="Pastor">Pastor</option>
            <option value="Minister">Minister</option>
          </select>
        </div>
      </div>

      {/* Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">Loading members...</div>
        ) : members.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No members found matching your criteria.
          </div>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    {member.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{member.full_name}</h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary/20 text-secondary-foreground">
                      {member.rank}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="truncate">{member.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span>Joined: {formatDate(member.created_at)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Member Details</h2>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
                  {selectedMember.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedMember.full_name}</h3>
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {selectedMember.rank}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                  <p className="flex items-center gap-2">
                    <Mail size={16} className="text-primary" />
                    {selectedMember.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                  <p className="flex items-center gap-2">
                    <Phone size={16} className="text-primary" />
                    {selectedMember.phone}
                  </p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Address</label>
                  <p className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    {selectedMember.address}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Date of Birth</label>
                  <p className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    {formatDate(selectedMember.date_of_birth)}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Baptism Date</label>
                  <p className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    {formatDate(selectedMember.baptism_date)}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Member Since</label>
                  <p className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    {formatDate(selectedMember.created_at)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
