"use client"
import { useEffect, useState } from "react"
import { ArrowLeft, MapPin, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const [events, setEvents] = useState<any[]>([])

useEffect(() => {
  const stored = localStorage.getItem("fetchedEvents")
  if (stored) {
    try {
      setEvents(JSON.parse(stored))
    } catch (e) {
      console.error("Failed to parse stored events:", e)
    }
  }
}, [])

export default function Events() {
    const [selectedEvents, setSelectedEvents] = useState<number[]>([])

    const handleAddEvent = (eventId: number) => {
        if (selectedEvents.includes(eventId)) {
            setSelectedEvents(selectedEvents.filter((id) => id !== eventId))
        } else {
            setSelectedEvents([...selectedEvents, eventId])
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
                            className="rounded-[3px] border border-gray-300 w-32 h-14"
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
                        {events.map((event) => (
                            <Card key={event.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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

                                    <Button
                                        onClick={() => handleAddEvent(event.id)}
                                        className={`w-full ${selectedEvents.includes(event.id)
                                            ? "bg-green-600 hover:bg-green-700"
                                            : "bg-blue-600 hover:bg-blue-700"
                                            }`}
                                    >
                                        {selectedEvents.includes(event.id) ? "Added ✓" : "Add Event"}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
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
                                                const event = events.find((e) => e.id === eventId)
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

                                        <div className="border-t pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-gray-900">Total:</span>
                                            </div>
                                        </div>

                                        <Button className="w-full bg-green-600 hover:bg-green-700">Proceed to Checkout</Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
