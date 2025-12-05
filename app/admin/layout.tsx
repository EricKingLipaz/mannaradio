"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LogOut, Menu, X, Settings, UserPlus } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-gradient-to-b from-primary to-secondary text-primary-foreground p-6 overflow-y-auto transition-transform duration-300 z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Manna Admin</h1>
          <p className="text-sm text-primary-foreground/80">Pastor Portal</p>
        </div>

        <nav className="space-y-2 mb-8">
          <a
            href="/admin"
            className="block px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-smooth font-semibold"
          >
            Dashboard
          </a>
          <a
            href="/admin/members"
            className="block px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-smooth font-semibold"
          >
            Members
          </a>
          <a
            href="/admin/prayer-requests"
            className="block px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-smooth font-semibold"
          >
            Prayer Requests
          </a>
        </nav>

        <div className="border-t border-primary-foreground/20 pt-6 space-y-2">
          <a
            href="/admin/register"
            className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-smooth font-semibold"
          >
            <UserPlus size={18} />
            Register Pastor
          </a>
          <a
            href="/admin/settings"
            className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-smooth font-semibold"
          >
            <Settings size={18} />
            Settings
          </a>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-8 px-4 py-3 bg-primary-foreground text-primary rounded-lg font-semibold hover:shadow-lg transition-smooth flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border p-6 flex items-center justify-between lg:hidden">
          <h1 className="text-xl font-bold">Manna Admin</h1>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-foreground">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">{children}</div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 lg:hidden z-30" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  )
}
