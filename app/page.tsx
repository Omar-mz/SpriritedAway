import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import VideoBackground from "@/components/video-background"
import ParticleBackground from "@/components/particle-background"
import MagicRaysBackground from "@/components/magic-rays-background"
import CountdownTimer from "@/components/countdown-timer"
import EventCard from "@/components/event-card"
import NewsletterForm from "@/components/newsletter-form"
import FeaturedArtists from "@/components/featured-artists"

export default function Home() {
  // Date du prochain événement (15 juillet 2025)
  const nextEventDate = new Date(2025, 6, 15)

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with Video Background and Particle Animation */}
      <section className="relative h-screen">
        <VideoBackground />
        <ParticleBackground className="z-[5]" density={70} speed={0.5} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6 animate-fade-in">SPIRITEDAWAY</h1>
          <p className="text-xl md:text-2xl text-center mb-12 max-w-2xl animate-fade-in-delayed">
            Embarquez pour un voyage sensoriel unique
          </p>

          {/* Countdown Timer */}
          <div className="mb-12 animate-fade-in-delayed">
            <CountdownTimer targetDate={nextEventDate} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delayed-more">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
              Acheter des billets
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              Découvrir le programme
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-purple-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ÉVÉNEMENTS À VENIR</h2>
            <div className="w-20 h-1 bg-purple-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Découvrez nos prochains événements immersifs et réservez vos places dès maintenant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <EventCard
              title="SPIRITEDAWAY Festival"
              date="15-17 Juillet 2025"
              location="Spain"
              image="/fetsivalimage.jpg"
              link="/events/festival-2025"
            />
            <EventCard
              title="Nuit Enchantée"
              date="25 Septembre 2025"
              location="California"
              image="/tomorrowland ibiza.jpg"
              link="/events/nuit-enchantee"
            />
            <EventCard
              title="Winter Wonderland"
              date="12-14 Décembre 2025"
              location="Alpes Françaises"
              image="/eagle.jpg"
              link="/events/winter-wonderland"
            />
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="border-purple-500 text-white hover:bg-purple-900/20">
              Voir tous les événements <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ARTISTES À L'AFFICHE</h2>
            <div className="w-20 h-1 bg-purple-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Découvrez les artistes qui vous feront vibrer lors de nos prochains événements
            </p>
          </div>

          <FeaturedArtists />

          <div className="text-center mt-12">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">Voir la programmation complète</Button>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-950 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">GALERIE</h2>
            <div className="w-20 h-1 bg-purple-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Revivez les moments magiques de nos événements passés
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative aspect-square overflow-hidden rounded-lg group">
              <Image
                src="/images/gallery/gallery-1.jpg"
                alt="Gallery image 1"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg group">
              <Image
                src="/images/gallery/gallery-2.jpg"
                alt="Gallery image 2"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg group">
              <Image
                src="/images/gallery/gallery-3.jpg"
                alt="Gallery image 3"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg group">
              <Image
                src="/images/gallery/gallery-4.jpg"
                alt="Gallery image 4"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="border-purple-500 text-white hover:bg-purple-900/20">
              Explorer la galerie <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/backgrounds/newsletter-bg.jpg" alt="Background" fill className="object-cover" />
        </div>
        <MagicRaysBackground
          baseColor="rgba(128, 0, 255, 0.15)"
          rayColor="rgba(255, 255, 255, 0.25)"
          rayCount={15}
          speed={5}
          className="z-[5]"
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">RESTEZ INFORMÉ</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Inscrivez-vous à notre newsletter pour recevoir en avant-première toutes les informations sur nos
            événements.
          </p>

          <NewsletterForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SPIRITEDAWAY</h3>
            <p className="text-white/70">Des expériences immersives qui transcendent les limites de la réalité.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">LIENS RAPIDES</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/events" className="text-white/70 hover:text-white">
                  Événements
                </Link>
              </li>
              <li>
                <Link href="/tickets" className="text-white/70 hover:text-white">
                  Billetterie
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-white/70 hover:text-white">
                  Galerie
                </Link>
              </li>
              <li>
                <Link href="/info" className="text-white/70 hover:text-white">
                  Infos Pratiques
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">INFORMATIONS</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-white/70 hover:text-white">
                  À Propos
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/70 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/70 hover:text-white">
                  Mentions Légales
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">SUIVEZ-NOUS</h4>
            <div className="flex gap-4">
              <Link href="#" className="text-white/70 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-white/70 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-white/70 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-white/70 hover:text-white">
                <span className="sr-only">TikTok</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/20 text-center text-white/50 text-sm">
          © {new Date().getFullYear()} SPIRITEDAWAY. Tous droits réservés.
        </div>
      </footer>
    </main>
  )
}
