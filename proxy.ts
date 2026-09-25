import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isSystemHostname } from "@/lib/domains";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const hostname = req.headers.get("host") || "";
  const { pathname } = req.nextUrl;


  // 1. Protect dashboard routes with Clerk
  if (isProtectedRoute(req)) {
    await auth.protect();
    return NextResponse.next();
  }

  // 2. Normal EstateFlow hostname → continue standard routing
  if (isSystemHostname(hostname)) {
    return NextResponse.next();
  }

  // 3. Do not rewrite internal/system routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/p/") ||
    pathname.startsWith("/domain-resolver") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 4. Custom domain → internally render domain resolver
  const url = req.nextUrl.clone();

  url.pathname = "/domain-resolver";
  url.searchParams.set("host", hostname);
  return NextResponse.rewrite(url);
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};