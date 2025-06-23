"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function Url() {
    const [url, setUrl] = useState("")
    const [userId, setUserId] = useState("")
    const router = useRouter()
    const [interest, setInterest] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (user) {
                setUserId(user.id)

                const { data } = await supabase
                    .from("UserInterests")
                    .select("sinterests")
                    .eq("iuserid", user.id)
                    .single()

                if (data?.sinterests) {
                    setInterest(data.sinterests)
                    console.log("User interest:", data.sinterests)
                }
            }
        }

        fetchUser()
    }, [])

    const handleSubmit = () => {
        console.log("URL submitted:", url)
        // You can route or fetch data here
    }

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (user) setUserId(user.id)
        }

        fetchUser()
    }, [])

    const handleGoToEvents = async () => {
        if (!url || !userId) {
            alert("Please enter a URL and ensure user is loaded")
            return
        }
        setLoading(true)
        // Replace with your backend URL if not running on the same host/port
        const backendUrl = "http://127.0.0.1:8000/extract-events"

        try {
            const response = await fetch(backendUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url: url,
                    interests: interest
                })
            })

            const data = await response.json()

            if (data?.events) {
                console.log("Fetched events:", data.events)
                localStorage.setItem("fetchedEvents", JSON.stringify(data.events))
                router.push("/events")
            } else {
                alert("No events returned.")
            }
        } catch (e) {
            alert("Failed to fetch events.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-14">
            {/* Title */}
            <div className="flex flex-col items-center text-center mb-6">
                <h1 className="text-2xl font-semibold">Enter Your Event URL & Tell Us What Interests You</h1>
                <p className="text-base text-muted-foreground">
                    Access, select and plan your events instantly.
                </p>
            </div>

            {/* Search Bar */}
            <div className="flex justify-center mb-10">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="http://paste-your-next-event-here.com"
                    className="w-full max-w-xl px-6 py-4 border-[2px] border-[#C7C7CC] rounded-[40px] focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                />
            </div>

            {/* Button */}
            <div className="flex justify-center items-center gap-4">
                <Button
                    onClick={handleGoToEvents}
                    className="rounded-full bg-black text-white px-6 py-3 font-semibold hover:bg-black/80"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="animate-spin h-5 w-5" />
                            Loading...
                        </span>
                    ) : (
                        "Go to Events"
                    )}
                </Button>
            </div>
        </div>
    )
}
