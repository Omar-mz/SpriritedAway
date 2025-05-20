"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

// Données des artistes (à remplacer par des données dynamiques de l'API)
const artists = [
  {
    id: 1,
    name: "Ethereal Echo",
    genre: "Electronic",
    image: "/images/artists/artist-1.jpg",
  },
  {
    id: 2,
    name: "Mystic Pulse",
    genre: "House",
    image: "/images/artists/artist-2.jpg",
  },
  {
    id: 3,
    name: "Lunar Drift",
    genre: "Techno",
    image: "/images/artists/artist-3.jpg",
  },
  {
    id: 4,
    name: "Crystal Waves",
    genre: "Trance",
    image: "/images/artists/artist-4.jpg",
  },
  {
    id: 5,
    name: "Nebula Dreams",
    genre: "Ambient",
    image: "/images/artists/artist-5.jpg",
  },
  {
    id: 6,
    name: "Astral Horizon",
    genre: "Progressive",
    image: "/images/artists/artist-6.jpg",
  },
]

export default function FeaturedArtists() {
  const [hoveredArtist, setHoveredArtist] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {artists.map((artist) => (
        <motion.div
          key={artist.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: artist.id * 0.1 }}
          className="relative group"
          onMouseEnter={() => setHoveredArtist(artist.id)}
          onMouseLeave={() => setHoveredArtist(null)}
        >
          <div className="relative h-60 md:h-80 overflow-hidden rounded-lg">
            <Image
              src={artist.image || "/placeholder.svg"}
              alt={artist.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>

            <motion.div
              className="absolute inset-0 flex flex-col justify-end p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredArtist === artist.id ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-black/60 backdrop-blur-sm p-3 rounded-lg">
                <h3 className="text-lg font-bold text-white">{artist.name}</h3>
                <p className="text-sm text-gray-300">{artist.genre}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
