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
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Interests</h1>
            <p className="text-sm text-muted-foreground">
                Format: interest1, interest2, interest3
            </p>
            <textarea
                className="min-h-[200px] w-full p-2 border rounded"
                value={text}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                placeholder="Write your interests here..."
            />
            <div className="flex gap-4">
                <Button variant="outline" onClick={handleClear}>
                    Clear
                </Button>
                <Button onClick={handleSave}>Save</Button>
            </div>
        </div>
    )
}
