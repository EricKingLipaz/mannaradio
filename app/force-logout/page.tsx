"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ForceLogoutPage() {
    const router = useRouter()

    useEffect(() => {
        // Clear all localStorage
        if (typeof window !== 'undefined') {
            localStorage.clear()
            console.log('✅ Cleared localStorage')

            // Wait a moment then redirect to login
            setTimeout(() => {
                router.push('/admin/login')
            }, 1000)
        }
    }, [router])

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md text-center shadow-xl">
                <div className="mb-4 text-4xl">🔄</div>
                <h1 className="text-2xl font-bold mb-2">Clearing Session...</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Clearing old authentication data and redirecting to login...
                </p>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-pulse" style={{ width: '75%' }}></div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                    You'll be redirected to login in a moment...
                </p>
            </div>
        </div>
    )
}
