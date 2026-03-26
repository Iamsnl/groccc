import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

        // If the user tries to access the admin panel without the true ADMIN role, push them out
        if (isAdminRoute && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/profile", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            // By returning true if the token exists, NextAuth will automatically handle redirecting
            // strictly un-authenticated users to the `/login` page defined in your NextAuth config.
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    // Define which protected routes should trigger this middleware
    matcher: [
        "/admin/:path*",
        "/profile/:path*",
        "/checkout/:path*",
    ],
};
