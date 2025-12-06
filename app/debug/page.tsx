"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api/client"

export default function DebugPage() {
    const [userData, setUserData] = useState<any>(null)
    const [error, setError] = useState("")
    const [token, setToken] = useState("")

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const storedToken = apiClient.getToken()
            setToken(storedToken || "No token found")

            const response = await apiClient.request('/auth/me')
            setUserData(response.pastor)
        } catch (err: any) {
            setError(err.message)
        }
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Debug - Auth Info</h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4">
                <h2 className="font-semibold mb-2">JWT Token:</h2>
                <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto">
                    {token.substring(0, 100)}...
                </pre>
            </div>

            {error && (
                <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
                    Error: {error}
                </div>
            )}

            {userData && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h2 className="font-semibold mb-3">User Data from /auth/me:</h2>
                    <pre className="text-sm bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto">
                        {JSON.stringify(userData, null, 2)}
                    </pre>

                    <div className="mt-4 space-y-2">
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Name:</strong> {userData.name}</p>
                        <p className={userData.role === 'admin' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                            <strong>Role:</strong> {userData.role || 'UNDEFINED - This is the problem!'}
                        </p>
                    </div>

                    {userData.role === 'admin' ? (
                        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-400 text-green-700 dark:text-green-400 rounded">
                            ✅ Role is set to "admin" - Manage Users should work!
                        </div>
                    ) : (
                        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 rounded">
                            ❌ Role is NOT "admin" - You need to LOGOUT and LOGIN again to get a fresh token
                        </div>
                    )}
                </div>
            )}

            <div className="mt-6">
                <button
                    onClick={() => {
                        apiClient.logout()
                        window.location.href = '/admin/login'
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Logout & Go to Login
                </button>
            </div>
        </div>
    )
}
