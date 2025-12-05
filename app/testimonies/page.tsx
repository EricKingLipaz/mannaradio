"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { apiClient } from "@/lib/api/client"
import { MessageSquare, MapPin, Send, Plus, X, Quote } from "lucide-react"

interface Testimony {
    id: number
    full_name: string
    location?: string
    content: string
    created_at: string
}

export default function TestimoniesPage() {
    const [testimonies, setTestimonies] = useState<Testimony[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        full_name: "",
        location: "",
        content: ""
    })

    useEffect(() => {
        fetchTestimonies()
    }, [])

    const fetchTestimonies = async () => {
        try {
            const data = await apiClient.getPublicTestimonies()
            setTestimonies(data)
        } catch (error) {
            console.error("Error fetching testimonies:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await apiClient.submitTestimony(formData)
            setSubmitSuccess(true)
            setFormData({ full_name: "", location: "", content: "" })
            setTimeout(() => {
                setIsModalOpen(false)
                setSubmitSuccess(false)
            }, 3000)
        } catch (error) {
            console.error("Error submitting testimony:", error)
            alert("Failed to submit testimony. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Navigation />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-primary via-accent to-secondary py-20 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">Testimonies</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
                            Read how God is moving in the lives of our community members. Share your own story to encourage others.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-8 py-3 bg-white text-primary rounded-full font-bold shadow-lg hover:shadow-xl transition-transform hover:scale-105 flex items-center gap-2 mx-auto"
                        >
                            <Plus size={20} />
                            Share Your Testimony
                        </button>
                    </div>
                </section>

                {/* Testimonies Grid */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {isLoading ? (
                        <div className="text-center py-20">Loading testimonies...</div>
                    ) : testimonies.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                            <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">No testimonies yet</h3>
                            <p className="text-gray-500 mt-2">Be the first to share your story!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {testimonies.map((testimony) => (
                                <div
                                    key={testimony.id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 flex flex-col"
                                >
                                    <Quote className="text-primary/20 mb-4" size={40} />
                                    <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 flex-grow italic">
                                        "{testimony.content}"
                                    </p>
                                    <div className="flex items-center gap-3 mt-auto pt-6 border-t border-gray-100 dark:border-gray-700">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                                            {testimony.full_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-gray-100">{testimony.full_name}</h4>
                                            {testimony.location && (
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <MapPin size={12} />
                                                    {testimony.location}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Submission Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Share Your Story</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {submitSuccess ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Send size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Thank You!</h3>
                                <p className="text-gray-500">
                                    Your testimony has been submitted and will be reviewed by our pastors shortly.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="City, Country"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Testimony</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Share what God has done for you..."
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? "Submitting..." : (
                                            <>
                                                <Send size={18} />
                                                Submit Testimony
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
            <Footer />
        </>
    )
}
