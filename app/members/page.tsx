"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MemberRegistrationForm } from "@/components/member-form"
import { Users } from "lucide-react"

export default function MembersPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background to-blue-50 dark:to-blue-950/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Users className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2 text-balance">
                  Join Our Community
                </h1>
                <p className="text-xl text-muted-foreground">Become a member of Manna Temple Church</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Spiritual Growth</h3>
              <p className="text-sm text-muted-foreground">
                Access to teachings, prayer groups, and spiritual development programs
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Community Support</h3>
              <p className="text-sm text-muted-foreground">
                Connect with like-minded believers and receive pastoral support
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Events & Activities</h3>
              <p className="text-sm text-muted-foreground">
                Participate in church events, worship services, and outreach programs
              </p>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-8">Member Registration Form</h2>
            <MemberRegistrationForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
