"use client"
import { useState } from "react"
import { ArrowLeft, MapPin, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const hardcodedEvents = [
  {
    id: 1,
    name: "BetaKit Town Hall: Most Ambitious",
    date: "June 23, 2025",
    time: "5:00 PM - 8:00 PM",
    location: "Toronto Convention Centre, Toronto",
    description:
      "The BetaKit Town Hall is the marquee event on the Canadian tech calendar and the official kickoff to Toronto Tech Week 2025. This year's event will feature discussions on groundbreaking products and world-changing visions from Canadian tech leaders.",
  },
  {
    id: 2,
    name: "Toronto Tech Week 2025: Homecoming",
    date: "June 24, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "Metro Toronto Convention Centre, Toronto",
    description:
      "Homecoming is the official mainstage of Toronto Tech Week 2025. More than just an event — it's a showcase for the tech community, celebrating both foundational and future-building efforts.",
  },
  {
    id: 3,
    name: "Tech for Canada Conference",
    date: "June 27, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "King Street West, Toronto",
    description:
      "A three-day series of panels and fireside chats with Canadian business leaders discussing emergent tools and methods across various fields including technology.",
  },
]

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
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-lg font-medium text-gray-600 mb-4">Event List Page</h1>

          {/* Navigation Header */}
          <div className="border-2 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="text-xl font-bold">Eventure</div>
            </div>
          
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Events List */}
          <div className="lg:col-span-2 space-y-6">
            {hardcodedEvents.map((event) => (
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
                    className={`w-full ${
                      selectedEvents.includes(event.id)
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
                        const event = hardcodedEvents.find((e) => e.id === eventId)
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
