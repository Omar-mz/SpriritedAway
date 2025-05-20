import Image from "next/image"
import { Calendar, MapPin, Music } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ArtistCardProps {
  name: string
  image: string
  genre: string
  day: string
  stage: string
}

export default function ArtistCard({ name, image, genre, day, stage }: ArtistCardProps) {
  return (
    <Card className="overflow-hidden bg-black/50 border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]">
      <div className="relative h-60">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <div className="flex items-center gap-2 text-sm text-white/70 mb-1">
          <Music className="h-4 w-4" />
          <span>{genre}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/70 mb-1">
          <Calendar className="h-4 w-4" />
          <span>{day}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/70">
          <MapPin className="h-4 w-4" />
          <span>{stage}</span>
        </div>
      </CardContent>
    </Card>
  )
}
