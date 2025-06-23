"use client"
import React, { useState, useEffect } from "react"
import { Users, LinkIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import InterestView from "./interest/page"
import UrlView from "./url/page"

export default function Eventure() {

    const [activeTab, setActiveTab] = useState<"interest" | "url">("interest")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const navItemStyle =
        "px-16 py-4 rounded-full font-medium flex items-center gap-2 transition-colors hover:bg-gray-100"



    useEffect(() => {
        const fetchUserAndName = async () => {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser()

            if (user) {
                setEmail(user.email || "")

                const { data, error } = await supabase
                    .from("UserInterests")
                    .select("susername")
                    .eq("iuserid", user.id)
                    .single()

                if (data?.susername) {
                    setUsername(data.susername)
                }

                // 🔍 Debug: log both
                console.log("Email:", user.email)
                console.log("Username:", data?.susername)
            } else {
                console.log("No user logged in")
            }
        }

        fetchUserAndName()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8">

            <div className="fixed top-0 left-0 w-full px-6 py-4 bg-white z-50 flex items-center justify-between shadow-sm">
                <div className="text-xl font-bold">Eventure</div>
                <div className="text-sm font-medium">
                    {username ? `👋 ${username}` : "Loading..."}
                </div>
            </div>

            {/* Top-Centered Nav */}
            <div className="fixed top-[88px] left-1/2 -translate-x-1/2 z-40">
                <NavigationMenu>
                    <NavigationMenuList className="bg-white/80 backdrop-blur-sm rounded-full shadow-sm gap-2">
                        <NavigationMenuItem>
                            <div
                                onClick={() => setActiveTab("interest")}
                                className={
                                    navItemStyle +
                                    (activeTab === "interest"
                                        ? " bg-blue-100 text-blue-700"
                                        : " hover: cursor-pointer")
                                }
                            >
                                <Users className="w-4 h-4" />
                                My Interest
                            </div>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <div
                                onClick={() => setActiveTab("url")}
                                className={
                                    navItemStyle +
                                    (activeTab === "url"
                                        ? " bg-blue-100 text-blue-700"
                                        : " hover: cursor-pointer")
                                }
                            >
                                <LinkIcon className="w-4 h-4" />
                                URL
                            </div>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            {/* Dynamic Content Below */}
            <div className="mt-28 max-w-2xl mx-auto">
                {activeTab === "interest" && <InterestView />}
                {activeTab === "url" && <UrlView />}
            </div>
        </div>
    )
}
