"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { apiClient } from "@/lib/api/client"
import { Heart, CreditCard, CheckCircle, Loader, Copy } from "lucide-react"

export default function DonatePage() {
    const [formData, setFormData] = useState({
        donor_name: "",
        amount: "",
        type: "Offering",
        payment_method: "EFT",
        notes: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await apiClient.submitPublicDonation({
                ...formData,
                amount: parseFloat(formData.amount)
            })
            setIsSuccess(true)
            setFormData({
                donor_name: "",
                amount: "",
                type: "Offering",
                payment_method: "EFT",
                notes: ""
            })
        } catch (error) {
            console.error("Error submitting donation:", error)
            alert("Failed to submit donation. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert("Copied to clipboard!")
    }

    return (
        <>
            <Navigation />
            <main className="min-h-screen bg-gradient-to-br from-background to-secondary/10 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-4">
                            Support Our Ministry
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Your generosity helps us continue spreading the message of hope and faith.
                            Thank you for partnering with us.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Banking Details */}
                        <div className="space-y-6">
                            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                        <CreditCard size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold">Banking Details</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-secondary/5 rounded-xl border border-border group relative">
                                        <p className="text-sm text-muted-foreground mb-1">Bank Name</p>
                                        <p className="font-semibold text-lg">FNB (First National Bank)</p>
                                    </div>

                                    <div className="p-4 bg-secondary/5 rounded-xl border border-border group relative">
                                        <p className="text-sm text-muted-foreground mb-1">Account Holder</p>
                                        <p className="font-semibold text-lg">Manna Temple Church</p>
                                    </div>

                                    <div className="p-4 bg-secondary/5 rounded-xl border border-border group relative cursor-pointer" onClick={() => copyToClipboard("62123456789")}>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Account Number</p>
                                                <p className="font-semibold text-lg">62123456789</p>
                                            </div>
                                            <Copy size={18} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>

                                    <div className="p-4 bg-secondary/5 rounded-xl border border-border group relative">
                                        <p className="text-sm text-muted-foreground mb-1">Branch Code</p>
                                        <p className="font-semibold text-lg">250655</p>
                                    </div>

                                    <div className="p-4 bg-secondary/5 rounded-xl border border-border group relative">
                                        <p className="text-sm text-muted-foreground mb-1">Reference</p>
                                        <p className="font-semibold text-lg">Your Name / Tithe / Offering</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Donation Form */}
                        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
                            {isSuccess ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 mb-6">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                                    <p className="text-muted-foreground mb-8">
                                        Your contribution details have been recorded. We appreciate your support!
                                    </p>
                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-lg transition-all"
                                    >
                                        Record Another
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-accent/10 rounded-xl text-accent">
                                            <Heart size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold">Notify Us</h2>
                                    </div>
                                    <p className="text-muted-foreground mb-6">
                                        Made a payment? Let us know so we can allocate it correctly.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Your Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.donor_name}
                                                onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Amount (R)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                                placeholder="0.00"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Type</label>
                                                <select
                                                    value={formData.type}
                                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                                >
                                                    <option value="Offering">Offering</option>
                                                    <option value="Tithe">Tithe</option>
                                                    <option value="Donation">Donation</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Method</label>
                                                <select
                                                    value={formData.payment_method}
                                                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                                >
                                                    <option value="EFT">EFT</option>
                                                    <option value="CashSend">CashSend</option>
                                                    <option value="Cash">Cash Deposit</option>
                                                    <option value="SnapScan">SnapScan</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                                            <textarea
                                                value={formData.notes}
                                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                                rows={3}
                                                placeholder="Any additional details..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader size={20} className="animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                "Submit Declaration"
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
