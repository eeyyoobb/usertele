import { getSession, updateSession } from "@/utils/session";
import { routeAccessMap } from "@/lib/roadmap"; // Ensure this map is correctly defined
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Utility function to match routes
function createRouteMatcher(routes: string[]) {
  return (req: NextRequest) => routes.some((route) => req.nextUrl.pathname.startsWith(route));
}

// Generate matchers for routes and their allowed roles
const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

export async function middleware(request: NextRequest) {
  // Get the current session
  const session = await getSession();
  console.log("Session:", session);

  if (!session) {
    // Redirect to the home page if the session is invalid or missing
    return NextResponse.redirect(new URL("/", request.url));
  }


const userRole = session?.user?.role;


  // Check if the route is protected and validate user role
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(request)) {
      if (!allowedRoles.includes(userRole)) {
        // Redirect to an unauthorized page if the role is not allowed
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
  }

  // Update the session to refresh expiration and continue processing
  return updateSession(request);
}

// Config to define which routes should use this middleware
export const config = {
  matcher: [
    "/protected/:path*", // Protect all routes under /protected
    "/api/:path*", // Protect all API routes
    // Exclude static files and Next.js internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
