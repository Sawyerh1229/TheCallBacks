"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Component() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-8">
        <h1 className="text-6xl md:text-8xl font-bold text-foreground tracking-tight">Eventure</h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" size="lg" className="px-8 bg-background text-foreground">
            <Link href="/register">Register</Link>
          </Button>
          <Button asChild size="lg" className="px-8">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}