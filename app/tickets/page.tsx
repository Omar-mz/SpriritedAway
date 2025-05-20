"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Info } from "lucide-react"

export default function TicketsPage() {
  const [selectedEvent, setSelectedEvent] = useState("festival-2025")

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-black to-purple-950">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">BILLETTERIE</h1>
          <div className="w-20 h-1 bg-purple-600 mx-auto mb-8"></div>
          <p className="text-lg max-w-3xl mx-auto text-gray-300">
            Réservez vos billets pour nos prochains événements et préparez-vous à vivre une expérience inoubliable.
          </p>
        </motion.div>

        <Tabs defaultValue="festival-2025" className="w-full" onValueChange={setSelectedEvent}>
          <TabsList className="grid w-full grid-cols-3 mb-12 bg-gray-900/50">
            <TabsTrigger value="festival-2025">SPIRITEDAWAY Festival</TabsTrigger>
            <TabsTrigger value="nuit-enchantee">Nuit Enchantée</TabsTrigger>
            <TabsTrigger value="winter-wonderland">Winter Wonderland</TabsTrigger>
          </TabsList>

          <TabsContent value="festival-2025">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TicketCard
                title="Pass 1 Jour"
                price="89"
                description="Accès à toutes les scènes pour une journée au choix"
                features={[
                  "Accès à toutes les scènes",
                  "1 boisson offerte",
                  "Accès aux zones de restauration",
                  "Vestiaire inclus",
                ]}
                popular={false}
              />

              <TicketCard
                title="Pass 3 Jours"
                price="229"
                description="L'expérience complète du festival sur 3 jours"
                features={[
                  "Accès à toutes les scènes pendant 3 jours",
                  "Camping inclus",
                  "Kit de bienvenue exclusif",
                  "Accès aux zones VIP",
                  "5 boissons offertes",
                ]}
                popular={true}
              />

              <TicketCard
                title="Pass VIP"
                price="399"
                description="Vivez le festival comme jamais avec notre offre premium"
                features={[
                  "Accès à toutes les scènes pendant 3 jours",
                  "Accès backstage sur certaines scènes",
                  "Hébergement premium",
                  "Navette privée",
                  "Bar et restauration VIP illimités",
                  "Rencontre avec les artistes",
                ]}
                popular={false}
              />
            </div>
          </TabsContent>

          <TabsContent value="nuit-enchantee">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TicketCard
                title="Entrée Standard"
                price="65"
                description="Une soirée magique en Espagne"
                features={[
                  "Accès à l'événement",
                  "1 coupe de champagne offerte",
                  "Accès aux installations artistiques",
                  "Vestiaire inclus",
                ]}
                popular={false}
              />

              <TicketCard
                title="Expérience Premium"
                price="120"
                description="Vivez une soirée d'exception avec des privilèges exclusifs"
                features={[
                  "Accès prioritaire sans file d'attente",
                  "Espace lounge réservé",
                  "Open bar champagne",
                  "Buffet gastronomique",
                  "Visite guidée des installations",
                  "Cadeau souvenir exclusif",
                ]}
                popular={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="winter-wonderland">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TicketCard
                title="Pass Neige"
                price="99"
                description="Une journée dans notre paradis hivernal"
                features={[
                  "Accès à l'événement pour 1 jour",
                  "Accès à 2 scènes principales",
                  "1 boisson chaude offerte",
                  "Vestiaire inclus",
                ]}
                popular={false}
              />

              <TicketCard
                title="Pass Glacier"
                price="249"
                description="L'expérience complète sur 3 jours"
                features={[
                  "Accès à l'événement pendant 3 jours",
                  "Accès à toutes les scènes",
                  "Hébergement en chalet partagé",
                  "Petit-déjeuner inclus",
                  "Forfait ski 1 journée inclus",
                ]}
                popular={true}
              />

              <TicketCard
                title="Pass Aurore Boréale"
                price="449"
                description="Notre offre la plus exclusive pour une expérience inoubliable"
                features={[
                  "Accès à l'événement pendant 3 jours",
                  "Hébergement en chalet privé",
                  "Forfait ski 3 jours inclus",
                  "Dîner gastronomique",
                  "Spa et bien-être",
                  "Transfert privé depuis l'aéroport",
                ]}
                popular={false}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-16 bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <div className="flex items-start gap-4">
            <Info className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Informations importantes</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>Les billets sont nominatifs et non remboursables.</li>
                <li>Une pièce d'identité sera demandée à l'entrée.</li>
                <li>Les mineurs de moins de 16 ans doivent être accompagnés d'un adulte.</li>
                <li>En cas d'annulation de l'événement, les billets seront remboursés.</li>
                <li>
                  Pour toute question concernant votre réservation, contactez notre service client à{" "}
                  <a href="mailto:tickets@spiritedaway.com" className="text-purple-400 hover:underline">
                    tickets@spiritedaway.com
                  </a>
                  .
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

interface TicketCardProps {
  title: string
  price: string
  description: string
  features: string[]
  popular: boolean
}

function TicketCard({ title, price, description, features, popular }: TicketCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <Card
        className={`relative overflow-hidden ${
          popular ? "border-purple-500 bg-gradient-to-b from-purple-900/40 to-black/40" : "border-gray-800 bg-black/40"
        }`}
      >
        {popular && (
          <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 translate-x-[30%] translate-y-[40%] rotate-45">
            POPULAIRE
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-gray-400">{description}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <span className="text-4xl font-bold">{price}€</span>
          </div>

          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter>
          <Button
            className={popular ? "w-full bg-purple-600 hover:bg-purple-700" : "w-full bg-gray-800 hover:bg-gray-700"}
          >
            Acheter maintenant
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
