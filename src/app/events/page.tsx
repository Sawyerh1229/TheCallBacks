"use client"
import { useEffect, useState, useRef } from "react"
import { ArrowLeft, MapPin, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function Events() {
    const [events, setEvents] = useState<any[]>([])
    const [selectedEvents, setSelectedEvents] = useState<number[]>([])
    const router = useRouter()
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [isReading, setIsReading] = useState<number | null>(null)
    const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || "sk_f6c66ebdd0e8e1808102f379ba71494f64901e93ad692411"
    const ELEVENLABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

    useEffect(() => {
        const stored = localStorage.getItem("fetchedEvents")
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                if (Array.isArray(parsed)) {
                    setEvents(parsed)
                } else {
                    setEvents([])
                }
            } catch (e) {
                console.error("Failed to parse stored events:", e)
                setEvents([])
            }
        } else {
            setEvents([])
        }
    }, [])

    const handleAddEvent = (eventId: number) => {
        if (selectedEvents.includes(eventId)) {
            setSelectedEvents(selectedEvents.filter((id) => id !== eventId))
        } else {
            setSelectedEvents([...selectedEvents, eventId])
        }
    }

    const handleReadAloud = async (event: any, idx: number) => {
        setIsReading(idx)
        const text = `${event.name}. ${event.date} ${event.time}. Location: ${event.location}. Description: ${event.description}`
        try {
            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "audio/mpeg",
                    "xi-api-key": ELEVENLABS_API_KEY
                },
                body: JSON.stringify({
                    text,
                    model_id: "eleven_monolingual_v1",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.5
                    }
                })
            })
            if (!response.ok) throw new Error("TTS failed")
            const audioBlob = await response.blob()
            const audioUrl = URL.createObjectURL(audioBlob)
            if (audioRef.current) {
                audioRef.current.src = audioUrl
                audioRef.current.play()
            } else {
                const audio = new Audio(audioUrl)
                audioRef.current = audio
                audio.play()
            }
        } catch (err) {
            alert("Failed to read event aloud.")
        } finally {
            setIsReading(null)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className=" px-6 py-4">
                <div className="max-w-7xl mx-auto">

                    {/* Navigation Header */}
                    <div className="p-4 flex flex-col items-start">
                        <div className="text-3xl font-bold">Eventure</div>

                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full border border-gray-300 w-32 h-14"
                            onClick={() => router.push("/eventure")}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </div>



                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Events List */}
                    <div className="lg:col-span-2 space-y-6">
                        {Array.isArray(events) && events.map((event, idx) => {
                            const isSelected = selectedEvents.includes(event.id ?? idx);
                            return (
                                <Card key={event.id ?? idx} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">{event.name}</h3>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Clock className="h-4 w-4" />
                                                <span className="text-sm">
                                                    {event.date} {event.time}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MapPin className="h-4 w-4" />
                                                <span className="text-sm">{event.location}</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>

                                        {/* Responsive button group: stack on small screens, row on large */}
                                        <div className="flex flex-col sm:flex-row gap-2 w-full mt-4">
                                            <Button
                                                onClick={() => handleAddEvent(event.id ?? idx)}
                                                className={`w-full sm:w-auto ${isSelected ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
                                            >
                                                {isSelected ? "Added ✓" : "Add Event"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full sm:w-auto border-gray-400"
                                                onClick={() => handleReadAloud(event, idx)}
                                                disabled={isReading === idx}
                                            >
                                                {isReading === idx ? "Reading..." : "Read Aloud"}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Event Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Summary</h3>

                                {selectedEvents.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No events selected yet. Add events to see your summary.</p>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            {selectedEvents.map((eventId) => {
                                                const event = events.find((e, idx) => (e.id ?? idx) === eventId)
                                                if (!event) return null

                                                return (
                                                    <div key={eventId} className="flex justify-between items-start text-sm">
                                                        <div className="flex-1 pr-2">
                                                            <p className="font-medium text-gray-900">{event.name}</p>
                                                            <p className="text-gray-500">{event.date}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <audio ref={audioRef} hidden />
        </div>
    )
}
