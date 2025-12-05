"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api/client"
import { CheckCircle, XCircle, Trash2, Clock, MapPin } from "lucide-react"

interface Testimony {
    id: number
    full_name: string
    location?: string
    content: string
    status: "pending" | "approved" | "declined"
    created_at: string
}

export default function AdminTestimoniesPage() {
    const [testimonies, setTestimonies] = useState<Testimony[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "declined">("all")
    const [currentUserRole, setCurrentUserRole] = useState("")

    useEffect(() => {
        fetchTestimonies()
    }, [])

    const fetchTestimonies = async () => {
        try {
            // Fetch user role first or parallel
            const { pastor } = await apiClient.request('/auth/me');
            setCurrentUserRole(pastor.role || 'moderator');

            const data = await apiClient.getAdminTestimonies()
            setTestimonies(data)
        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleStatusUpdate = async (id: number, status: "approved" | "declined") => {
        try {
            await apiClient.updateTestimonyStatus(id, status)
            // Optimistic update
            setTestimonies(testimonies.map(t => t.id === id ? { ...t, status } : t))
        } catch (error) {
            console.error("Error updating status:", error)
            alert("Failed to update status")
            fetchTestimonies() // Revert on error
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this testimony?")) return
        try {
            await apiClient.deleteTestimony(id)
            setTestimonies(testimonies.filter(t => t.id !== id))
        } catch (error) {
            console.error("Error deleting testimony:", error)
            alert("Failed to delete testimony. You may not have permission.")
        }
    }

    const filteredTestimonies = testimonies.filter(t =>
        filter === "all" ? true : t.status === filter
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            case "declined": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            default: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Testimonies</h1>

                {/* Filter Tabs */}
                <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                    {["all", "pending", "approved", "declined"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === f
                                ? "bg-primary text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <div className="grid gap-6">
                    {filteredTestimonies.map((testimony) => (
                        <div
                            key={testimony.id}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex justify-between items-start gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {testimony.full_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-gray-100">{testimony.full_name}</h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span>{new Date(testimony.created_at).toLocaleDateString()}</span>
                                            {testimony.location && (
                                                <>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1"><MapPin size={10} /> {testimony.location}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(testimony.status)}`}>
                                    {testimony.status.toUpperCase()}
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg mb-4 text-gray-700 dark:text-gray-300 italic">
                                "{testimony.content}"
                            </div>

                            <div className="flex justify-end gap-2">
                                {testimony.status !== "approved" && (
                                    <button
                                        onClick={() => handleStatusUpdate(testimony.id, "approved")}
                                        className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <CheckCircle size={16} /> Approve
                                    </button>
                                )}
                                {testimony.status !== "declined" && (
                                    <button
                                        onClick={() => handleStatusUpdate(testimony.id, "declined")}
                                        className="flex items-center gap-1 px-3 py-2 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <XCircle size={16} /> Decline
                                    </button>
                                )}
                                {currentUserRole === 'admin' && (
                                    <button
                                        onClick={() => handleDelete(testimony.id)}
                                        className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors ml-2"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredTestimonies.length === 0 && (
                        <div className="text-center py-12 text-gray-500">No testimonies found.</div>
                    )}
                </div>
            )}
        </div>
    )
}
