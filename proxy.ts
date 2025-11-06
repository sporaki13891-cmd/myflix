import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Αν δεν υπάρχει token και πάει σε προστατευμένη σελίδα, redirect στο login
  if (!token && pathname !== "/login" && pathname !== "/register") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Αν υπάρχει token και πάει στο /login ή /register, redirect στο /profiles
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/profiles", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/profiles", "/watch/:path*"],
};
