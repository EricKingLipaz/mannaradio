"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Radio, Tv, BookOpen, Heart } from "lucide-react"

export default function Home() {
  const features = [
    {
      icon: Radio,
      title: "Live Radio",
      description: "Stream our 24/7 radio station with inspiring music and teachings",
      href: "/radio",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Tv,
      title: "Live TV",
      description: "Watch our complete video playlist with sermons and worship",
      href: "/tv",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: BookOpen,
      title: "Holy Bible",
      description: "Read and study the King James Bible online",
      href: "/bible",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Heart,
      title: "Prayer Requests",
      description: "Submit your prayer requests and be part of our prayer community",
      href: "/prayer-request",
      color: "from-red-500 to-rose-500",
    },
  ]

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-block bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                Welcome to Manna Radio & TV
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent text-balance">
                Your Spiritual Connection
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                Experience live worship, inspiring teachings, and community connection through our radio and TV
                streaming platform.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  href="/radio"
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-smooth"
                >
                  Listen Now
                </Link>
                <Link
                  href="/tv"
                  className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:shadow-lg transition-smooth"
                >
                  Watch Live
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Link
                  key={index}
                  href={feature.href}
                  className="group relative overflow-hidden rounded-2xl p-8 bg-card border border-border hover:shadow-xl transition-smooth"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-smooth`}
                  />
                  <div className="relative z-10">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                    >
                      <Icon className="text-white" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl p-12 text-center space-y-6">
            <h2 className="text-4xl font-bold text-primary-foreground">Join Our Community</h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Become a member of Manna Temple Church and stay connected with our faith community.
            </p>
            <Link
              href="/members"
              className="inline-block px-8 py-3 bg-primary-foreground text-primary rounded-lg font-semibold hover:shadow-lg transition-smooth"
            >
              Register as a Member
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
