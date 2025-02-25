import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = (pathname: string) => {
  return (
    pathname.startsWith("/login") ||
    pathname === "/" ||
    pathname.startsWith("/register")
  );
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const user = request.cookies.get("user")?.value;
  const pathname = request.nextUrl.pathname;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (!token || !user) {
    const url = new URL(`/login`, request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/",
    "/dashboard/(.*)",
  ],
};
