"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-white font-bold text-xl">
            SPIRITEDAWAY
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/events" className="text-white hover:text-purple-400 transition-colors">
              Événements
            </Link>
            <Link href="/tickets" className="text-white hover:text-purple-400 transition-colors">
              Billetterie
            </Link>
            <Link href="/gallery" className="text-white hover:text-purple-400 transition-colors">
              Galerie
            </Link>
            <Link href="/info" className="text-white hover:text-purple-400 transition-colors">
              Infos Pratiques
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm" className="border-white text-white hover:bg-white/10">
                <User className="h-4 w-4 mr-2" />
                Compte
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-md"
          >
            <div className="px-4 py-5 space-y-4">
              <Link
                href="/events"
                className="block text-white hover:text-purple-400 transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Événements
              </Link>
              <Link
                href="/tickets"
                className="block text-white hover:text-purple-400 transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Billetterie
              </Link>
              <Link
                href="/gallery"
                className="block text-white hover:text-purple-400 transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Galerie
              </Link>
              <Link
                href="/info"
                className="block text-white hover:text-purple-400 transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Infos Pratiques
              </Link>
              <Link
                href="/login"
                className="block text-white hover:text-purple-400 transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Compte
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
