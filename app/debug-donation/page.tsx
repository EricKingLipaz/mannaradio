"use client"

import { useState } from "react"
import { apiClient } from "@/lib/api/client"

export default function DebugDonationPage() {
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<any>(null)

    const testConnection = async () => {
        try {
            setResult("Testing...")
            setError(null)

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/donations/public`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    donor_name: "Debug User",
                    amount: 10,
                    type: "Offering",
                    payment_method: "Cash",
                    notes: "Debug test"
                })
            })

            const data = await response.json()

            setResult({
                status: response.status,
                ok: response.ok,
                data: data
            })
        } catch (err: any) {
            setError(err.message)
        }
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Donation Debugger</h1>
            <button
                onClick={testConnection}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Test Public Donation API
            </button>

            <div className="mt-8 space-y-4">
                {error && (
                    <div className="p-4 bg-red-100 text-red-700 rounded">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {result && (
                    <div className="p-4 bg-gray-100 rounded overflow-auto">
                        <pre>{JSON.stringify(result, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    )
}
