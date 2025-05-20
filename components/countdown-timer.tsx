"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  targetDate: Date
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      } else {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        }
      }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    // Cleanup
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex gap-4 md:gap-8">
      <div className="flex flex-col items-center">
        <div className="text-3xl md:text-5xl font-bold bg-purple-900/50 backdrop-blur-sm p-3 md:p-4 rounded-lg min-w-[70px] md:min-w-[100px] text-center">
          {timeLeft.days.toString().padStart(2, "0")}
        </div>
        <span className="text-sm mt-2">JOURS</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-3xl md:text-5xl font-bold bg-purple-900/50 backdrop-blur-sm p-3 md:p-4 rounded-lg min-w-[70px] md:min-w-[100px] text-center">
          {timeLeft.hours.toString().padStart(2, "0")}
        </div>
        <span className="text-sm mt-2">HEURES</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-3xl md:text-5xl font-bold bg-purple-900/50 backdrop-blur-sm p-3 md:p-4 rounded-lg min-w-[70px] md:min-w-[100px] text-center">
          {timeLeft.minutes.toString().padStart(2, "0")}
        </div>
        <span className="text-sm mt-2">MINUTES</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-3xl md:text-5xl font-bold bg-purple-900/50 backdrop-blur-sm p-3 md:p-4 rounded-lg min-w-[70px] md:min-w-[100px] text-center">
          {timeLeft.seconds.toString().padStart(2, "0")}
        </div>
        <span className="text-sm mt-2">SECONDES</span>
      </div>
    </div>
  )
}
