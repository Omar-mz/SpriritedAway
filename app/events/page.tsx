"use client"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventCard from "@/components/event-card"

export default function EventsPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-black to-purple-950">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">ÉVÉNEMENTS</h1>
          <div className="w-20 h-1 bg-purple-600 mx-auto mb-8"></div>
          <p className="text-lg max-w-3xl mx-auto text-gray-300">
            Découvrez nos événements immersifs et préparez-vous à vivre des expériences sensorielles uniques.
          </p>
        </motion.div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-12 bg-gray-900/50">
            <TabsTrigger value="upcoming">À venir</TabsTrigger>
            <TabsTrigger value="past">Passés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 gap-12">
              <EventCard
                title="SPIRITEDAWAY Festival 2025"
                date="15-17 Juillet 2025"
                location="Domaine de Chantilly"
                image="/images/events/festival-main.jpg" link={""}                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </main>
  )
}
