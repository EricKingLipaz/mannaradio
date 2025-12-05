"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { apiClient } from "@/lib/api/client"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      // Allow public access to login and register pages
      if (pathname === "/admin/login" || pathname === "/admin/register") {
        return
      }

      // Check if user is authenticated
      if (!apiClient.isAuthenticated()) {
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [router, pathname])

  return <>{children}</>
}
