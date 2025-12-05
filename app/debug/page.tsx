"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api/client"

export default function DebugPage() {
    const [health, setHealth] = useState<any>(null)
    const [error, setError] = useState<string>("")
    const [envUrl, setEnvUrl] = useState<string>("")

    useEffect(() => {
        // 1. Check what the env var is
        setEnvUrl(process.env.NEXT_PUBLIC_API_URL || "NOT SET")

        // 2. Try to fetch health
        async function checkHealth() {
            try {
                const res = await fetch('http://localhost:8000/api/health')
                const data = await res.json()
                setHealth(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error")
            }
        }
        checkHealth()
    }, [])

    return (
        <div className="p-8 font-mono">
            <h1 className="text-2xl font-bold mb-4">Debug Connection</h1>

            <div className="mb-6 p-4 border rounded bg-gray-100 dark:bg-gray-800">
                <p><strong>NEXT_PUBLIC_API_URL:</strong> {envUrl}</p>
            </div>

            <div className="mb-6 p-4 border rounded bg-gray-100 dark:bg-gray-800">
                <h2 className="font-bold mb-2">Direct Fetch Test (to localhost:8000):</h2>
                {health ? (
                    <pre className="text-green-600">{JSON.stringify(health, null, 2)}</pre>
                ) : (
                    <p className="text-red-600">Error: {error}</p>
                )}
            </div>
        </div>
    )
}
