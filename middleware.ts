import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  // For now, allow all requests through
  // Client-side auth handling with JWT tokens
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
