// API route to coordinate media stopping between radio and TV
import { NextResponse } from "next/server"

let activeStream: string | null = null

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { stream } = body

    if (stream === "radio") {
      activeStream = "radio"
    } else if (stream === "tv") {
      activeStream = "tv"
    }

    return NextResponse.json({ activeStream })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({ activeStream })
}
