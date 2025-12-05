"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api/client"
import {
    DollarSign,
    TrendingUp,
    CreditCard,
    Calendar,
    Plus,
    Search,
    Filter,
    Loader
} from "lucide-react"

interface Donation {
    id: number
    member_name?: string
    donor_name?: string
    amount: number
    type: 'Tithe' | 'Offering' | 'Donation'
    payment_method: string
    notes?: string
    date: string
    created_at: string
}

export default function DonationsPage() {
    const [donations, setDonations] = useState<Donation[]>([])
    const [stats, setStats] = useState({
        totalTithe: 0,
        totalOffering: 0,
        totalDonation: 0,
        recentTotal: 0
    })
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [filterType, setFilterType] = useState('all')

    // Form State
    const [formData, setFormData] = useState({
        amount: "",
        type: "Tithe",
        donor_name: "",
        payment_method: "Cash",
        notes: "",
        date: new Date().toISOString().split('T')[0]
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [donationsData, statsData] = await Promise.all([
                apiClient.getDonations({ type: filterType !== 'all' ? filterType : undefined }),
                apiClient.getDonationStats()
            ])

            setDonations(donationsData.donations || [])
            setStats(statsData.stats || {
                totalTithe: 0,
                totalOffering: 0,
                totalDonation: 0,
                recentTotal: 0
            })
        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [filterType])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await apiClient.createDonation({
                ...formData,
                amount: parseFloat(formData.amount)
            })

            setShowForm(false)
            setFormData({
                amount: "",
                type: "Tithe",
                donor_name: "",
                payment_method: "Cash",
                notes: "",
                date: new Date().toISOString().split('T')[0]
            })
            fetchData()
        } catch (error) {
            console.error("Error creating donation:", error)
            alert("Failed to record donation")
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR'
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Financials</h1>
                    <p className="text-muted-foreground">Manage tithes, offerings, and donations</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                    <Plus size={20} />
                    Record Transaction
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg text-green-600">
                            <DollarSign size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Total Tithes</span>
                    </div>
                    <h3 className="text-2xl font-bold">{formatCurrency(stats.totalTithe)}</h3>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600">
                            <CreditCard size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Total Offerings</span>
                    </div>
                    <h3 className="text-2xl font-bold">{formatCurrency(stats.totalOffering)}</h3>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-purple-600">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Total Donations</span>
                    </div>
                    <h3 className="text-2xl font-bold">{formatCurrency(stats.totalDonation)}</h3>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-orange-600">
                            <Calendar size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">This Month</span>
                    </div>
                    <h3 className="text-2xl font-bold">{formatCurrency(stats.recentTotal)}</h3>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold">Recent Transactions</h2>

                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
                        <button
                            onClick={() => setFilterType('all')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'all' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-500'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterType('Tithe')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'Tithe' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-500'
                                }`}
                        >
                            Tithes
                        </button>
                        <button
                            onClick={() => setFilterType('Offering')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'Offering' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-500'
                                }`}
                        >
                            Offerings
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-6 py-4 text-left">Donor</th>
                                <th className="px-6 py-4 text-left">Type</th>
                                <th className="px-6 py-4 text-left">Method</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        Loading transactions...
                                    </td>
                                </tr>
                            ) : donations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                donations.map((donation) => (
                                    <tr key={donation.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm">{formatDate(donation.date)}</td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            {donation.member_name || donation.donor_name || 'Anonymous'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${donation.type === 'Tithe' ? 'bg-green-100 text-green-800' :
                                                    donation.type === 'Offering' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-purple-100 text-purple-800'
                                                }`}>
                                                {donation.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{donation.payment_method}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-right">
                                            {formatCurrency(Number(donation.amount))}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Record Transaction Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Record Transaction</h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Amount (R)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="Tithe">Tithe</option>
                                        <option value="Offering">Offering</option>
                                        <option value="Donation">Donation</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Donor Name (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.donor_name}
                                    onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Leave blank for anonymous"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Payment Method</label>
                                <select
                                    value={formData.payment_method}
                                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="EFT">EFT / Bank Transfer</option>
                                    <option value="Card">Card</option>
                                    <option value="SnapScan">SnapScan</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                    rows={2}
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader size={18} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} />
                                            Save Record
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
