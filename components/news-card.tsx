import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface NewsCardProps {
  title: string
  date: string
  excerpt: string
  image: string
}

export default function NewsCard({ title, date, excerpt, image }: NewsCardProps) {
  return (
    <Card className="overflow-hidden bg-black/50 border border-white/20 backdrop-blur-md h-full">
      <div className="relative h-48">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <div className="text-sm text-white/70 mb-2">{date}</div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-white/80 mb-4 text-sm">{excerpt}</p>
        <Link href="#" className="inline-flex items-center text-sm font-medium text-white hover:text-white/80">
          Read More <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  )
}
