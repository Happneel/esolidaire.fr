import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/maintenance") {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL("/maintenance", request.url));
}

export const config = {
  // Tout le site est rebasculé vers /maintenance, sauf les assets.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw.js|manifest|icons|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|xml)).*)",
  ],
};
