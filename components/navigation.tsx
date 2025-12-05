"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: "/", label: "Home" },
    { href: "/radio", label: "Radio" },
    { href: "/tv", label: "TV" },
    { href: "/bible", label: "Bible" },
    { href: "/prayer-request", label: "Prayer" },
    { href: "/testimonies", label: "Testimonies" },
    { href: "/donate", label: "Donate" },
    { href: "/members", label: "Join Us" },
  ]

  return (
    <nav className="bg-gradient-to-r from-primary via-accent to-secondary sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary-foreground">
              <Image
                src="/images/app-logo.png"
                alt="Manna Radio"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold text-primary-foreground hidden sm:inline">MANNA TEMPLE CONNECTION</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/20 rounded-md transition-smooth"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-primary-foreground">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/20 rounded-md transition-smooth"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
