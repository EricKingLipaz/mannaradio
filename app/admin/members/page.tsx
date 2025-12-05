"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Search, FilterX, Loader, Download } from "lucide-react"
import { generateCSV, downloadCSV, downloadXLSX, formatMembersForExport } from "@/lib/export-service"

interface Member {
  id: string
  full_name: string
  email: string
  phone: string
  address: string
  date_of_birth: string | null
  baptism_date: string | null
  rank: string
  created_at: string
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRank, setFilterRank] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchMembers = async () => {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/admin/login")
        return
      }

      try {
        const { data, error } = await supabase.from("members").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setMembers(data || [])
        setFilteredMembers(data || [])
      } catch (error) {
        console.error("Error fetching members:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMembers()
  }, [router])

  useEffect(() => {
    let filtered = members

    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.phone.includes(searchTerm),
      )
    }

    if (filterRank) {
      filtered = filtered.filter((m) => m.rank === filterRank)
    }

    setFilteredMembers(filtered)
  }, [searchTerm, filterRank, members])

  const handleExportCSV = () => {
    try {
      setIsExporting(true)
      const formatted = formatMembersForExport(filteredMembers)
      const csv = generateCSV(formatted)
      const timestamp = new Date().toISOString().split("T")[0]
      downloadCSV(csv, `manna-members-${timestamp}.csv`)
    } catch (error) {
      console.error("Error exporting CSV:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportXLSX = async () => {
    try {
      setIsExporting(true)
      const formatted = formatMembersForExport(filteredMembers)
      const timestamp = new Date().toISOString().split("T")[0]
      await downloadXLSX(formatted, `manna-members-${timestamp}.xlsx`)
    } catch (error) {
      console.error("Error exporting XLSX:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Church Members</h1>
        <p className="text-muted-foreground mt-2">
          Total: <span className="font-semibold text-primary">{members.length}</span> members registered
        </p>
      </div>

      {/* Filters and Export */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter by Rank */}
          <select
            value={filterRank}
            onChange={(e) => setFilterRank(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Ranks</option>
            <option value="Member">Member</option>
            <option value="Deacon">Deacon</option>
            <option value="Elder">Elder</option>
            <option value="Pastor">Pastor</option>
            <option value="Minister">Minister</option>
          </select>

          {/* Clear Filters */}
          {(searchTerm || filterRank) && (
            <button
              onClick={() => {
                setSearchTerm("")
                setFilterRank("")
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent/5 transition-smooth"
            >
              <FilterX size={20} />
              Clear
            </button>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-border flex-wrap">
          <button
            onClick={handleExportCSV}
            disabled={isExporting || filteredMembers.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent/5 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isExporting ? <Loader size={18} className="animate-spin" /> : <Download size={18} />}
            Export as CSV
          </button>
          <button
            onClick={handleExportXLSX}
            disabled={isExporting || filteredMembers.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent/5 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isExporting ? <Loader size={18} className="animate-spin" /> : <Download size={18} />}
            Export as Excel
          </button>
        </div>
      </div>

      {/* Members Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin text-primary" size={40} />
        </div>
      ) : filteredMembers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Rank</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Baptism</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-b border-border hover:bg-accent/5 transition-smooth">
                  <td className="px-6 py-4 font-semibold">{member.full_name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{member.email}</td>
                  <td className="px-6 py-4 text-sm">{member.phone}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-primary/10 text-primary">
                      {member.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {member.baptism_date ? new Date(member.baptism_date).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(member.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No members found</p>
        </div>
      )}

      {/* Summary */}
      <div className="mt-8 p-6 bg-card border border-border rounded-xl">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredMembers.length}</span> of{" "}
          <span className="font-semibold text-foreground">{members.length}</span> members
        </p>
      </div>
    </div>
  )
}
