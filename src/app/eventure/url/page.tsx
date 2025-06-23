"use client"

import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export default function Url() {

    const [url, setUrl] = useState("")

    const handleSubmit = () => {
        console.log("URL submitted:", url)
        // You can route or fetch data here
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
            <div className="flex justify-center">
                <Button
                    className="rounded-full bg-black text-white px-6 py-3 font-semibold hover:bg-black/80"
                >
                    Go to Events
                </Button>
            </div>
        </div>
    )
}
