"use client"

import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export default function Interest() {
    const [text, setText] = useState("")
    const [userId, setUserId] = useState("")

    useEffect(() => {
        const fetchInterest = async () => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser()

            if (user) {
                setUserId(user.id)
                const { data } = await supabase
                    .from("UserInterests")
                    .select("sinterests")
                    .eq("iuserid", user.id)
                    .single()

                if (data?.sinterests) {
                    setText(data.sinterests)
                }
            }
        }

        fetchInterest()
    }, [])

    const handleSave = async () => {
        // Check if a row exists first
        const { data: existing, error: fetchError } = await supabase
            .from("UserInterests")
            .select("iid")
            .eq("iuserid", userId)
            .maybeSingle()

        if (fetchError) {
            console.error("Fetch failed:", fetchError.message)
            alert("Failed to check existing interests.")
            return
        }

        if (!existing) {
            alert("Cannot save: entry does not exist for user.")
            return
        }

        // Row exists – proceed to update
        const { error: updateError } = await supabase
            .from("UserInterests")
            .update({ sinterests: text })
            .eq("iuserid", userId)

        if (updateError) {
            console.error("Update failed:", updateError.message)
            alert("Failed to update interests.")
        } else {
            alert("Interests updated successfully!")
        }
    }

    const handleClear = () => {
        setText("")
    }

    return (
        <div className="space-y-14">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-semibold mt-0">Tell Us What Interests You</h1>
                <p className="text-base text-muted-foreground">
                    Access, select and plan your events instantly.
                </p>
            </div>
            <div className="h-[200px] w-full border-[3px] border-[#C7C7CC] rounded-[40px] flex items-center justify-center overflow-hidden">
                <textarea
                    className="w-full resize-none bg-transparent text-base text-center placeholder:text-base  leading-none align-middle outline-none"
                    value={text}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                    placeholder="Tell me a bit about yourself? What are your interests?"
                />
            </div>
            <div className="flex justify-center mt-8 gap-4">
                <Button
                    variant="outline"
                    className="rounded-full border-[#B9B9B9] text-black px-8 py-3 font-medium border-[2px]"
                    onClick={handleClear}
                >
                    Clear
                </Button>
                <Button
                    className="rounded-full bg-black text-white px-6 py-3 font-semibold hover:bg-black/80"
                    onClick={handleSave}
                >
                    Save Interests
                </Button>
            </div>

        </div>
    )
}
